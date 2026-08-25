const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SCRATCH = process.argv[2] || __dirname;
const FONTDIR = process.argv[3] || null;

const W = 1200, H = 627;

// Couleurs reprises du site (style.css)
const PURPLE = '#1E3FC4';
const G1 = '#1E3FC4', G2 = '#4a35cf', G3 = '#6D28D9'; // degrade du nom (hero__name, charte bleu->violet)
const DARK = '#1a1a2e';   // --text-dark
const MUTED = '#4b5563';  // --text-muted

const photo = fs.readFileSync(path.join(ROOT, 'assets', 'photo-web.jpg')).toString('base64');

// Monogramme KA en Orbitron (vectorise, identique a la favicon / navbar) — coords en unites em (y monte)
const KA_PATH = 'M190 0L57 0L57-720L190-720L190-427L359-427L605-720L749-720L749-682L479-360L750-38L750 0L605 0L359-293L190-293L190 0M830 0L830-581Q830-619 849-650.50Q868-682 899.50-701Q931-720 969-720L1410-720Q1448-720 1480-701Q1512-682 1531-650.50Q1550-619 1550-581L1550 0L1417 0L1417-242L962-242L962 0L830 0M962-374L1417-374L1417-575Q1417-580 1413-583.50Q1409-587 1404-587L974-587Q969-587 965.50-583.50Q962-580 962-575';

const FF = FONTDIR ? 'Plus Jakarta Sans' : 'Segoe UI';
const NO_URL = process.env.OG_NO_URL === '1';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#eef2fc"/>
    </linearGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${G1}"/>
      <stop offset="0.45" stop-color="${G2}"/>
      <stop offset="1" stop-color="${G3}"/>
    </linearGradient>
    <linearGradient id="kaGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${G1}"/>
      <stop offset="1" stop-color="${G3}"/>
    </linearGradient>
    <clipPath id="pc"><circle cx="960" cy="313" r="168"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1135" cy="70" r="215" fill="#8ba0f2" opacity="0.55"/>
  <circle cx="700" cy="640" r="150" fill="#bcaef4" opacity="0.35"/>

  <g transform="translate(88,44)">
    <circle cx="38" cy="38" r="38" fill="url(#kaGrad)"/>
    <g transform="translate(11.32,49.95) scale(0.0332)">
      <path fill="#ffffff" d="${KA_PATH}"/>
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
