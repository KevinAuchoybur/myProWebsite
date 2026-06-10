/**
 * Genere les PDF du CV (FR + EN) a partir d'un gabarit HTML, via Playwright.
 * Source unique de verite -> aligne avec la section CV du site.
 *
 * Usage :  node cv-pdf/generate-cv.js
 * (Playwright est reutilise depuis l'install de tests-e2e/)
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../tests-e2e/node_modules/@playwright/test'));

const OUT_DIR = path.resolve(__dirname, '../assets');

// ---------- Donnees (alignees avec index.html) ----------
const DATA = {
  fr: {
    file: 'cv-fr-KevinAuchoybur.pdf',
    htmlLang: 'fr',
    name: 'Kevin Auchoybur',
    role: 'Analyste QA',
    email: 'kevin.auchoybur@gmail.com',
    profileTitle: 'Profil',
    profileText: "Analyste QA avec 7+ ans d'expérience, du test fonctionnel à l'automatisation. J'ai accompagné des projets exigeants, du privé jusqu'au Gouvernement Princier de Monaco, en fiabilisant des produits utilisés par des milliers d'usagers. Mon obsession : qu'aucune anomalie critique n'atteigne la production.",
    expTitle: 'Expériences',
    exp: [
      {
        date: 'Depuis 2022', role: 'Analyste QA', company: 'Asteria — Monaco',
        context: "Pour le compte du Gouvernement Princier de Monaco — Portail MonGuichet.mc :",
        items: [
          'Rédaction et exécution de plans de test',
          'Identification et suivi des anomalies',
          'Reporting qualité',
          'Exécution des tests de non-régression et validation finale avant mise en production',
          'Collaboration cross-fonctionnelle',
        ],
      },
      {
        date: '2017 – 2022', role: 'Ingénieur QA / Automatisation', company: 'Inetum — Aix-en-Provence/Marseille',
        context: "Au cours de mes diverses missions pour les clients d'Inetum :",
        items: [
          'Assimilation des livrables et mise en place de la stratégie de tests',
          'Définition des exigences et préparation des environnements et jeux de données',
          'Conception et exécution des cas de tests fonctionnels et automatisés',
          "Gestion des anomalies en collaboration avec l'équipe de développement",
        ],
      },
    ],
    eduTitle: 'Formation',
    edu: [
      { date: '2016', degree: 'Master 2 MIAGE — Nouvelles Technologies et Direction de Projets', school: "Université Côte d'Azur — Sophia-Antipolis" },
      { date: '2011', degree: 'DUT Techniques de Commercialisation', school: "IUT Nice Côte d'Azur — Nice" },
      { date: '2009', degree: 'Baccalauréat Économique et Social', school: 'Lycée Don Bosco — Nice' },
    ],
    certTitle: 'Certifications',
    certs: ['ISTQB Fondation', 'ISTQB Extension Agile', 'ISTQB Test Manager', 'A4Q Selenium Tester Fondation'],
    skillsTitle: 'Outils & méthodes',
    skills: ['Squash TM', 'Selenium', 'Playwright', 'Jira', 'Agile'],
    langTitle: 'Langues',
    langs: [ { name: 'Français', level: 'Natif' }, { name: 'Anglais', level: 'Courant (C1)' } ],
  },
  en: {
    file: 'cv-en-KevinAuchoybur.pdf',
    htmlLang: 'en',
    name: 'Kevin Auchoybur',
    role: 'Quality Analyst',
    email: 'kevin.auchoybur@gmail.com',
    profileTitle: 'Profile',
    profileText: 'QA Analyst with 7+ years of experience, from functional testing to automation. I have contributed to demanding projects, from the private sector to the Princely Government of Monaco, making products used by thousands of users more reliable. My obsession: ensuring no critical defect ever reaches production.',
    expTitle: 'Experience',
    exp: [
      {
        date: 'Since 2022', role: 'QA Analyst', company: 'Asteria — Monaco',
        context: 'On behalf of the Princely Government of Monaco — MonGuichet.mc Portal:',
        items: [
          'Writing and executing test plans',
          'Identifying and tracking defects',
          'Quality reporting',
          'Running regression tests and final validation before production release',
          'Cross-functional collaboration',
        ],
      },
      {
        date: '2017 – 2022', role: 'QA / Automation Engineer', company: 'Inetum — Aix-en-Provence/Marseille',
        context: "During my various assignments for Inetum's clients:",
        items: [
          'Reviewing deliverables and defining the test strategy',
          'Defining requirements and preparing environments and test data',
          'Designing and executing functional and automated test cases',
          'Defect management in collaboration with the development team',
        ],
      },
    ],
    eduTitle: 'Education',
    edu: [
      { date: '2016', degree: "Master's (MIAGE) — New Technologies and Project Management", school: "Université Côte d'Azur — Sophia-Antipolis" },
      { date: '2011', degree: 'Two-year technical degree in Sales & Marketing', school: "IUT Nice Côte d'Azur — Nice" },
      { date: '2009', degree: 'High School Diploma — Economics and Social Sciences', school: 'Lycée Don Bosco — Nice' },
    ],
    certTitle: 'Certifications',
    certs: ['ISTQB Foundation Level', 'ISTQB Agile Extension', 'ISTQB Test Manager', 'A4Q Selenium Tester Foundation'],
    skillsTitle: 'Tools & methods',
    skills: ['Squash TM', 'Selenium', 'Playwright', 'Jira', 'Agile'],
    langTitle: 'Languages',
    langs: [ { name: 'French', level: 'Native' }, { name: 'English', level: 'Fluent (C1)' } ],
  },
};

// ---------- Icones (SVG inline, identiques au site) ----------
const ICONS = {
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>',
  exp: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><path d="M8 7V5a2 2 0 0 0-4 0v2"/>',
  edu: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>',
  cert: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  skills: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  lang: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#7C6EF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Gabarit HTML ----------
function html(d) {
  const expEntry = (e) => `
    <div class="entry">
      <span class="entry-date">${esc(e.date)}</span>
      <strong class="entry-title">${esc(e.role)}</strong>
      <span class="entry-company">${esc(e.company)}</span>
      <span class="entry-context">${esc(e.context)}</span>
      <ul>${e.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`;
  const eduEntry = (e) => `
    <div class="entry">
      <span class="entry-date">${esc(e.date)}</span>
      <strong class="entry-title">${esc(e.degree)}</strong>
      <span class="entry-company">${esc(e.school)}</span>
    </div>`;
  const pill = (t) => `<span class="pill">${esc(t)}</span>`;
  const lang = (l) => `<div class="lang"><span>${esc(l.name)}</span><span class="lang-level">${esc(l.level)}</span></div>`;
  const sTitle = (ic, t) => `<h2 class="block-title">${icon(ic)}<span>${esc(t)}</span></h2>`;

  return `<!DOCTYPE html>
<html lang="${d.htmlLang}">
<head>
<meta charset="UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --purple:#7C6EF8; --purple-light:#ede9fe; --dark:#1a1a2e; --muted:#4b5563; }
  body { font-family:'Inter',sans-serif; color:var(--dark); -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .page { width:210mm; min-height:297mm; padding:16mm 14mm; }

  .header { text-align:center; padding-bottom:14px; border-bottom:2px solid var(--purple); margin-bottom:20px; }
  .header h1 { font-size:27px; font-weight:800; }
  .header .role { font-size:14px; font-weight:700; color:var(--purple); margin:3px 0 4px; }
  .header .email { font-size:11.5px; color:var(--muted); }

  .grid { display:flex; gap:26px; }
  .col-left { width:53%; }
  .col-right { width:47%; }

  .block { margin-bottom:18px; }
  .block-title { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:700;
    padding-bottom:7px; border-bottom:1px solid #eee; margin-bottom:11px; }
  .block-title svg { flex-shrink:0; }

  .profile-text { font-size:11.5px; line-height:1.6; color:#2b2b3a; }

  .entry { position:relative; padding-left:14px; margin-bottom:13px; }
  .entry::before { content:""; position:absolute; left:0; top:3px; bottom:3px; width:2px; background:var(--purple-light); border-radius:2px; }
  .entry-date { display:block; font-size:10px; font-weight:600; color:var(--purple); margin-bottom:1px; }
  .entry-title { display:block; font-size:12.5px; font-weight:700; }
  .entry-company { display:block; font-size:11px; color:var(--muted); margin-bottom:3px; }
  .entry-context { display:block; font-size:10.5px; font-style:italic; color:var(--purple); margin-bottom:4px; }
  .entry ul { list-style:none; }
  .entry li { position:relative; font-size:11px; line-height:1.45; color:#2b2b3a; padding-left:12px; margin-bottom:2px; }
  .entry li::before { content:""; position:absolute; left:2px; top:6px; width:3px; height:3px; border-radius:50%; background:var(--purple); }

  .pills { display:flex; flex-wrap:wrap; gap:7px; }
  .pill { font-size:10.5px; font-weight:600; color:var(--purple); background:var(--purple-light); padding:4px 10px; border-radius:50px; }

  .langs { display:flex; flex-direction:column; gap:5px; }
  .lang { display:flex; justify-content:space-between; font-size:11.5px; }
  .lang span:first-child { font-weight:600; }
  .lang-level { color:var(--muted); }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${esc(d.name)}</h1>
      <div class="role">${esc(d.role)}</div>
      <div class="email">${esc(d.email)}</div>
    </div>
    <div class="grid">
      <div class="col-left">
        <div class="block">
          ${sTitle('profile', d.profileTitle)}
          <p class="profile-text">${esc(d.profileText)}</p>
        </div>
        <div class="block">
          ${sTitle('exp', d.expTitle)}
          ${d.exp.map(expEntry).join('')}
        </div>
      </div>
      <div class="col-right">
        <div class="block">
          ${sTitle('edu', d.eduTitle)}
          ${d.edu.map(eduEntry).join('')}
        </div>
        <div class="block">
          ${sTitle('cert', d.certTitle)}
          <div class="pills">${d.certs.map(pill).join('')}</div>
        </div>
        <div class="block">
          ${sTitle('skills', d.skillsTitle)}
          <div class="pills">${d.skills.map(pill).join('')}</div>
        </div>
        <div class="block">
          ${sTitle('lang', d.langTitle)}
          <div class="langs">${d.langs.map(lang).join('')}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ---------- Generation ----------
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const key of ['fr', 'en']) {
    const d = DATA[key];
    await page.setContent(html(d), { waitUntil: 'networkidle' });
    const out = path.join(OUT_DIR, d.file);
    await page.pdf({ path: out, format: 'A4', printBackground: true });
    console.log('OK ->', out);
  }
  await browser.close();
})();
