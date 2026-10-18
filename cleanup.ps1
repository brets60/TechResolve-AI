# ==============================================================================
# TechResolve AI - Project Cleanup & Optimization Script (PowerShell)
# ==============================================================================
# Usage:
#   .\cleanup.ps1              (Standard cleanup: caches, temp files, db vacuum)
#   .\cleanup.ps1 -DeepClean   (Includes clearing Android & Frontend build caches)
# ==============================================================================

param(
    [switch]$DeepClean = $false
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  [CLEANUP] TechResolve AI - Project Cleanup Utility" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Run Python Cleanup Engine
$argsList = @("clean_project.py")
if ($DeepClean) {
    $argsList += "--deep"
}

python @argsList

# 2. Build Cache Cleanup (If DeepClean requested)
if ($DeepClean) {
    Write-Host ""
    Write-Host "[Optional] Deep cleaning Android Gradle intermediates..." -ForegroundColor Yellow
    if (Test-Path "frontend/android") {
        Push-Location "frontend/android"
        .\gradlew.bat clean | Out-Null
        Pop-Location
        Write-Host "OK: Gradle build intermediates cleared." -ForegroundColor Green
    }
}

# 3. Oxlint Code Check
Write-Host ""
Write-Host "Running fast frontend linter (oxlint)..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules/.bin/oxlint.cmd") {
    & ".\frontend\node_modules\.bin\oxlint.cmd" "frontend/src"
} else {
    Write-Host "Notice: oxlint not found, skipping lint check." -ForegroundColor Gray
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  [SUCCESS] Application cleanup complete! Project is clean." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
