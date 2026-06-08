# Tests E2E — Portfolio Kevin Auchoybur

Tests end-to-end [Playwright](https://playwright.dev) du site **kevinauchoybur.me**, exécutés
chaque jour via un build Jenkins.

## Ce qui est couvert

| Fichier | Couverture |
|---------|-----------|
| `navigation.spec.js` | Chargement, logo → accueil, chaque lien de menu scrolle vers sa section |
| `theme-lang.spec.js` | Toggle thème clair/sombre, switch de langue FR ⇄ EN |
| `buttons.spec.js` | Lien LinkedIn (URL + `_blank`), téléchargement CV (PDF servi en 200), CTA contact, menu hamburger mobile |
| `contact-form.spec.js` | Formulaire : succès, erreur serveur, validation des champs — **avec mock réseau (aucun e-mail réel)** |

> 🔒 **Le formulaire n'est jamais soumis pour de vrai.** On intercepte l'appel vers
> Formspree (`page.route`) et on simule la réponse. Pas de spam, pas de quota consommé.

## Lancer en local (VS Code)

```bash
cd tests-e2e
npm install
npm run install:browsers   # télécharge Chromium/Firefox/WebKit (une seule fois)
npm test                   # lance tous les tests contre la prod
```

Autres commandes utiles :

```bash
npm run test:ui      # mode interactif (super pour débugger / regarder pas à pas)
npm run test:headed  # voit les navigateurs s'ouvrir
npm run report       # ouvre le dernier rapport HTML
```

### Tester une autre URL (ex. en local)

```bash
# Windows PowerShell
$env:BASE_URL="http://localhost:8080"; npm test

# macOS / Linux
BASE_URL=http://localhost:8080 npm test
```

## Jenkins (build quotidien)

Le `Jenkinsfile` à la racine de ce dossier définit un pipeline déclaratif :

1. **Trigger** : `cron('H 6 * * *')` → tous les jours vers 6h.
2. **Install** : `npm ci` + `npx playwright install --with-deps`.
3. **Tests** : `npx playwright test` (Chromium + Firefox + Pixel 7).
4. **Post** : publie le rapport JUnit (tendance des tests) + le rapport HTML Playwright.

### Mise en place côté Jenkins

1. **Nouveau job** → *Pipeline*.
2. *Pipeline script from SCM* → Git → URL de ton repo → branche `main`.
3. **Script Path** : `tests-e2e/Jenkinsfile`.
4. Plugins recommandés : **HTML Publisher** (rapport Playwright) et **JUnit** (souvent déjà présent).
5. Sur l'agent : Node.js ≥ 18 disponible (plugin *NodeJS* ou image Docker `mcr.microsoft.com/playwright`).

> 💡 L'image Docker `mcr.microsoft.com/playwright:v1.48.0-jammy` contient déjà Node + les
> navigateurs : idéale comme agent, ça évite le `playwright install` à chaque build.
