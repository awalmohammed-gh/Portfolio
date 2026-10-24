/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 1. High-res standard icon SVG (512x512)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#4338ca" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="124" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="6" />

  <g filter="url(#shadow)">
    <text x="246" y="324" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="190" font-weight="900" fill="#ffffff" letter-spacing="-6">MA</text>
    <circle cx="390" cy="305" r="22" fill="url(#accentGrad)" />
  </g>
</svg>`;

// 2. High-res maskable icon SVG (512x512 with safe area centered in 60-70%)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#4338ca" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="512" height="512" fill="url(#bgGrad)" />

  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)" filter="url(#shadow)">
    <text x="246" y="324" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="190" font-weight="900" fill="#ffffff" letter-spacing="-6">MA</text>
    <circle cx="390" cy="305" r="22" fill="url(#accentGrad)" />
  </g>
</svg>`;

// 3. Apple Touch Icon SVG (180x180)
const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#3730a3" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" fill="url(#bgGrad)" />
  <g transform="translate(90, 90) scale(0.35) translate(-256, -256)">
    <text x="246" y="324" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="190" font-weight="900" fill="#ffffff" letter-spacing="-6">MA</text>
    <circle cx="390" cy="305" r="22" fill="url(#accentGrad)" />
  </g>
</svg>`;

// 4. Shortcut: Admin Dashboard (192x192 SVG)
const shortcutAdminSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="48" fill="url(#adminGrad)" />
  <rect width="186" height="186" x="3" y="3" rx="45" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
  <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(36, 36)">
    <rect x="8" y="12" width="104" height="96" rx="16" stroke-width="8" />
    <path d="M8 40h104" stroke-width="8" />
    <path d="M38 64v32" stroke-width="8" />
    <path d="M60 52v44" stroke-width="8" />
    <path d="M82 72v24" stroke-width="8" />
  </g>
</svg>`;

// 5. Shortcut: My Projects (192x192 SVG)
const shortcutProjectsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="projGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="48" fill="url(#projGrad)" />
  <rect width="186" height="186" x="3" y="3" rx="45" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
  <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(36, 36)">
    <path d="M12 28L40 12h32l28 16v56a12 12 0 0 1-12 12H24a12 12 0 0 1-12-12V28z" stroke-width="8" />
    <path d="M36 56l16 16-16 16" stroke-width="8" />
    <path d="M64 88h20" stroke-width="8" />
  </g>
</svg>`;

// 6. Shortcut: Services (192x192 SVG)
const shortcutServicesSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="servGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#6d28d9" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="48" fill="url(#servGrad)" />
  <rect width="186" height="186" x="3" y="3" rx="45" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
  <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(36, 36)">
    <rect x="12" y="32" width="96" height="72" rx="14" stroke-width="8" />
    <path d="M40 32V20a10 10 0 0 1 10-10h20a10 10 0 0 1 10 10v12" stroke-width="8" />
    <path d="M12 58h96" stroke-width="8" />
    <circle cx="60" cy="58" r="5" fill="#ffffff" />
  </g>
</svg>`;

// 7. Shortcut: Contact Me (192x192 SVG)
const shortcutContactSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0e7490" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="48" fill="url(#contactGrad)" />
  <rect width="186" height="186" x="3" y="3" rx="45" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
  <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(36, 36)">
    <path d="M16 16h88a12 12 0 0 1 12 12v52a12 12 0 0 1-12 12H44l-28 20V28a12 12 0 0 1 12-12z" stroke-width="8" />
    <circle cx="44" cy="52" r="5" fill="#ffffff" />
    <circle cx="60" cy="52" r="5" fill="#ffffff" />
    <circle cx="76" cy="52" r="5" fill="#ffffff" />
  </g>
</svg>`;

async function generate() {
  console.log('Generating PWA icons in', ICONS_DIR);

  // Write SVG source files
  fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(ICONS_DIR, 'icon-maskable.svg'), maskableSvg);

  // Render Core Icons
  await sharp(Buffer.from(standardSvg)).resize(512, 512).png().toFile(path.join(ICONS_DIR, 'icon-512x512.png'));
  await sharp(Buffer.from(standardSvg)).resize(192, 192).png().toFile(path.join(ICONS_DIR, 'icon-192x192.png'));

  // Also write to public/ root for maximum direct compatibility
  await sharp(Buffer.from(standardSvg)).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'icon-512x512.png'));
  await sharp(Buffer.from(standardSvg)).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'icon-192x192.png'));

  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(ICONS_DIR, 'icon-maskable-512x512.png'));
  await sharp(Buffer.from(maskableSvg)).resize(192, 192).png().toFile(path.join(ICONS_DIR, 'icon-maskable-192x192.png'));
  await sharp(Buffer.from(appleTouchSvg)).resize(180, 180).png().toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

  // Render 192x192 PNG Shortcuts (Required by Android/Windows for App Shortcuts)
  const shortcuts = [
    { svg: shortcutAdminSvg, name: 'shortcut-admin' },
    { svg: shortcutProjectsSvg, name: 'shortcut-projects' },
    { svg: shortcutServicesSvg, name: 'shortcut-services' },
    { svg: shortcutContactSvg, name: 'shortcut-contact' },
  ];

  for (const { svg, name } of shortcuts) {
    const buf = Buffer.from(svg);
    // 192x192 in public/icons/
    await sharp(buf).resize(192, 192).png().toFile(path.join(ICONS_DIR, `${name}-192x192.png`));
    await sharp(buf).resize(96, 96).png().toFile(path.join(ICONS_DIR, `${name}.png`));

    // Also in public/ directly for direct root resolution
    await sharp(buf).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, `${name}-192x192.png`));
    await sharp(buf).resize(96, 96).png().toFile(path.join(PUBLIC_DIR, `${name}.png`));
  }

  console.log('All PWA 192x192 & 512x512 icons and shortcuts generated successfully!');
}

generate().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
