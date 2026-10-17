import assert from "node:assert/strict";
import { existsSync } from "node:fs";

for (const path of [".env.local", ".env"]) if (existsSync(path)) process.loadEnvFile(path);
const origin = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
let session = "";
let checks = 0;
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
async function check(label, task) { await task(); checks++; console.log(`PASS ${label}`); }
async function request(path, { collapsed = false, method, body } = {}) {
  return fetch(`${origin}${path}`, {
    method, redirect: "manual",
    headers: {
      ...(session ? { cookie: `${session}; admin_sidebar=${collapsed ? "collapsed" : "expanded"}` } : {}),
      ...(method ? { origin, "content-type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function page(path, collapsed = false) {
  const response = await request(path, { collapsed });
  assert.equal(response.status, 200, `Page must load: ${path}`);
  const html = await response.text();
  assert.ok(!html.includes("This page couldn&#x27;t load"), `Page must not show an error: ${path}`);
  const mode = collapsed ? "true" : "false";
  const sidebar = html.match(new RegExp(`<aside id="admin-desktop-sidebar"[^>]*data-collapsed="${mode}"[\\s\\S]*?<\\/aside>`))?.[0];
  assert.ok(sidebar, `Sidebar preference must be respected: ${path}`);
  const header = html.match(/<header class="admin-topbar"[\s\S]*?<\/header>/)?.[0] ?? "";
  return { html, sidebar, header };
}

try {
  await check("Admin API still requires authentication", async () => assert.equal((await request("/api/auth/me")).status, 401));
  await check("Existing admin can sign in", async () => {
    assert.ok(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD, "Existing admin credentials are required");
    const response = await request("/api/auth/login", { method: "POST", body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD } });
    assert.equal(response.status, 200);
    session = (response.headers.get("set-cookie") ?? "").split(";")[0];
    assert.ok(session);
  });
  const identity = (await (await request("/api/auth/me")).json()).data;
  await check("Overview publishing totals reflect saved projects", async () => {
    const projects = (await (await request("/api/projects")).json()).data;
    const published = projects.filter((project) => project.publishStatus === "published").length;
    const { html } = await page("/admin");
    const clean = html.replace(/<!--.*?-->/gs, "");
    const feature = clean.match(/class="admin-feature-value"[\s\S]*?<\/section>/)?.[0] ?? "";
    assert.ok(feature.includes(`<span>${projects.length}</span>`), "Project total must match saved records");
    if (projects.length) {
      const publishing = clean.match(/class="admin-publishing-body"[\s\S]*?<\/section>/)?.[0] ?? "";
      assert.ok(publishing.includes(`<strong>${Math.round(published / projects.length * 100)}%</strong>`), "Published percentage must be calculated from saved records");
      assert.ok(publishing.includes(`href="/admin/projects?publishStatus=published">${published}`));
      assert.ok(publishing.includes(`href="/admin/projects?publishStatus=draft">${projects.length - published}`));
    } else assert.ok(clean.includes("Your first project awaits"));
  });
  await check("Expanded sidebar, pinned account controls and real profile", async () => {
    const { html, sidebar, header } = await page("/admin");
    assert.ok(html.includes('data-sidebar="expanded"'));
    assert.ok(sidebar.includes('class="admin-nav-text"'));
    assert.ok(sidebar.includes('class="admin-sidebar-account"'));
    assert.ok(sidebar.includes(escapeHtml(identity.name)));
    assert.ok(header.includes('aria-label="Collapse sidebar"'));
    assert.ok(header.includes("View Portfolio"));
    assert.ok(html.includes('popover="auto"') && html.includes('role="menu"'));
    assert.ok(html.includes(escapeHtml(identity.email)), "Profile menu must use the real signed-in account");
  });
  await check("Collapsed cookie renders icon navigation and expandable control", async () => {
    const { html, sidebar, header } = await page("/admin/projects", true);
    assert.ok(html.includes('data-sidebar="collapsed"'));
    for (const name of ["Overview", "Projects", "Skills", "Categories", "Services", "Education", "Experience", "Page content", "Media library", "Site settings", "My account"]) {
      assert.ok(sidebar.includes(`aria-label="${name}"`), `Collapsed link must stay named: ${name}`);
    }
    assert.ok(header.includes('aria-label="Expand sidebar"'));
    assert.ok(header.includes('aria-expanded="false"'));
  });
  await check("Drawer preserves navigation, account controls and modal semantics", async () => {
    const { html } = await page("/admin");
    const drawer = html.match(/<dialog[^>]*id="admin-drawer"[\s\S]*?<\/dialog>/)?.[0] ?? "";
    assert.ok(drawer.includes('aria-label="Admin navigation"'));
    assert.ok(drawer.includes('aria-label="Close navigation"'));
    assert.ok(drawer.includes('class="admin-sidebar-account"'));
    assert.ok(drawer.includes('href="/admin/projects"'));
    assert.ok(html.includes('aria-haspopup="dialog"'));
  });
  const contexts = [
    ["/admin/projects/new", "New project", "/admin/projects"],
    ["/admin/skills/categories", "Categories", "/admin/skills/categories"],
    ["/admin/skills/categories/new", "New category", "/admin/skills/categories"],
    ["/admin/content/hero", "Homepage hero", "/admin/content"],
    ["/admin/settings", "Site settings", "/admin/settings"],
  ];
  for (const [path, label, active] of contexts) await check(`Breadcrumb and active route: ${path}`, async () => {
    const { header, sidebar } = await page(path);
    assert.ok(header.includes('aria-label="Workspace breadcrumb"'));
    assert.ok(header.includes(`<span aria-current="page">${label}</span>`));
    const links = sidebar.match(/<a\b[^>]*>/g) ?? [];
    const current = links.filter((link) => link.includes('aria-current="page"'));
    assert.equal(current.length, 1, "Exactly one sidebar link must be current");
    assert.ok(current[0].includes(`href="${active}"`));
  });
  await check("Record identifiers are replaced with readable edit context", async () => {
    const result = await (await request("/api/projects")).json();
    const project = result.data[0];
    assert.ok(project, "An existing project is needed for this check");
    const { header } = await page(`/admin/projects/${project.id}`, true);
    assert.ok(header.includes("Edit project"));
    assert.ok(!header.includes(project.id));
  });
  await check("Purpose-built collection layouts and project view controls", async () => {
    for (const [path, marker] of [["/admin/projects?view=grid", "admin-projects-grid"], ["/admin/skills", "admin-skills-groups"], ["/admin/services", "admin-services-list"], ["/admin/education", "admin-history-list"]]) {
      const { html } = await page(path);
      assert.ok(html.includes(marker), `Collection layout missing: ${path}`);
    }
  });
  console.log(`\n${checks} navigation checks passed. No portfolio content was changed. Pointer, keyboard, animation and viewport behavior still require browser testing.`);
} finally {
  if (session) await request("/api/auth/logout", { method: "POST", body: {} }).catch(() => {});
}
