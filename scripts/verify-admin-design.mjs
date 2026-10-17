import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
for (const file of ['.env.local', '.env']) if (existsSync(file)) process.loadEnvFile(file);
const base = (process.env.BASE_URL ?? 'http://localhost:3100').replace(/\/$/, '');
let cookie = '';
let passed = 0;
async function check(name, task) { await task(); passed++; console.log(`PASS ${name}`); }
async function request(path, options = {}) {
  return fetch(base + path, { ...options, redirect: 'manual', headers: { ...(cookie ? { cookie } : {}), ...(options.method ? { origin: base, 'content-type': 'application/json' } : {}), ...options.headers } });
}
async function json(path) { const response = await request(path); assert.equal(response.status, 200, `${path}: HTTP ${response.status}`); return response.json(); }
async function page(path, expected) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  const html = await response.text();
  assert.ok(html.includes(expected), `${path}: expected content missing`);
  assert.ok(!html.includes('This page couldn&#x27;t load') && !html.includes('NEXT_HTTP_ERROR_FALLBACK;500'), `${path}: server error`);
  return html;
}
try {
  await check('Unauthenticated admin API stays protected', async () => { assert.equal((await request('/api/media')).status, 401); });
  await check('Redesigned login and generated admin CSS are served', async () => {
    const html = await page('/admin/login', 'Welcome back');
    const cssPaths = [...html.matchAll(/href="([^" ]+\.css(?:\?[^" ]*)?)"/g)].map((match) => match[1]);
    const css = (await Promise.all(cssPaths.map(async (path) => (await request(path)).text()))).join('\n');
    for (const selector of ['.admin-outlet', '.admin-editor', '.admin-resource-row', '.admin-login-grid', '.admin-overview-grid', '.admin-collection-summary', '.admin-publication-ring', '.admin-content-map', '.admin-dialog']) assert.ok(css.includes(selector), `${selector} not emitted`);
    assert.ok(css.includes('@container admin-outlet'), 'Outlet container queries not emitted');
  });
  await check('Existing admin sign-in succeeds', async () => {
    assert.ok(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD, 'Admin credentials unavailable');
    const response = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }) });
    assert.equal(response.status, 200, 'Sign-in failed');
    cookie = (response.headers.get('set-cookie') ?? '').split(';')[0];
    assert.ok(cookie, 'Session cookie missing');
  });
  const routes = [
    ['/admin', 'Recent activity'], ['/admin/projects', 'Find a project'], ['/admin/projects?publishStatus=draft', 'Draft'],
    ['/admin/skills', 'Manage categories'], ['/admin/skills/categories', 'Skill categories'], ['/admin/services', 'Services'],
    ['/admin/education', 'Education'], ['/admin/experience', 'Experience'], ['/admin/content', 'Shared sections'],
    ['/admin/media', 'Search your library'], ['/admin/settings', 'Editor sections'], ['/admin/profile', 'Password &amp; security'],
  ];
  for (const [path, expected] of routes) await check(`Admin route ${path}`, () => page(path, expected));
  for (const resource of ['projects', 'skills', 'skills/categories', 'services', 'education', 'experience']) {
    await check(`New editor ${resource}`, async () => { const html = await page(`/admin/${resource}/new`, 'New record'); assert.ok(!html.includes('All changes saved'), 'Misleading new-record state'); });
  }
  for (const section of ['hero', 'home', 'about', 'skills', 'fullStack', 'education', 'experience', 'projects', 'services', 'contact', 'cta', 'footer']) await check(`Content editor ${section}`, () => page(`/admin/content/${section}`, 'Save changes'));
  for (const [api, route] of [['projects','projects'], ['skills','skills'], ['skill-categories','skills/categories'], ['services','services'], ['education','education'], ['experience','experience']]) {
    await check(`Existing ${route} editor`, async () => {
      const result = await json(`/api/${api}`);
      const item = result.data[0];
      if (!item) { console.log(`  No existing ${route} record; new editor was checked`); return; }
      await page(`/admin/${route}/${item.id}`, 'Record details');
      if (api === 'projects') await page(`/admin/projects/${item.id}/preview`, 'Back to editor');
    });
  }
  await check('Media pagination, usage filters, and collection search', async () => {
    const [all, used, unused, none] = await Promise.all(['/api/media?limit=2', '/api/media?usage=used&limit=2', '/api/media?usage=unused&limit=2', '/api/media?q=__admin_design_no_match_9f3c__'].map(json));
    assert.equal(all.meta.total, used.meta.total + unused.meta.total, 'Usage totals do not reconcile');
    assert.equal(none.meta.total, 0, 'Search not applied');
    assert.ok(all.data.length <= 2, 'Limit not applied');
    assert.ok(used.data.every((asset) => asset.usageCount > 0), 'Used filter incorrect');
    assert.ok(unused.data.every((asset) => !asset.usageCount), 'Unused filter incorrect');
    if (all.meta.total > 2) { const next = await json('/api/media?limit=2&page=2'); assert.equal(next.meta.page, 2); assert.ok(next.data.every((item) => !all.data.some((previous) => previous.id === item.id)), 'Pagination repeats records'); }
  });
  await check('System palette values preserved', async () => {
    const css = readFileSync('src/app/globals.css', 'utf8');
    for (const value of ['#4f46e5','#8b93ff','#0891b2','#22d3ee','#f7f7f9','#08080c','#ffffff','#111117']) assert.ok(css.includes(value), `Missing system color ${value}`);
  });
  console.log(`\n${passed} checks passed. No portfolio content was modified. Browser interaction and visual layout were not tested.`);
} catch (error) {
  console.error('FAIL', error.message);
  process.exitCode = 1;
} finally {
  if (cookie) await request('/api/auth/logout', { method: 'POST', body: '{}' }).catch(() => {});
}
