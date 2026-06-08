# 🎯 Exercices Playwright progressifs

5 défis sur **ton propre site**, du plus simple au plus corsé. Chaque exercice a :
un **objectif**, des **indices**, les **concepts** travaillés, et une **solution repliable**
(essaie d'abord sans regarder !).

## Comment travailler

1. Crée un fichier `tests/exercices.spec.js`
2. Copie l'énoncé, écris ton test
3. Lance-le en mode visuel pour voir ce qui se passe :
   ```bash
   cd tests-e2e
   npx playwright test tests/exercices.spec.js --project=chromium --ui
   ```
4. 💡 Astuce : `npx playwright codegen https://kevinauchoybur.me` ouvre un navigateur
   qui **écrit le code du test pendant que tu cliques**. Idéal pour trouver les bons sélecteurs.

---

## 🟢 Exercice 1 — Le pied de page affiche l'année

**Objectif** : vérifier que le footer contient bien « Kevin Auchoybur » et l'année courante.

**Indices**
- Le copyright est dans `.footer__copy`
- L'année est injectée par JS dans `#year`
- Assertion utile : `toContainText()`

**Concepts** : `locator`, `toContainText`, valeur dynamique

<details>
<summary>👉 Voir la solution</summary>

```js
const { test, expect } = require('@playwright/test');

test('le footer affiche le nom et l\'année courante', async ({ page }) => {
  await page.goto('/');
  const annee = new Date().getFullYear().toString();
  const footer = page.locator('.footer__copy');
  await expect(footer).toContainText('Kevin Auchoybur');
  await expect(footer).toContainText(annee);
});
```
**Ce que tu apprends** : une assertion peut porter sur une valeur calculée (l'année du jour).
</details>

---

## 🟢 Exercice 2 — Il y a exactement 3 projets

**Objectif** : vérifier que la grille de projets contient 3 cartes.

**Indices**
- Les cartes projet sont dans `.projects__grid .project-card`
- ⚠️ Piège : `.project-card` est AUSSI utilisé par les outils ! D'où le préfixe `.projects__grid`
- Assertion utile : `toHaveCount()`

**Concepts** : compter des éléments, sélecteur de descendant, piège des classes partagées

<details>
<summary>👉 Voir la solution</summary>

```js
test('la section projets contient exactement 3 cartes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.projects__grid .project-card')).toHaveCount(3);
});
```
**Ce que tu apprends** : `toHaveCount` attend que le bon nombre d'éléments soit présent.
Et l'importance de **bien scoper** son sélecteur quand une classe est réutilisée ailleurs.
</details>

---

## 🟡 Exercice 3 — Le bouton « Télécharger mon CV » se traduit

**Objectif** : en FR le bouton dit « Télécharger mon CV », après passage en EN il dit « Download my CV ».

**Indices**
- Le bouton du héro a l'id `#heroDownloadCv`
- Le bouton EN du switch : `.lang-btn[data-lang="en"]`
- Assertion utile : `toHaveText()`

**Concepts** : action `.click()`, vérifier un changement après interaction

<details>
<summary>👉 Voir la solution</summary>

```js
test('le bouton de téléchargement du CV se traduit en anglais', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('#heroDownloadCv');

  await expect(btn).toHaveText(/Télécharger mon CV/);

  await page.locator('.lang-btn[data-lang="en"]').click();
  await expect(btn).toHaveText(/Download my CV/);
});
```
**Ce que tu apprends** : le schéma de base du test E2E → **état initial → action → nouvel état**.
`toHaveText` attend automatiquement que le texte change (pas besoin de `sleep`).
</details>

---

## 🟠 Exercice 4 — Le bouton « Revenir en haut »

**Objectif** : scroller vers le bas, cliquer sur le bouton retour-en-haut, vérifier qu'on est remonté.

**Indices**
- Le bouton a l'id `#backToTop`
- Pour scroller : `await page.evaluate(() => window.scrollTo(0, 3000))`
- Pour lire la position : `await page.evaluate(() => window.scrollY)`
- Le bouton n'apparaît (classe `is-visible`) qu'après avoir scrollé un peu

**Concepts** : `page.evaluate` (exécuter du JS dans la page), lire l'état du scroll, attente

<details>
<summary>👉 Voir la solution</summary>

```js
test('le bouton retour-en-haut ramène en haut de page', async ({ page }) => {
  await page.goto('/');

  // 1. On descend tout en bas
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // 2. Le bouton doit devenir visible
  const btn = page.locator('#backToTop');
  await expect(btn).toBeVisible();

  // 3. On clique
  await btn.click();

  // 4. On attend d'être revenu près du sommet (le scroll est animé)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
});
```
**Ce que tu apprends** : `page.evaluate` pour piloter/observer la page, et surtout
**`expect.poll()`** qui ré-évalue une valeur jusqu'à ce qu'elle satisfasse la condition
(parfait pour un scroll animé).
</details>

---

## 🔵 Exercice 5 — Le formulaire envoie bien le nom saisi (mock + inspection)

**Objectif** : remplir le formulaire, intercepter l'appel réseau, et vérifier que le **nom tapé**
est bien présent dans la requête envoyée — le tout sans envoyer de vrai e-mail.

**Indices**
- Champs : `#nom`, `#email`, `#message` ; bouton : `#contactForm .btn-submit`
- Intercepte l'URL `**/formspree.io/f/**` avec `page.route()`
- Dans le handler, lis la requête : `route.request().postData()`
- N'oublie pas de répondre : `route.fulfill({ status: 200, body: '{}' })`

**Concepts** : `page.route()` (mock réseau), inspection de la requête sortante

<details>
<summary>👉 Voir la solution</summary>

```js
test('le formulaire envoie le nom saisi dans la requête', async ({ page }) => {
  await page.goto('/#contact');

  let payloadRecu = '';
  await page.route('**/formspree.io/f/**', async (route) => {
    payloadRecu = route.request().postData() || '';
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.fill('#nom', 'Kevin QA');
  await page.fill('#email', 'kevin@example.com');
  await page.fill('#message', 'Test exercice 5');
  await page.locator('#contactForm .btn-submit').click();

  // Le succès s'affiche...
  await expect(page.locator('#modalSuccess')).toHaveClass(/is-visible/);
  // ...ET la requête contenait bien le nom tapé
  expect(payloadRecu).toContain('Kevin QA');
});
```
**Ce que tu apprends** : le mock réseau ne sert pas qu'à **simuler une réponse** —
il permet aussi d'**inspecter ce que le front envoie**. C'est très puissant pour valider
qu'un formulaire transmet les bonnes données. C'est le niveau « confirmé ».
</details>

---

## 🏆 Défi bonus (libre)

Écris un test qui vérifie qu'**en mode sombre**, l'attribut `data-theme="dark"` est bien
présent sur `<html>` **et** persiste après un rechargement de page (`page.reload()`).
Indice : Playwright conserve le `localStorage` au sein d'un même test.

---

## 📚 Pour aller plus loin
- Doc officielle : https://playwright.dev/docs/intro
- Tous les locators : https://playwright.dev/docs/locators
- Les assertions : https://playwright.dev/docs/test-assertions
- Le mock réseau : https://playwright.dev/docs/mock

> Quand tu auras fait les 5, dis-le moi : je te corrige, et on monte d'un cran
> (fixtures custom, Page Object Model, intégration CI). 💪
