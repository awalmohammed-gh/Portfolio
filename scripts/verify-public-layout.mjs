import assert from "node:assert/strict";

const origin = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const response = await fetch(origin);
assert.equal(response.status, 200, "Homepage must load");
const html = await response.text();
const hero = html.match(/<section aria-labelledby="hero-heading"[\s\S]*?<\/section>/)?.[0];
const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
assert.ok(hero && header, "Public hero and navigation must render");

// A CSS loader once erased module exports. The markup contained 'undefined'
// classes and the absolutely positioned image covered the entire page.
const stylesheetPaths = [...html.matchAll(/href="([^" ]+\.css(?:\?[^" ]*)?)"/g)].map((match) => match[1]);
assert.ok(stylesheetPaths.length, "Stylesheets must be linked");
const css = (await Promise.all(stylesheetPaths.map(async (path) => {
  const sheet = await fetch(new URL(path, origin));
  assert.equal(sheet.status, 200, "Stylesheet must be available");
  return sheet.text();
}))).join("\n");

for (const [label, markup] of [["Hero", hero], ["Navbar", header]]) {
  const classes = [...markup.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/));
  assert.ok(!classes.includes("undefined"), `${label}: CSS Module exports must resolve`);
  // Turbopack shortens module names in production. The exported key suffix
  // remains stable in both development and production.
  const keys = label === "Hero"
    ? ["hero", "banner", "heroGrid", "visual", "photoShade", "copy", "badge", "badgeDot", "heading", "highlight", "intro", "description", "actions", "secondaryCta", "details", "stack", "projectSummary", "education", "withoutImage", "withoutEducation", "withoutStack"]
    : ["header", "nav"];
  const scopedClasses = [...new Set(classes.filter((name) => keys.some((key) => name.endsWith(`_${key}`))))];
  assert.ok(scopedClasses.length > 0, `${label}: scoped styles must be attached`);
  for (const name of scopedClasses) assert.ok(css.includes(`.${name}`), `${label}: class must exist in the served CSS`);
}
console.log("PASS hero and navbar module classes resolve to served CSS");

const contentResponse = await fetch(`${origin}/api/content/hero`);
assert.equal(contentResponse.status, 200);
const { data: { data: content } } = await contentResponse.json();
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const text = hero.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
for (const value of [content.heading.lead, content.heading.highlight, content.badge, content.intro, content.description, content.coreStackTitle, content.projectsCardLabel, content.projectsCardCaption]) {
  if (value) assert.ok(text.includes(escapeHtml(value)), "CMS hero content must remain visible in the markup");
}
for (const cta of [content.primaryCta, content.secondaryCta]) {
  if (cta.href && cta.label) {
    assert.ok(hero.includes(`href="${escapeHtml(cta.href)}"`), "CTA destination must remain available");
    assert.ok(text.includes(escapeHtml(cta.label)), "CTA label must remain available");
  }
}
console.log("PASS saved hero copy and both calls to action are rendered");

if (content.image) {
  const image = hero.match(/<img\b[^>]*data-nimg="fill"[^>]*>/)?.[0];
  assert.ok(image?.includes("object-fit:cover"), "Hero image must preserve its aspect ratio");
  assert.ok(!image.includes("transform:"), "Hero image must not have extra zoom");
  assert.ok(hero.indexOf("_visual") < hero.indexOf("_copy"), "Image layer must precede the content layer");
  assert.equal((hero.match(/data-hero-layer="image"/g) ?? []).length, 1, "Banner must have one background image layer");
  assert.equal((hero.match(/data-hero-layer="overlay"/g) ?? []).length, 1, "Banner must have a separate dark overlay");
  assert.equal((hero.match(/data-hero-layer="content"/g) ?? []).length, 2, "Both hero copy and summary must sit over the photo");
}
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, "Homepage must keep one primary heading");
console.log("PASS proportional image sizing and hero content structure");
console.log("Public rendering checks passed. Browser appearance and interaction are not tested by this script.");
