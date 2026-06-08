# ============================================================
#  Desactive la maintenance et remet le vrai site en ligne
#  Usage :  .\scripts\maintenance-off.ps1
# ============================================================

$ErrorActionPreference = 'Stop'

# Se place à la racine du projet (dossier parent de /scripts)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# --- Garde-fou ---
if (-not (Test-Path 'index-live.html')) {
    Write-Host "[!] Aucune maintenance active (index-live.html introuvable)." -ForegroundColor Yellow
    Write-Host "    Le site est deja en ligne normalement." -ForegroundColor Yellow
    exit 1
}

Write-Host "==> Retablissement du site..." -ForegroundColor Cyan

# 1. La page de maintenance affichee (index.html) est jetable : on la supprime
Remove-Item index.html -Force

# 2. On remet le vrai site
git mv index-live.html index.html

# 3. Commit + push
git commit -q -m "Desactive la page de maintenance"
git pull --rebase origin main -q
git push -q

Write-Host "[OK] Le site est de nouveau EN LIGNE." -ForegroundColor Green
