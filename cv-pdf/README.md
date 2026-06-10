# 📄 Génération des PDF du CV

Les PDF du CV (`assets/cv-fr-KevinAuchoybur.pdf` et `assets/cv-en-KevinAuchoybur.pdf`)
sont **générés** à partir d'un gabarit HTML, pour rester **alignés avec la section CV du site**.

## Régénérer les PDF

```bash
node cv-pdf/generate-cv.js
```

→ Recrée les deux PDF (FR + EN) dans `assets/`.

> Prérequis : les navigateurs Playwright doivent être installés (déjà fait via `tests-e2e/`).
> Si besoin : `cd tests-e2e && npm install && npx playwright install chromium`.

## Mettre à jour le contenu

Tout le contenu (profil, expériences, formation, certifs, outils, langues) est dans
l'objet `DATA` en haut de [`generate-cv.js`](generate-cv.js), avec une clé `fr` et une clé `en`.

⚠️ **Garde-le synchronisé avec les traductions `cv.*` de `index.html`** : c'est la même
information des deux côtés (le site et le PDF). Quand tu modifies l'un, pense à l'autre.

> 💡 Idée d'amélioration future : lire directement les traductions depuis `index.html`
> pour avoir une source unique et zéro risque de divergence.
