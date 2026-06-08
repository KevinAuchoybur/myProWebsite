# 📋 TODO — Mise en place de Jenkins

Reste à faire pour avoir le build quotidien automatique. Tout le code (tests + `Jenkinsfile`)
est déjà prêt et poussé sur GitHub. Il n'y a plus que la config côté serveur Jenkins.

## 1. Préparer le serveur / la VM
- [ ] Avoir une machine **toujours allumée** (VM cloud, NAS, Raspberry, etc.)
- [ ] Installer **Java** (requis par Jenkins) — JDK 17 recommandé
- [ ] Installer **Jenkins** (LTS) et y accéder via le navigateur (`http://<ip-serveur>:8080`)
- [ ] Débloquer le compte admin (mot de passe initial dans `secrets/initialAdminPassword`)

## 2. Installer les dépendances d'exécution
Deux options — choisir UNE :
- [ ] **Option A (simple)** : installer **Node.js ≥ 18** sur l'agent + plugin Jenkins « NodeJS »
- [ ] **Option B (recommandée)** : utiliser l'image Docker `mcr.microsoft.com/playwright:v1.48.0-jammy`
      comme agent → Node + navigateurs déjà inclus (pas de `playwright install` à chaque build)

## 3. Installer les plugins Jenkins
- [ ] **Git** (récupérer le repo)
- [ ] **HTML Publisher** (afficher le rapport Playwright)
- [ ] **JUnit** (graphe de tendance des tests — souvent déjà présent)
- [ ] **NodeJS** (si Option A choisie au point 2)

## 4. Créer le job
- [ ] *Nouveau Item* → type **Pipeline**
- [ ] Section *Pipeline* → **Pipeline script from SCM**
- [ ] SCM : **Git** → URL du repo : `https://github.com/KevinAuchoybur/myProWebsite.git`
- [ ] Branche : `main`
- [ ] **Script Path** : `tests-e2e/Jenkinsfile`
- [ ] Sauvegarder

## 5. Vérifier
- [ ] Lancer un **build manuel** (« Build Now ») → doit passer au vert
- [ ] Vérifier que le **Playwright Report** s'affiche dans le menu du build
- [ ] Vérifier le **graphe de tendance** des tests (Test Result Trend)
- [ ] Confirmer que le **déclencheur quotidien** est actif (`cron('H 6 * * *')` déjà dans le Jenkinsfile)

## 6. (Optionnel) Notifications
- [ ] Brancher une **notif e-mail** ou **Slack** en cas d'échec du build
      (plugins « Email Extension » ou « Slack Notification »)

---

💡 **Rien à coder de plus** : `Jenkinsfile`, config Playwright et tests sont déjà dans le repo.
Cette todo ne concerne que l'installation/config de l'outil Jenkins lui-même.
