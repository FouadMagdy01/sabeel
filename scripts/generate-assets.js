/**
 * Asset Generation Script
 *
 * Generates app icon, splash screen icon, Android adaptive icon assets,
 * and favicon with Islamic-themed design using the app's emerald brand colors.
 *
 * Design: Open Quran book with a small crescent moon above it.
 * Arabic text "سبيل" is rendered as SVG paths (not font text) to avoid
 * font-shaping issues with sharp's SVG renderer.
 *
 * Usage: node scripts/generate-assets.js
 * Requires: sharp (npm install --save-dev sharp)
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'images');

// Brand colors
const DEEP_EMERALD = '#064E3B';
const WHITE = '#FFFFFF';

/**
 * SVG path data for the Arabic word "سبيل" (Sabeel).
 * Pre-converted to path geometry so it renders correctly without font support.
 * Uses clean geometric shapes in a simplified Naskh/Kufi style.
 * Read right-to-left: ل (lam) + ي (ya) + ب (ba) + س (sin)
 */
function sabeelTextPath(color, scale = 1, translateX = 0, translateY = 0) {
  return `
  <g transform="translate(${translateX}, ${translateY}) scale(${scale})" fill="${color}" stroke="none">

    <!-- ل (Lam) — tall vertical with a curved baseline hook turning right -->
    <path d="
      M 115,-55
      C 115,-58 118,-60 121,-60
      C 124,-60 127,-58 127,-55
      L 127,2
      C 127,16 138,22 150,22
      L 150,30
      C 132,30 119,20 119,2
      L 119,-55 Z
    "/>

    <!-- يـ (Ya initial form) — curved swoop descending below baseline + 2 dots -->
    <path d="
      M 55,0 L 110,0 L 110,8 L 62,8
      C 52,8 44,16 44,26
      C 44,36 52,44 62,44
      C 68,44 72,42 74,38
      L 81,42
      C 77,48 70,52 62,52
      C 46,52 36,40 36,26
      C 36,12 44,2 55,0 Z
    "/>
    <!-- Two dots below ya -->
    <circle cx="72" cy="62" r="5"/>
    <circle cx="86" cy="62" r="5"/>

    <!-- بـ (Ba) — horizontal stroke with dot below -->
    <path d="
      M -50,0 L 40,0 L 40,8 L -50,8 Z
    "/>
    <!-- Single dot below ba -->
    <circle cx="-5" cy="22" r="5.5"/>

    <!-- سـ (Sin) — three teeth rising from baseline -->
    <path d="
      M -155,8 L -155,0
      L -145,0 L -145,-14 L -137,-14 L -137,0
      L -127,0 L -127,-14 L -119,-14 L -119,0
      L -109,0 L -109,-14 L -101,-14 L -101,0
      L -60,0 L -60,8 Z
    "/>

    <!-- Connecting baseline from sin through ba to ya -->
    <rect x="-155" y="0" width="265" height="8" rx="2" opacity="0"/>
  </g>`;
}

/**
 * SVG for an open Quran book with a crescent moon above it.
 *
 * The book is two open pages with a curved spine, and the crescent
 * sits centered above.
 */
function quranBookCrescentSvg({ size, fgColor, bgColor, withBg = true, withText = false }) {
  const cx = size / 2;
  // True vertical center for the icon group (crescent top to book bottom)
  const cy = withText ? size * 0.38 : size * 0.50;

  const bgRect = withBg
    ? `<rect width="${size}" height="${size}" fill="${bgColor}" />`
    : '';

  // Smaller book dimensions — 40% width instead of 52%
  const bookW = size * 0.38;
  const bookH = size * 0.24;
  const bookTop = cy - bookH * 0.3;
  const bookBot = bookTop + bookH;
  const spineX = cx;

  // Crescent dimensions — smaller and closer to book
  const crescentCy = bookTop - size * 0.08;
  const outerR = size * 0.075;
  const innerR = size * 0.062;
  const offsetX = size * 0.022;
  const offsetY = -size * 0.008;

  // Text section (SVG paths for "سبيل")
  const textSection = withText
    ? sabeelTextPath(fgColor, size / 1024 * 1.0, cx, bookBot + size * 0.14)
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bgRect}

  <!-- Crescent moon above the book -->
  <defs>
    <mask id="crescentMask">
      <rect width="${size}" height="${size}" fill="black" />
      <circle cx="${cx}" cy="${crescentCy}" r="${outerR}" fill="white" />
      <circle cx="${cx + offsetX}" cy="${crescentCy + offsetY}" r="${innerR}" fill="black" />
    </mask>
  </defs>
  <rect width="${size}" height="${size}" fill="${fgColor}" mask="url(#crescentMask)" />

  <!-- Open book — left page -->
  <path d="
    M ${spineX},${bookTop}
    Q ${spineX - bookW * 0.25},${bookTop - bookH * 0.08}
      ${spineX - bookW * 0.5},${bookTop + bookH * 0.05}
    L ${spineX - bookW * 0.5},${bookBot - bookH * 0.05}
    Q ${spineX - bookW * 0.25},${bookBot + bookH * 0.08}
      ${spineX},${bookBot}
    Z
  " fill="none" stroke="${fgColor}" stroke-width="${size * 0.012}" stroke-linejoin="round" />

  <!-- Open book — right page -->
  <path d="
    M ${spineX},${bookTop}
    Q ${spineX + bookW * 0.25},${bookTop - bookH * 0.08}
      ${spineX + bookW * 0.5},${bookTop + bookH * 0.05}
    L ${spineX + bookW * 0.5},${bookBot - bookH * 0.05}
    Q ${spineX + bookW * 0.25},${bookBot + bookH * 0.08}
      ${spineX},${bookBot}
    Z
  " fill="none" stroke="${fgColor}" stroke-width="${size * 0.012}" stroke-linejoin="round" />

  <!-- Spine line -->
  <line x1="${spineX}" y1="${bookTop}" x2="${spineX}" y2="${bookBot}"
    stroke="${fgColor}" stroke-width="${size * 0.008}" />

  <!-- Left page lines (text lines) -->
  <line x1="${spineX - bookW * 0.08}" y1="${bookTop + bookH * 0.22}" x2="${spineX - bookW * 0.42}" y2="${bookTop + bookH * 0.24}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />
  <line x1="${spineX - bookW * 0.08}" y1="${bookTop + bookH * 0.38}" x2="${spineX - bookW * 0.42}" y2="${bookTop + bookH * 0.40}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />
  <line x1="${spineX - bookW * 0.08}" y1="${bookTop + bookH * 0.54}" x2="${spineX - bookW * 0.42}" y2="${bookTop + bookH * 0.56}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />
  <line x1="${spineX - bookW * 0.08}" y1="${bookTop + bookH * 0.70}" x2="${spineX - bookW * 0.42}" y2="${bookTop + bookH * 0.72}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />

  <!-- Right page lines (text lines) -->
  <line x1="${spineX + bookW * 0.08}" y1="${bookTop + bookH * 0.22}" x2="${spineX + bookW * 0.42}" y2="${bookTop + bookH * 0.24}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />
  <line x1="${spineX + bookW * 0.08}" y1="${bookTop + bookH * 0.38}" x2="${spineX + bookW * 0.42}" y2="${bookTop + bookH * 0.40}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />
  <line x1="${spineX + bookW * 0.08}" y1="${bookTop + bookH * 0.54}" x2="${spineX + bookW * 0.42}" y2="${bookTop + bookH * 0.56}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />
  <line x1="${spineX + bookW * 0.08}" y1="${bookTop + bookH * 0.70}" x2="${spineX + bookW * 0.42}" y2="${bookTop + bookH * 0.72}" stroke="${fgColor}" stroke-width="${size * 0.005}" opacity="0.5" />

  ${textSection}
</svg>`;
}

/**
 * Solid color background SVG for Android adaptive icon background.
 */
function solidBgSvg(size, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color}" />
</svg>`;
}

async function generateAssets() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Generating app assets...\n');

  // 1. iOS/default icon — 1024x1024, emerald bg, white book+crescent
  const iconSvg = quranBookCrescentSvg({
    size: 1024,
    fgColor: WHITE,
    bgColor: DEEP_EMERALD,
    withBg: true,
  });
  await sharp(Buffer.from(iconSvg)).png().toFile(path.join(OUTPUT_DIR, 'icon.png'));
  console.log('  icon.png (1024x1024)');

  // 2. Splash icon — 1024x1024, transparent bg, emerald book+crescent + text
  //    Displayed on white background set in app.json
  const splashSvg = quranBookCrescentSvg({
    size: 1024,
    fgColor: DEEP_EMERALD,
    bgColor: 'transparent',
    withBg: false,
    withText: true,
  });
  await sharp(Buffer.from(splashSvg)).png().toFile(path.join(OUTPUT_DIR, 'splash-icon.png'));
  console.log('  splash-icon.png (1024x1024)');

  // 3. Android adaptive icon foreground — 512x512, white book+crescent on transparent
  const androidFgSvg = quranBookCrescentSvg({
    size: 512,
    fgColor: WHITE,
    bgColor: 'transparent',
    withBg: false,
  });
  await sharp(Buffer.from(androidFgSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'android-icon-foreground.png'));
  console.log('  android-icon-foreground.png (512x512)');

  // 4. Android adaptive icon background — 512x512, solid emerald
  const androidBgSvg = solidBgSvg(512, DEEP_EMERALD);
  await sharp(Buffer.from(androidBgSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'android-icon-background.png'));
  console.log('  android-icon-background.png (512x512)');

  // 5. Android monochrome icon — 512x512, white book+crescent on transparent
  const monochromeSvg = quranBookCrescentSvg({
    size: 512,
    fgColor: WHITE,
    bgColor: 'transparent',
    withBg: false,
  });
  await sharp(Buffer.from(monochromeSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'android-icon-monochrome.png'));
  console.log('  android-icon-monochrome.png (512x512)');

  // 6. Favicon — 48x48, emerald bg, white book+crescent
  const faviconSvg = quranBookCrescentSvg({
    size: 48,
    fgColor: WHITE,
    bgColor: DEEP_EMERALD,
    withBg: true,
  });
  await sharp(Buffer.from(faviconSvg)).png().toFile(path.join(OUTPUT_DIR, 'favicon.png'));
  console.log('  favicon.png (48x48)');

  console.log('\nAll assets generated in assets/images/');
}

generateAssets().catch((err) => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
