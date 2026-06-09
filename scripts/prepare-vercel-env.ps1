# Generates vercel-env.production for import in Vercel Dashboard:
# Project Settings -> Environment Variables -> paste or "Import .env"

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"
$outFile = Join-Path $root "vercel-env.production"

if (-not (Test-Path $envFile)) {
  Write-Error ".env not found at $envFile"
}

function New-RandomSecret {
  param([int]$Length = 48)
  $bytes = New-Object byte[] $Length
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  return [Convert]::ToBase64String($bytes) -replace '[+/=]', ''
}

$lines = Get-Content $envFile
$result = @()
$overrides = @{
  "NEXT_PUBLIC_APP_URL" = "https://detoxchallange.vercel.app"
}

foreach ($line in $lines) {
  if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }
  if ($line -match '^([^=]+)=(.*)$') {
    $key = $matches[1].Trim()
    $value = $matches[2].Trim().Trim('"')
    if ($overrides.ContainsKey($key)) {
      $value = $overrides[$key]
    }
    if ($key -eq "PORTAL_SESSION_SECRET" -and $value -match "change-this") {
      $value = New-RandomSecret
    }
    $result += "$key=$value"
  }
}

if (-not ($result -match "^CRON_SECRET=")) {
  $result += "CRON_SECRET=$(New-RandomSecret)"
}

$result | Set-Content -Path $outFile -Encoding utf8
Write-Host "Wrote $outFile"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Open https://vercel.com -> detoxchallange -> Settings -> Environment Variables"
Write-Host "2. Import vercel-env.production (Production + Preview)"
Write-Host "3. Redeploy the latest deployment"
