const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ShadingType,
  Table, TableRow, TableCell, WidthType, ImageRun, LevelFormat, VerticalAlign,
} = require('docx');

const PURPLE = '7C6EF8';
const PURPLE_DK = '5B4FD0';
const PURPLE_LT = 'EDE9FE';
const PURPLE_BORDER = 'E0DAFB';
const DARK = '1A1A2E';
const MUTED = '555555';

const ROOT = path.resolve(__dirname, '..');
const photoPath = path.join(ROOT, 'assets', 'photo.png');
const hasPhoto = fs.existsSync(photoPath);
const NO_BORDERS = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
};

// ---------- Icones de section (SVG violet -> PNG via resvg) ----------
const { Resvg } = require('@resvg/resvg-js');
const ICON_SVG = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#${PURPLE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const renderIcon = (inner) => new Resvg(ICON_SVG(inner), { fitTo: { mode: 'width', value: 80 }, background: 'rgba(0,0,0,0)' }).render().asPng();
const ICONS = {
  profile: renderIcon('<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'),
  experience: renderIcon('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>'),
  education: renderIcon('<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'),
  certifs: renderIcon('<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>'),
  tools: renderIcon('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  langs: renderIcon('<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
};

// ---------- Contenu bilingue ----------
const CONTACT = {
  email: 'kevin.auchoybur@gmail.com',
  tel: '+33 6 41 93 13 42',
  linkedin: 'linkedin.com/in/kevin-auchoybur-17a15a42',
  site: 'kevinauchoybur.me',
};

const DATA = {
  fr: {
    role: 'Analyste QA  ·  Certifié ISTQB',
    labels: { email: 'Email', tel: 'Tél', linkedin: 'LinkedIn', site: 'Site' },
    sections: {
      profile: 'Profil', experience: 'Expériences', education: 'Formation',
      certifs: 'Certifications', tools: 'Outils & méthodes', langs: 'Langues',
    },
    profile: "Analyste QA avec 7+ ans d’expérience, du test fonctionnel à l’automatisation. J’accompagne des projets exigeants — du secteur privé au Gouvernement Princier de Monaco — en fiabilisant des produits utilisés par des milliers d’usagers. Ma priorité : qu’aucune anomalie critique n’atteigne la production.",
    experiences: [
      {
        role: 'Analyste QA — Asteria · Monaco', date: 'Depuis 2022',
        missions: [{
          context: 'MonGuichet.mc — Gouvernement Princier de Monaco',
          bullets: [
            'Pilotage des activités QA sur le portail de l’Administration monégasque pour accéder aux services en ligne',
            'Rédaction et exécution d’une centaine de cas de test (Squash TM)',
            'Identification et suivi de 100+ anomalies (Jira)',
            'Automatisation de 80% des parcours critiques (Selenium)',
            'Validation des livraisons sur DEV / RECETTE / PRÉ-PROD avant mise en production',
          ],
        }],
      },
      {
        role: 'Ingénieur QA / Automatisation — Inetum · Aix-en-Provence / Marseille', date: '2017 – 2022',
        missions: [
          {
            context: 'Powercard — Hightech Payment Systems',
            bullets: [
              'Conception et automatisation de tests UI (Protractor)',
              'Automatisation d’une quarantaine de scénarios critiques (émission, gestion et utilisation de cartes)',
              'Tests sur environnements sensibles (RECETTE, PRÉ-PROD) avec données de paiement',
              'Réduction du temps de test manuel et des anomalies critiques en production',
            ],
          },
          {
            context: 'SYRCA — Carsat Sud-Est',
            bullets: [
              'Conception d’une cinquantaine de scénarios de test sur des cas métiers complexes (calcul des droits)',
              'Détection et qualification d’environ 80 anomalies',
              'Vérification de la cohérence et de l’intégrité des données inter-environnements',
              'Réduction de 20% des anomalies liées aux règles de gestion',
            ],
          },
        ],
      },
    ],
    education: [
      ['Master 2 MIAGE — Nouvelles Technologies et Direction de Projets', 'Université Côte d’Azur, Sophia-Antipolis', '2016'],
      ['DUT Techniques de Commercialisation', 'IUT Nice Côte d’Azur, Nice', '2011'],
      ['Baccalauréat Économique et Social', 'Lycée Don Bosco, Nice', '2009'],
    ],
    certifs: ['ISTQB Fondation', 'ISTQB Extension Agile', 'ISTQB Test Manager', 'A4Q Selenium Tester Fondation'],
    tools: ['Squash TM', 'Selenium', 'Playwright', 'Postman', 'Jira', 'Agile'],
    langs: [['Français', 'Natif'], ['Anglais', 'Courant (C1)']],
  },
  en: {
    role: 'QA Analyst  ·  ISTQB Certified',
    labels: { email: 'Email', tel: 'Phone', linkedin: 'LinkedIn', site: 'Site' },
    sections: {
      profile: 'Profile', experience: 'Experience', education: 'Education',
      certifs: 'Certifications', tools: 'Tools & methods', langs: 'Languages',
    },
    profile: "QA Analyst with 7+ years of experience, from functional testing to automation. I support demanding projects — from the private sector to the Princely Government of Monaco — making products used by thousands of people more reliable. My priority: making sure no critical defect ever reaches production.",
    experiences: [
      {
        role: 'QA Analyst — Asteria · Monaco', date: 'Since 2022',
        missions: [{
          context: 'MonGuichet.mc — Princely Government of Monaco',
          bullets: [
            'Leading QA activities on the Monegasque Administration portal for accessing online services',
            'Writing and executing ~100 test cases (Squash TM)',
            'Identifying and tracking 100+ defects (Jira)',
            'Automating 80% of critical user journeys (Selenium)',
            'Validating releases across DEV / UAT / PRE-PROD before production',
          ],
        }],
      },
      {
        role: 'QA / Automation Engineer — Inetum · Aix-en-Provence / Marseille', date: '2017 – 2022',
        missions: [
          {
            context: 'Powercard — Hightech Payment Systems',
            bullets: [
              'Designing and automating UI tests (Protractor)',
              'Automating ~40 critical scenarios (card issuance, management and usage)',
              'Testing on sensitive environments (UAT, PRE-PROD) with payment data',
              'Reducing manual testing time and critical production defects',
            ],
          },
          {
            context: 'SYRCA — Carsat Sud-Est',
            bullets: [
              'Designing ~50 test scenarios on complex business cases (entitlement calculation)',
              'Detecting and qualifying ~80 defects',
              'Checking data consistency and integrity across environments',
              'Reducing business-rule defects by 20%',
            ],
          },
        ],
      },
    ],
    education: [
      ['Master’s degree (MIAGE) — New Technologies & Project Management', 'Université Côte d’Azur, Sophia-Antipolis', '2016'],
      ['Two-year technical degree in Sales & Marketing', 'IUT Nice Côte d’Azur, Nice', '2011'],
      ['High School Diploma — Economics & Social Sciences', 'Lycée Don Bosco, Nice', '2009'],
    ],
    certifs: ['ISTQB Foundation', 'ISTQB Agile Extension', 'ISTQB Test Manager', 'A4Q Selenium Tester Foundation'],
    tools: ['Squash TM', 'Selenium', 'Playwright', 'Postman', 'Jira', 'Agile'],
    langs: [['French', 'Native'], ['English', 'Fluent (C1)']],
  },
};

// ---------- Helpers ----------
const sectionTitle = (text, iconKey) => new Paragraph({
  spacing: { before: 220, after: 110 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PURPLE, space: 4 } },
  children: [
    ...(iconKey && ICONS[iconKey] ? [
      new ImageRun({ type: 'png', data: ICONS[iconKey], transformation: { width: 13, height: 13 } }),
      new TextRun({ text: '  ' }),
    ] : []),
    new TextRun({ text: text.toUpperCase(), bold: true, color: PURPLE, size: 22, characterSpacing: 20 }),
  ],
});

const bodyText = (text) => new Paragraph({
  spacing: { after: 60 }, children: [new TextRun({ text, size: 20, color: DARK })],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: 'bul', level: 0 }, spacing: { after: 36 },
  children: [new TextRun({ text, size: 20, color: DARK })],
});

// En-tete d'experience : role (gauche, peut passer sur 2 lignes) + annee calee en haut a droite
const entryHeader = (role, date) => new Table({
  width: { size: 5760, type: WidthType.DXA },
  columnWidths: [4380, 1380],
  borders: NO_BORDERS,
  rows: [new TableRow({ children: [
    new TableCell({
      width: { size: 4380, type: WidthType.DXA }, borders: NO_BORDERS, verticalAlign: VerticalAlign.TOP,
      margins: { top: 120, right: 80, bottom: 0 },
      children: [new Paragraph({ children: [new TextRun({ text: role, bold: true, size: 21, color: DARK })] })],
    }),
    new TableCell({
      width: { size: 1380, type: WidthType.DXA }, borders: NO_BORDERS, verticalAlign: VerticalAlign.TOP,
      margins: { top: 122, bottom: 0 },
      children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: date ? [new TextRun({ text: date, size: 18, color: PURPLE, bold: true })] : [] })],
    }),
  ] })],
});
const place = (text) => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text, size: 19, color: MUTED })] });
const context = (text) => new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text, italics: true, size: 19, color: PURPLE })] });

const eduEntry = (degree, school, date) => [
  new Paragraph({ spacing: { before: 90, after: 2 }, children: [new TextRun({ text: date, bold: true, size: 17, color: PURPLE })] }),
  new Paragraph({ spacing: { after: 2 }, children: [new TextRun({ text: degree, bold: true, size: 19, color: DARK })] }),
  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: school, size: 18, color: MUTED })] }),
];

const pill = (text) => new Paragraph({
  spacing: { after: 70 }, indent: { left: 90 },
  shading: { type: ShadingType.CLEAR, fill: PURPLE_LT },
  children: [new TextRun({ text, size: 18, color: PURPLE_DK, bold: true })],
});

const langLine = (lang, level) => new Paragraph({
  spacing: { after: 40 }, tabStops: [{ type: 'right', position: 3800 }],
  children: [
    new TextRun({ text: lang, bold: true, size: 19, color: DARK }),
    new TextRun({ text: '\t' + level, size: 18, color: MUTED }),
  ],
});

const contactLine = (label, value) => new Paragraph({
  spacing: { after: 26 },
  children: [
    new TextRun({ text: label.toUpperCase() + '   ', size: 16, color: PURPLE, bold: true, characterSpacing: 10 }),
    new TextRun({ text: value, size: 19, color: DARK }),
  ],
});

// ---------- Construction d'un document pour une langue ----------
function build(lang) {
  const d = DATA[lang];

  const photoCell = hasPhoto
    ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({
        type: 'png', data: fs.readFileSync(photoPath), transformation: { width: 118, height: 138 },
        altText: { title: 'Photo', description: 'Photo de profil', name: 'photo' } })] })]
    : [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 600 }, children: [new TextRun({ text: '[ Photo ]', color: MUTED, size: 20 })] })];

  const headerTable = new Table({
    width: { size: 10440, type: WidthType.DXA },
    columnWidths: [2100, 8340],
    borders: NO_BORDERS,
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 2100, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
        shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' },
        borders: { top: { style: BorderStyle.SINGLE, size: 8, color: PURPLE_BORDER }, bottom: { style: BorderStyle.SINGLE, size: 8, color: PURPLE_BORDER }, left: { style: BorderStyle.SINGLE, size: 8, color: PURPLE_BORDER }, right: { style: BorderStyle.SINGLE, size: 8, color: PURPLE_BORDER } },
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        children: photoCell,
      }),
      new TableCell({
        width: { size: 8340, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
        borders: NO_BORDERS, margins: { left: 260 },
        children: [
          new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: 'Kevin Auchoybur', bold: true, size: 44, color: DARK })] }),
          new Paragraph({ spacing: { after: 150 }, children: [new TextRun({ text: d.role, bold: true, size: 24, color: PURPLE })] }),
          contactLine(d.labels.email, CONTACT.email),
          contactLine(d.labels.tel, CONTACT.tel),
          contactLine(d.labels.site, CONTACT.site),
        ],
      }),
    ] })],
  });

  // Colonne gauche : profil + expériences (missions issues de la section Projets)
  const leftCol = [sectionTitle(d.sections.profile, 'profile'), bodyText(d.profile), sectionTitle(d.sections.experience, 'experience')];
  d.experiences.forEach((exp) => {
    leftCol.push(entryHeader(exp.role, exp.date));
    if (exp.place) leftCol.push(place(exp.place));
    exp.missions.forEach((m) => {
      leftCol.push(context(m.context));
      m.bullets.forEach((b) => leftCol.push(bullet(b)));
    });
  });

  // Colonne droite : formation, certifs, outils, langues
  const rightCol = [sectionTitle(d.sections.education, 'education')];
  d.education.forEach((e) => rightCol.push(...eduEntry(e[0], e[1], e[2])));
  rightCol.push(sectionTitle(d.sections.certifs, 'certifs'));
  d.certifs.forEach((c) => rightCol.push(pill(c)));
  rightCol.push(sectionTitle(d.sections.tools, 'tools'));
  d.tools.forEach((t) => rightCol.push(pill(t)));
  rightCol.push(sectionTitle(d.sections.langs, 'langs'));
  d.langs.forEach((l) => rightCol.push(langLine(l[0], l[1])));

  const body = new Table({
    width: { size: 10440, type: WidthType.DXA },
    columnWidths: [6040, 4400],
    borders: { ...NO_BORDERS, insideVertical: { style: BorderStyle.SINGLE, size: 6, color: PURPLE_BORDER } },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 6040, type: WidthType.DXA }, borders: NO_BORDERS, verticalAlign: VerticalAlign.TOP, margins: { right: 280, top: 60 }, children: leftCol }),
      new TableCell({ width: { size: 4400, type: WidthType.DXA }, borders: NO_BORDERS, verticalAlign: VerticalAlign.TOP, margins: { left: 280, top: 60 }, children: rightCol }),
    ] })],
  });

  return new Document({
    styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
    numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { run: { color: PURPLE }, paragraph: { indent: { left: 300, hanging: 180 } } } }] }] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 900, right: 900, bottom: 720, left: 900 } } },
      children: [
        headerTable,
        new Paragraph({ spacing: { before: 100, after: 60 }, border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: PURPLE, space: 1 } }, children: [] }),
        body,
      ],
    }],
  });
}

// ---------- Génération FR + EN ----------
const outputs = [
  ['fr', path.join(ROOT, 'CV-Kevin-Auchoybur-FR.docx')],
  ['en', path.join(ROOT, 'CV-Kevin-Auchoybur-EN.docx')],
];

Promise.all(outputs.map(([lang, out]) =>
  Packer.toBuffer(build(lang)).then((buf) => { fs.writeFileSync(out, buf); console.log('OK ->', out); })
)).then(() => console.log('Termine (photo:', hasPhoto + ')'));
