# Sync env vars from vercel-env.production to Vercel (Production + Preview)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root "vercel-env.production"

if (-not (Test-Path $envFile)) {
  Write-Error "Run scripts/prepare-vercel-env.ps1 first to create vercel-env.production"
}

Push-Location $root

foreach ($line in Get-Content $envFile) {
  if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }
  if ($line -notmatch '^([^=]+)=(.*)$') { continue }

  $key = $matches[1].Trim()
  $value = $matches[2].Trim()

  Write-Host "Setting $key ..."
  npx vercel env add $key production --value $value --force --yes 2>&1 | Out-Null
  npx vercel env add $key preview --value $value --force --yes 2>&1 | Out-Null
}

Pop-Location
Write-Host "Done. Redeploy production for changes to take effect."
