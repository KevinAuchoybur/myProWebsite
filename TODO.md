# 📋 TODO — Portfolio Kevin Auchoybur

Feuille de route consolidée : ce qui reste à faire sur le site + les objectifs d'apprentissage.
Dernière mise à jour : juin 2026.

---

## 📆 Plan des prochains jours (proposition)

Séquencé du plus rapide/à fort impact au plus long. ~30-60 min par jour suffisent.

| Jour | Objectif | Pourquoi en premier |
|------|----------|--------------------|
| **J1** | ⚡ **Compression des images** (`og-share.png` 3,5 Mo + PNG logos) | Effort faible, gain de perf immédiat, améliore le score Lighthouse |
| **J2** | 🎨 **Animations d'apparition au scroll** | Gros effet « waouh » pour peu de code (IntersectionObserver) |
| **J3** | 🔢 **Stats animées** dans le héro (compteurs) | Met en valeur tes points forts, prolonge l'élan du J2 |
| **J4** | ♿ **Audit accessibilité (a11y)** — partie 1 (contrastes, focus, aria) | Argument QA fort ; on corrige ce que Lighthouse remonte |
| **J5** | 🚀 **CI/CD GitHub Actions** — workflow quotidien des tests | Tout est prêt, ~30 min ; tes tests tournent enfin chaque jour |
| **J6+** | 📚 **Exercices Playwright** (`tests-e2e/EXERCICES.md`) | À ton rythme, en parallèle du reste |

> ℹ️ Note QA : penser à ajouter un **test de non-régression Playwright** pour le bug
> scrollspy « section haute » (corrige récemment) — non couvert par les tests actuels.

> 🎯 **Premier réflexe à la reprise** : J1 (compression images) — rapide et satisfaisant.
> Tu peux bien sûr réordonner selon ton envie du moment.

---

## 🚀 CI/CD — Tests automatisés quotidiens

> Tout le code (16 tests Playwright + pipeline) est **déjà prêt**. Reste à choisir l'hébergement.

- [ ] **Décision** : Jenkins (payant, ~5-10€/mois de serveur) **ou** GitHub Actions (gratuit, sans serveur)
  - 👉 Reco : **GitHub Actions** (gratuit, zéro maintenance) — sauf si tu veux t'exercer sur Jenkins pour le CV
- [ ] **Si GitHub Actions** : créer `.github/workflows/e2e.yml` (réutilise les tests existants)
  - [ ] Choisir la variante mail : **A** (alerte si échec seulement) ou **B** (rapport quotidien même au vert)
  - [ ] Variante B → générer un mot de passe d'application Gmail + créer un secret GitHub
- [ ] **Si Jenkins** : suivre `tests-e2e/JENKINS-TODO.md` (serveur, plugins, job, SMTP)

---

## 🎨 Améliorations Front (en vigilance)

Classées par rapport impact/effort.

### Gros impact
- [ ] **Animations d'apparition au scroll** (fondu + glissement via IntersectionObserver) — effet premium
- [ ] **Audit accessibilité (a11y)** — contrastes, aria-label, navigation clavier, focus visibles
      → argument de vente direct pour un poste de QA
- [ ] **Compression des images** — `og-share.png` fait 3,5 Mo 😅, à optimiser (+ autres PNG)

### Soigné / discret
- [ ] **Stats animées** dans le héro (compteur 0 → 7 ans, 0 → 4 certifs au scroll)
- [ ] **Micro-interactions** sur les cartes projets (zoom léger + ombre colorée au survol)
- [x] ~~**Barre de progression de lecture**~~ ✅ faite (sous la navbar)

### Bonus différenciant
- [ ] Audit **Lighthouse** complet (perf, SEO, best practices) et optimisations
- [ ] Petite touche signature (easter egg, curseur custom…)

---

## 📚 Montée en compétences

### Playwright (en cours)
- [ ] Faire les **5 exercices** de `tests-e2e/EXERCICES.md` (+ le défi bonus)
- [ ] Pratiquer avec `npm run test:ui` et `npx playwright codegen`
- [ ] Niveau confirmé → explorer : Page Object Model, fixtures custom, intégration CI
- [x] ~~Ajouter **Playwright** dans « Outils & méthodes » du CV~~ ✅ fait (en pastille)

### Astro.js (plus tard) 🆕
- [ ] **Découvrir Astro.js** — framework moderne orienté contenu / sites statiques rapides
  - Pourquoi c'est pertinent : idéal pour un portfolio, très performant, composants réutilisables,
    et une compétence dev recherchée
- [ ] **Idée concrète** : migrer (ou recréer) ce portfolio sous Astro comme projet d'apprentissage
  - Bénéfice : composants, layouts, gestion i18n native, build optimisé
  - Bonus : un superbe cas concret à présenter en entretien
- [ ] **Quand maîtrisé** : l'ajouter aussi dans les outils du site

---

## ✅ Déjà fait (pour mémoire)

- ✅ Site complet bilingue FR/EN, dark mode, responsive, déployé sur `kevinauchoybur.me` (HTTPS)
- ✅ Formulaire de contact (Formspree) + page de maintenance + scripts on/off
- ✅ Image de partage LinkedIn (og-image)
- ✅ Fix scrollspy + test de non-régression
- ✅ Logos employeurs (Asteria recoloré + Inetum) uniformisés sur le CV
- ✅ Suite de 16 tests E2E Playwright (navigation, thème, langue, boutons, formulaire mocké)
- ✅ Parcours d'exercices Playwright
- ✅ **Identité visuelle géométrique** : motif « éclats » violet (héro + contact), inspiré d'un textile
- ✅ Citation du héro sur carte « verre dépoli » + greeting en pilule
- ✅ Indicateur de nav actif en pastille + barre de progression de lecture
- ✅ Sous-titres de sections en violet italique (peps)
- ✅ Sous-section « Outils de tests » retirée des Projets + nettoyage du code mort

---

> 💡 Pour reprendre un sujet : ouvre ce fichier, on attaque la case suivante ensemble.
