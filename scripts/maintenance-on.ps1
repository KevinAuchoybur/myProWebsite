# ============================================================
#  Active la page de maintenance sur le site en ligne
#  Usage :  .\scripts\maintenance-on.ps1
# ============================================================

$ErrorActionPreference = 'Stop'

# Se place à la racine du projet (dossier parent de /scripts)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# --- Garde-fous ---
if (Test-Path 'index-live.html') {
    Write-Host "[!] La maintenance semble deja active (index-live.html existe)." -ForegroundColor Yellow
    Write-Host "    Lance d'abord scripts\maintenance-off.ps1 si besoin." -ForegroundColor Yellow
    exit 1
}
if (-not (Test-Path 'maintenance.html')) {
    Write-Host "[X] maintenance.html introuvable. Abandon." -ForegroundColor Red
    exit 1
}

Write-Host "==> Activation de la page de maintenance..." -ForegroundColor Cyan

# 1. Met le vrai site de cote
git mv index.html index-live.html

# 2. Copie la page de maintenance en index.html (on garde maintenance.html comme source)
Copy-Item maintenance.html index.html -Force
git add index.html

# 3. Commit + push
git commit -q -m "Active la page de maintenance"
git pull --rebase origin main -q
git push -q

Write-Host "[OK] Page de maintenance ACTIVE en ligne." -ForegroundColor Green
Write-Host "     Pense a lancer scripts\maintenance-off.ps1 une fois termine." -ForegroundColor Green
