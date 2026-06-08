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

## 6. Rapport quotidien par e-mail
Le `Jenkinsfile` envoie déjà un mail à **chaque build** (vert ou rouge) avec le statut,
la durée et les liens vers les rapports. Reste à configurer l'envoi côté Jenkins :

- [ ] Installer le plugin **Email Extension** (`emailext`)
- [ ] Remplacer `EMAIL_TO` dans le `Jenkinsfile` par ta **vraie adresse**
- [ ] *Manage Jenkins → System* → section **Extended E-mail Notification** :
  - [ ] **SMTP server** : ex. `smtp.gmail.com`
  - [ ] **SMTP port** : `465` (SSL) ou `587` (TLS)
  - [ ] **Credentials** : ton e-mail + un **mot de passe d'application** (pas ton mot de passe normal !)
        → pour Gmail : compte Google → Sécurité → « Mots de passe des applications »
  - [ ] Cocher **Use SSL / TLS**
  - [ ] Renseigner l'adresse d'expéditeur (**System Admin e-mail address** plus haut dans la page)
- [ ] Cliquer **Test configuration** (bouton en bas de la section) → tu dois recevoir un mail de test
- [ ] Lancer un build → vérifier la réception du rapport

> 💡 Le mail part **tous les jours**, même quand tout est vert : c'est ton « tout va bien » quotidien.
> Si tu préfères **ne recevoir QUE les échecs**, déplace le bloc `emailext` de `post { always }`
> vers `post { failure }` dans le `Jenkinsfile` (dis-le moi, je te le fais).

## 7. (Optionnel) Notifications Slack
- [ ] Brancher une notif **Slack** en plus/à la place du mail (plugin « Slack Notification »)

---

💡 **Rien à coder de plus** : `Jenkinsfile`, config Playwright et tests sont déjà dans le repo.
Cette todo ne concerne que l'installation/config de l'outil Jenkins lui-même.
