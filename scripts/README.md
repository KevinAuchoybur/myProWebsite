# Scripts utilitaires

## 🛠️ Mode maintenance

Bascule le site en ligne entre le **vrai site** et la **page de maintenance**.

### Activer la maintenance

```powershell
.\scripts\maintenance-on.ps1
```

Ce que fait le script :
1. Déplace `index.html` → `index-live.html` (le vrai site, mis de côté)
2. Copie `maintenance.html` → `index.html` (la page affichée aux visiteurs)
3. Commit + push → en ligne sous ~1-2 min

### Désactiver (remettre le site)

```powershell
.\scripts\maintenance-off.ps1
```

Ce que fait le script :
1. Supprime l'`index.html` de maintenance
2. Restaure `index-live.html` → `index.html` (le vrai site)
3. Commit + push

### Garde-fous

- `maintenance-on` refuse de tourner si la maintenance est **déjà active**.
- `maintenance-off` refuse de tourner s'il **n'y a pas** de maintenance active.
- `maintenance.html` n'est jamais supprimé (il reste la source réutilisable).

> ⚠️ Si PowerShell bloque l'exécution des scripts, lance une fois :
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
