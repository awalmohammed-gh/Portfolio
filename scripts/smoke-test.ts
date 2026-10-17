/*
 * End-to-end smoke test against a running server.
 *
 *   npm run build && npx next start -p 3100
 *   BASE_URL=http://localhost:3100 npm run test:smoke
 *
 * Uses ADMIN_EMAIL / ADMIN_PASSWORD from the env file. Creates records
 * prefixed "Smoke Test" (and one tiny Cloudinary image) and removes them
 * again. Restores any page content it edits.
 */
import assert from "node:assert/strict";
import { deflateSync } from "node:zlib";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import { RateLimitModel } from "@/models/Auth";
import { loadEnv } from "./load-env";

loadEnv();
const BASE = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const ORIGIN = new URL(BASE).origin;

let cookie = "";
let passed = 0;
const failures: string[] = [];

async function step(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`  ✗ ${name}\n      ${(error as Error).message.split("\n").join("\n      ")}`);
  }
}

type Json = { data?: any; error?: { message: string; fields?: Record<string, string> }; meta?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

async function call(method: string, path: string, body?: unknown, opts: { origin?: string | null; auth?: boolean } = {}) {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (opts.origin !== null) headers.origin = opts.origin ?? ORIGIN;
  if (opts.auth !== false && cookie) headers.cookie = cookie;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  const json = (await res.json().catch(() => ({}))) as Json;
  return { status: res.status, json, headers: res.headers };
}

async function page(path: string, auth = false) {
  const res = await fetch(`${BASE}${path}`, { headers: auth && cookie ? { cookie } : {}, redirect: "manual" });
  return { status: res.status, html: await res.text(), headers: res.headers };
}

/** Polls a public page until it contains (or no longer contains) text: proves cache invalidation. */
async function eventually(path: string, text: string, present = true) {
  for (let i = 0; i < 10; i++) {
    const { html } = await page(path);
    if (html.includes(text) === present) return;
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`${path} ${present ? "never showed" : "still shows"} "${text}"`);
}

/** A valid 2×2 PNG, generated so the upload test needs no fixture file. */
function tinyPng(): Uint8Array {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf: Buffer) => {
    let c = 0xffffffff;
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, sum]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(2, 0);
  ihdr.writeUInt32BE(2, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  const raw = Buffer.from([0, 79, 70, 229, 79, 70, 229, 0, 79, 70, 229, 79, 70, 229]);
  return new Uint8Array(
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw)),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

async function upload(bytes: Uint8Array, name: string, type: string) {
  const form = new FormData();
  form.append("file", new Blob([Buffer.from(bytes)], { type }), name);
  const res = await fetch(`${BASE}/api/media/upload`, { method: "POST", headers: { origin: ORIGIN, cookie }, body: form });
  return { status: res.status, json: (await res.json().catch(() => ({}))) as Json };
}

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  assert.ok(email && password, "Set ADMIN_EMAIL and ADMIN_PASSWORD to run the smoke test");

  // Start from clean rate-limit counters so repeated runs don't lock the account.
  await connectToDatabase();
  await RateLimitModel.deleteMany({});

  console.log(`\nSmoke testing ${BASE}\n\nPublic site`);
  for (const path of ["/", "/about", "/projects", "/services", "/contact", "/projects/greenfarm", "/sitemap.xml", "/robots.txt"]) {
    await step(`GET ${path} → 200`, async () => assert.equal((await page(path)).status, 200));
  }
  await step("Homepage renders content from MongoDB", async () => {
    const { html } = await page("/");
    assert.ok(html.includes("Frontend to Backend."), "hero heading missing");
    assert.ok(html.includes("GreenFarm E-commerce System"), "featured project missing");
    assert.ok(html.includes("Website Development"), "service missing");
  });
  await step("Unknown project slug → 404", async () => assert.equal((await page("/projects/does-not-exist")).status, 404));
  await step("robots.txt disallows /admin", async () => assert.match((await page("/robots.txt")).html, /Disallow: \/admin/));
  await step("Health check reports database ok", async () => {
    const res = await call("GET", "/api/health");
    assert.equal(res.status, 200);
    assert.equal((res.json as { database?: string }).database, "ok");
  });

  console.log("\nAccess control");
  await step("/admin without a session redirects to /admin/login", async () => {
    const res = await page("/admin");
    assert.ok([302, 307].includes(res.status), `status ${res.status}`);
    assert.match(res.headers.get("location") ?? "", /\/admin\/login$/);
  });
  await step("Write API without a session → 401", async () => {
    assert.equal((await call("POST", "/api/projects", { title: "x" })).status, 401);
  });
  await step("Media library API without a session → 401", async () => assert.equal((await call("GET", "/api/media")).status, 401));

  console.log("\nAuthentication");
  await step("Login with a wrong password → 401 with a generic message", async () => {
    const res = await call("POST", "/api/auth/login", { email, password: "definitely-wrong-password" });
    assert.equal(res.status, 401);
    assert.equal(res.json.error?.message, "Incorrect email or password.");
  });
  await step("Login with an unknown email → same 401 message", async () => {
    const res = await call("POST", "/api/auth/login", { email: "nobody@example.com", password: "whatever-password" });
    assert.equal(res.status, 401);
    assert.equal(res.json.error?.message, "Incorrect email or password.");
  });
  await step("Login validation rejects a malformed email → 422", async () => {
    const res = await call("POST", "/api/auth/login", { email: "not-an-email", password: "x" });
    assert.equal(res.status, 422);
    assert.ok(res.json.error?.fields?.email);
  });
  await step("Cross-origin login attempt → 403", async () => {
    assert.equal((await call("POST", "/api/auth/login", { email, password }, { origin: "https://evil.example" })).status, 403);
  });
  await step("Valid login → 200 and an HttpOnly, SameSite session cookie", async () => {
    const res = await call("POST", "/api/auth/login", { email, password });
    assert.equal(res.status, 200, JSON.stringify(res.json));
    const setCookie = res.headers.get("set-cookie") ?? "";
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=lax/i);
    assert.match(setCookie, /Path=\//i);
    if (BASE.startsWith("https") || process.env.NODE_ENV === "production") assert.match(setCookie, /Secure/i);
    cookie = setCookie.split(";")[0];
  });
  await step("Session persists across requests (GET /api/auth/me)", async () => {
    const res = await call("GET", "/api/auth/me");
    assert.equal(res.status, 200);
    assert.equal(res.json.data.email, email);
    assert.equal(res.json.data.passwordHash, undefined);
  });
  await step("Dashboard renders for the signed-in admin", async () => {
    const { status, html } = await page("/admin", true);
    assert.equal(status, 200);
    assert.ok(html.includes("Portfolio Admin"));
  });
  await step("Signed-in write from another origin → 403 (CSRF)", async () => {
    assert.equal((await call("POST", "/api/services", { title: "x", description: "y" }, { origin: "https://evil.example" })).status, 403);
  });

  console.log("\nProjects");
  let projectId = "";
  let slug = "";
  await step("Server-side validation → 422 with field errors", async () => {
    const res = await call("POST", "/api/projects", { title: "", liveUrl: "javascript:alert(1)", icon: "NotAnIcon" });
    assert.equal(res.status, 422);
    assert.ok(res.json.error?.fields?.title, "title error");
    assert.ok(res.json.error?.fields?.liveUrl, "liveUrl error");
    assert.ok(res.json.error?.fields?.icon, "icon error");
  });
  await step("Create a draft project → 201 with a generated slug", async () => {
    const res = await call("POST", "/api/projects", {
      title: "Smoke Test Project",
      category: "Testing",
      summary: "A temporary project created by the smoke test.",
      description: "Created and removed automatically.",
      technologies: ["Next.js"],
      publishStatus: "draft",
    });
    assert.equal(res.status, 201, JSON.stringify(res.json));
    projectId = res.json.data.id;
    slug = res.json.data.slug;
    assert.equal(slug, "smoke-test-project");
  });
  await step("Drafts are hidden from the public API and pages", async () => {
    const pub = await call("GET", "/api/projects", undefined, { auth: false });
    assert.ok(!pub.json.data.some((p: { id: string }) => p.id === projectId));
    assert.equal((await page(`/projects/${slug}`)).status, 404);
    await eventually("/projects", "Smoke Test Project", false);
  });
  await step("Admins can read drafts (and preview them)", async () => {
    assert.equal((await call("GET", `/api/projects/${projectId}`)).status, 200);
    const preview = await page(`/admin/projects/${projectId}/preview`, true);
    assert.equal(preview.status, 200);
    assert.ok(preview.html.includes("Smoke Test Project"));
  });
  await step("Publishing makes it appear on the public site without a rebuild", async () => {
    const res = await call("PATCH", `/api/projects/${projectId}`, { publishStatus: "published" });
    assert.equal(res.status, 200, JSON.stringify(res.json));
    await eventually("/projects", "Smoke Test Project");
    // First visit to a slug that didn't exist at build time must render that project.
    const detail = await page(`/projects/${slug}`);
    assert.equal(detail.status, 200);
    assert.match(detail.html, /<title>Smoke Test Project \|/);
  });
  await step("Editing updates the public page", async () => {
    const res = await call("PATCH", `/api/projects/${projectId}`, { title: "Smoke Test Project Renamed", slug });
    assert.equal(res.status, 200, JSON.stringify(res.json));
    await eventually("/projects", "Smoke Test Project Renamed");
  });
  await step("Partial PATCH still validates the merged record", async () => {
    assert.equal((await call("PATCH", `/api/projects/${projectId}`, { githubUrl: "not a url" })).status, 422);
  });
  await step("Reorder projects", async () => {
    const list = await call("GET", "/api/projects?sort=order");
    const ids: string[] = list.json.data.map((p: { id: string }) => p.id);
    const reordered = [projectId, ...ids.filter((id) => id !== projectId)];
    assert.equal((await call("POST", "/api/projects/reorder", { ids: reordered })).status, 200);
    const after = await call("GET", "/api/projects?sort=order", undefined, { auth: false });
    assert.equal(after.json.data[0].id, projectId);
    // Put the original order back.
    await call("POST", "/api/projects/reorder", { ids: [...ids.filter((id) => id !== projectId), projectId] });
  });
  await step("Public API supports search, filters and pagination", async () => {
    const res = await call("GET", "/api/projects?q=greenfarm&limit=1&page=1", undefined, { auth: false });
    assert.equal(res.status, 200);
    assert.equal(res.json.data.length, 1);
    assert.equal(res.json.meta.limit, 1);
    assert.equal((await call("GET", "/api/projects?sort=hacked")).status, 400);
  });

  console.log("\nImages (Cloudinary)");
  let assetId = "";
  let publicId = "";
  await step("Non-image content is rejected even with an image extension → 415", async () => {
    const res = await upload(new TextEncoder().encode("<svg onload=alert(1)>"), "evil.png", "image/png");
    assert.equal(res.status, 415);
  });
  await step("Upload an image → stored in Cloudinary and the media library", async () => {
    const res = await upload(tinyPng(), "smoke-test.png", "image/png");
    assert.equal(res.status, 201, JSON.stringify(res.json));
    assetId = res.json.data.id;
    publicId = res.json.data.publicId;
    assert.match(res.json.data.url, /^https:\/\/res\.cloudinary\.com\//);
  });
  await step("Use it as the project cover; the public page shows it", async () => {
    const asset = (await call("GET", `/api/media/${assetId}`)).json.data;
    const res = await call("PATCH", `/api/projects/${projectId}`, {
      coverImage: { url: asset.url, publicId: asset.publicId, width: asset.width, height: asset.height, alt: "Smoke" },
    });
    assert.equal(res.status, 200, JSON.stringify(res.json));
    await eventually(`/projects/${slug}`, encodeURIComponent(asset.url).slice(0, 40));
  });
  await step("Deleting an image that's in use is refused → 409", async () => {
    assert.equal((await call("DELETE", `/api/media/${assetId}`)).status, 409);
  });

  console.log("\nCleanup & deletion");
  await step("Delete the project → 200 and its orphaned image is removed from Cloudinary", async () => {
    assert.equal((await call("DELETE", `/api/projects/${projectId}`)).status, 200);
    assert.equal((await call("GET", `/api/media/${assetId}`)).status, 404, "media record should be gone");
    await eventually("/projects", "Smoke Test Project Renamed", false);
    assert.ok(publicId);
  });

  console.log("\nServices, skills & content");
  let serviceId = "";
  await step("Create a visible service → appears on /services", async () => {
    const res = await call("POST", "/api/services", {
      title: "Smoke Test Service",
      description: "Temporary.",
      icon: "FaRocket",
      includes: ["One"],
      visible: true,
    });
    assert.equal(res.status, 201, JSON.stringify(res.json));
    serviceId = res.json.data.id;
    await eventually("/services", "Smoke Test Service");
  });
  await step("Hide it → disappears from /services", async () => {
    assert.equal((await call("PATCH", `/api/services/${serviceId}`, { visible: false })).status, 200);
    await eventually("/services", "Smoke Test Service", false);
  });
  await step("Delete the service", async () => assert.equal((await call("DELETE", `/api/services/${serviceId}`)).status, 200));

  await step("Create, show and delete a skill", async () => {
    const categories = (await call("GET", "/api/skill-categories")).json.data;
    const res = await call("POST", "/api/skills", { name: "Smoke Test Skill", icon: "SiDocker", categoryId: categories[0].id, visible: true });
    assert.equal(res.status, 201, JSON.stringify(res.json));
    await eventually("/about", "Smoke Test Skill");
    assert.equal((await call("DELETE", `/api/skills/${res.json.data.id}`)).status, 200);
    await eventually("/about", "Smoke Test Skill", false);
  });
  await step("A category with skills can't be deleted → 409", async () => {
    const categories = (await call("GET", "/api/skill-categories")).json.data;
    assert.equal((await call("DELETE", `/api/skill-categories/${categories[0].id}`)).status, 409);
  });

  await step("Editing page content updates the homepage, then restores it", async () => {
    const original = (await call("GET", "/api/content/hero")).json.data.data;
    const res = await call("PATCH", "/api/content/hero", { ...original, badge: "Smoke Test Badge" });
    assert.equal(res.status, 200, JSON.stringify(res.json));
    await eventually("/", "Smoke Test Badge");
    assert.equal((await call("PATCH", "/api/content/hero", original)).status, 200);
    await eventually("/", "Smoke Test Badge", false);
  });
  await step("Content validation blocks unsafe links → 422", async () => {
    const original = (await call("GET", "/api/content/hero")).json.data.data;
    const res = await call("PATCH", "/api/content/hero", { ...original, primaryCta: { label: "x", href: "javascript:alert(1)" } });
    assert.equal(res.status, 422);
  });
  await step("Settings validation rejects a bad email → 422", async () => {
    assert.equal((await call("PATCH", "/api/settings", { email: "nope" })).status, 422);
  });
  await step("Unknown content section → 404", async () => assert.equal((await call("GET", "/api/content/nope")).status, 404));

  console.log("\nSession end");
  await step("Logout → session cookie cleared and token revoked server-side", async () => {
    const old = cookie;
    const res = await call("POST", "/api/auth/logout");
    assert.equal(res.status, 200);
    cookie = old; // replay the old token
    assert.equal((await call("GET", "/api/auth/me")).status, 401);
    cookie = "";
  });
  await step("Login is rate limited after repeated failures → 429", async () => {
    let last = 0;
    for (let i = 0; i < 6; i++) {
      last = (await call("POST", "/api/auth/login", { email: "ratelimit-test@example.com", password: "wrong-password" })).status;
    }
    assert.equal(last, 429);
  });

  await RateLimitModel.deleteMany({});
  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log(`Failed: ${failures.join("; ")}`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => disconnectFromDatabase());
