# Sync critical email env vars from local .env to Vercel production
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"

if (-not (Test-Path $envFile)) {
  Write-Error ".env not found"
}

function Get-EnvValue($name) {
  foreach ($line in Get-Content $envFile) {
    if ($line -match "^$name=(.*)$") {
      return $matches[1].Trim().Trim('"')
    }
  }
  return $null
}

function Set-VercelEnv($name, $value) {
  if (-not $value) {
    Write-Host "SKIP $name (empty)"
    return
  }
  Write-Host "Setting $name on production..."
  npx vercel env rm $name production --yes 2>$null | Out-Null
  npx vercel env add $name production --value $value --yes --force
}

$vars = @(
  "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM",
  "DOCTOR_EMAIL", "CLINIC_NAME", "CHALLENGE_THANK_YOU_SUBJECT",
  "PORTAL_SESSION_PRICE", "NEXT_PUBLIC_APP_URL"
)

foreach ($name in $vars) {
  Set-VercelEnv $name (Get-EnvValue $name)
}

$cron = Get-EnvValue "CRON_SECRET"
if (-not $cron) {
  $bytes = New-Object byte[] 32
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $cron = [Convert]::ToBase64String($bytes) -replace '[+/=]', ''
  Add-Content -Path $envFile -Value "CRON_SECRET=$cron"
  Write-Host "Generated CRON_SECRET in .env"
}
Set-VercelEnv "CRON_SECRET" $cron

Write-Host ""
Write-Host "Done. Redeploy with: npx vercel deploy --prod --yes"
