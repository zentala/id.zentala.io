#requires -Version 5
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path $PSScriptRoot -Parent
Set-Location $repoRoot

function Ensure-NodePresent {
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js (recommended via nvm)."
  }
}

function Try-NvmUseFromNvmrc {
  param([string]$nvmrcPath = ".nvmrc")

  $nvm = Get-Command nvm -ErrorAction SilentlyContinue
  if (-not $nvm) {
    if (Test-Path $nvmrcPath) {
      try { $current = node -v } catch { $current = "unknown" }
      Write-Warning "nvm not found. Continuing with system Node $current. Potential compatibility issues. Installing nvm is recommended."
    }
    return
  }

  if (-not (Test-Path $nvmrcPath)) { return }

  $spec = (Get-Content $nvmrcPath -Raw).Trim()
  if (-not $spec) { return }

  try {
    $candidate = $spec.TrimStart('v')

    if ($candidate -match '^[0-9]+$') {
      # Bare major: choose highest installed patch in that major; do not install.
      $installed = nvm list 2>$null | Select-String -Pattern "^\s*v?$candidate\.\d+\.\d+" | ForEach-Object {
        ($_.Matches.Value -replace '->','' -replace 'v','').Trim()
      }
      if ($installed) {
        $target = ($installed | Sort-Object { [Version]$_ } | Select-Object -Last 1)
        nvm use $target | Out-Null
        Write-Host "Using Node $target via nvm."
      } else {
        $cur = try { node -v } catch { "unknown" }
        Write-Warning "nvm present but no Node $candidate.x installed. Using system Node $cur. Consider 'nvm install $candidate'."
      }
    } else {
      $ok = $true
      try { nvm use $candidate | Out-Null } catch { $ok = $false }
      if ($ok) {
        Write-Host "Using Node $candidate via nvm."
      } else {
        $cur = try { node -v } catch { "unknown" }
        Write-Warning "nvm present but Node '$candidate' not installed. Using system Node $cur. Consider 'nvm install $candidate'."
      }
    }
  } catch {
    $cur = try { node -v } catch { "unknown" }
    Write-Warning "Failed to switch Node via nvm: $($_.Exception.Message). Using system Node $cur."
  }
}

Ensure-NodePresent
Try-NvmUseFromNvmrc

if (Test-Path "package-lock.json") {
  npm ci
} else {
  npm install
}

npm run dev


