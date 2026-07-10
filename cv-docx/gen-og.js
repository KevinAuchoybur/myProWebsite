const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SCRATCH = process.argv[2] || __dirname;
const FONTDIR = process.argv[3] || null;

const W = 1200, H = 627;

// Couleurs reprises du site (style.css)
const PURPLE = '#6C5CEB';
const G1 = '#5b34d6', G2 = '#6C5CEB', G3 = '#a855f7'; // degrade du nom (hero__name)
const DARK = '#1a1a2e';   // --text-dark
const MUTED = '#4b5563';  // --text-muted

const photo = fs.readFileSync(path.join(ROOT, 'assets', 'photo-web.jpg')).toString('base64');

const KA_PATH = 'M23.46 45.40Q20.34 45.40 20.34 42.72L20.34 42.72Q20.34 41.84 20.60 40.70Q20.86 39.56 21.34 37.76L21.34 37.76Q21.90 35.88 22.18 34.56Q22.46 33.24 22.46 32.20L22.46 32.20Q22.46 29.48 20.06 29.48L20.06 29.48Q19.38 29.48 18.74 29.64L18.74 29.64L15.54 44.72L9.78 44.72L15.58 17.52Q12.90 18.64 11.44 20.88Q9.98 23.12 9.98 26.28L9.98 26.28Q9.98 27.76 10.26 28.34Q10.54 28.92 10.54 29L10.54 29Q8.38 29 7.32 28.10Q6.26 27.20 6.26 25.12L6.26 25.12Q6.26 22.56 8.36 20.14Q10.46 17.72 13.74 16.22Q17.02 14.72 20.30 14.72L20.30 14.72Q20.86 14.72 21.90 14.80L21.90 14.80L19.30 27.04L23.42 21.52Q28.34 14.88 28.38 14.92L28.38 14.92L32.58 14.92L21.46 27.72L22.86 27.68Q25.58 27.68 26.70 28.82Q27.82 29.96 27.82 31.96L27.82 31.96Q27.82 33.12 27.54 34.42Q27.26 35.72 26.74 37.64L26.74 37.64Q26.42 38.88 26.14 40.08Q25.86 41.28 25.86 42.08L25.86 42.08Q25.86 43 26.28 43.72Q26.70 44.44 27.42 44.72L27.42 44.72Q24.98 45.40 23.46 45.40L23.46 45.40ZM38.78 49.28Q37.30 49.28 36.18 49.04Q35.06 48.80 34.24 47.88Q33.42 46.96 33.42 45.04L33.42 45.04Q33.42 42.36 35.04 37.84Q36.66 33.32 39.30 28.76L39.30 28.76Q37.30 28.88 36.14 29.36Q34.98 29.84 34.62 30.84L34.62 30.84Q34.78 30.84 34.96 31.24Q35.14 31.64 35.14 32.08L35.14 32.08Q35.14 32.80 34.50 33.22Q33.86 33.64 32.90 33.64L32.90 33.64Q31.78 33.64 31.10 33.04Q30.42 32.44 30.42 31.32L30.42 31.32Q30.42 29.96 31.48 28.84Q32.54 27.72 34.42 27.06Q36.30 26.40 38.58 26.40L38.58 26.40Q39.42 26.40 40.66 26.52L40.66 26.52Q43.94 21.32 47.60 18.02Q51.26 14.72 54.58 14.72L54.58 14.72Q56.50 14.72 57.74 15.28L57.74 15.28L51.46 44.72L45.70 44.72L48.78 30.20Q47.30 29.52 46.06 29.20Q44.82 28.88 43.42 28.76L43.42 28.76Q41.14 33.68 39.68 38.82Q38.22 43.96 38.22 47.04L38.22 47.04Q38.22 48.56 38.78 49.28L38.78 49.28ZM49.14 28.44L51.46 17.56Q49.74 18.48 47.88 20.98Q46.02 23.48 44.26 27.04L44.26 27.04Q47.14 27.60 49.14 28.44L49.14 28.44Z';

const FF = FONTDIR ? 'Plus Jakarta Sans' : 'Segoe UI';
const NO_URL = process.env.OG_NO_URL === '1';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#f3f0ff"/>
    </linearGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${G1}"/>
      <stop offset="0.45" stop-color="${G2}"/>
      <stop offset="1" stop-color="${G3}"/>
    </linearGradient>
    <clipPath id="pc"><circle cx="960" cy="313" r="168"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1135" cy="70" r="215" fill="#a99cf9" opacity="0.55"/>
  <circle cx="700" cy="640" r="150" fill="#c9c1fb" opacity="0.35"/>

  <g transform="translate(88,44)">
    <circle cx="38" cy="38" r="36" fill="none" stroke="${PURPLE}" stroke-width="3.5"/>
    <g transform="translate(38,38) scale(0.93) translate(-32,-32)">
      <path fill="${PURPLE}" d="${KA_PATH}"/>
    </g>
  </g>

  <text x="88" y="185" font-family="${FF}" font-size="21" font-weight="700" letter-spacing="2.6" fill="${MUTED}">JE SUIS</text>
  <text x="88" y="256" font-family="${FF}" font-size="64" font-weight="800" fill="url(#name)">Kevin Auchoybur</text>
  <text x="88" y="308" font-family="${FF}" font-size="33" font-weight="800" fill="${DARK}">Analyste QA</text>

  <rect x="88" y="352" width="5" height="104" rx="2.5" fill="${PURPLE}"/>
  <text x="112" y="392" font-family="${FF}" font-size="29" font-weight="700" font-style="italic" fill="${DARK}">&#x201C;Tester, c'est anticiper là où</text>
  <text x="112" y="434" font-family="${FF}" font-size="29" font-weight="700" font-style="italic" fill="${DARK}">l'erreur n'est pas permise.&#x201D;</text>

  ${NO_URL ? '' : `<text x="88" y="540" font-family="${FF}" font-size="22" font-weight="700" fill="${PURPLE}">kevinauchoybur.me</text>`}

  <circle cx="960" cy="313" r="176" fill="#ffffff"/>
  <image x="792" y="145" width="336" height="336" clip-path="url(#pc)" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/jpeg;base64,${photo}"/>
</svg>`;

const opts = { fitTo: { mode: 'width', value: W } };
if (FONTDIR) {
  const files = fs.readdirSync(FONTDIR).filter(f => f.endsWith('.ttf')).map(f => path.join(FONTDIR, f));
  opts.font = { fontFiles: files, loadSystemFonts: true, defaultFontFamily: 'Plus Jakarta Sans' };
}

const png = new Resvg(svg, opts).render().asPng();
const out = path.join(SCRATCH, 'og-preview.jpg');
sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(out)
  .then(i => console.log('OK ->', out, i.width + 'x' + i.height, (i.size / 1024).toFixed(0) + 'KB', 'font:', FF))
  .catch(e => { console.error(e); process.exit(1); });
