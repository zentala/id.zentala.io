#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed. Please install Node.js (recommended via nvm)." >&2
  exit 1
fi

# Try to load nvm if available; do NOT install anything.
try_load_nvm() {
  if command -v nvm >/dev/null 2>&1; then
    return 0
  fi
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.nvm/nvm.sh"
    return 0
  fi
  if [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "/usr/local/opt/nvm/nvm.sh"
    return 0
  fi
  return 1
}

if [ -f ".nvmrc" ]; then
  if try_load_nvm; then
    if nvm use >/dev/null 2>&1; then
      echo "Using Node $(node -v) via nvm."
    else
      spec="$(tr -d '[:space:]' < .nvmrc)"
      echo "Warning: nvm present but Node '$spec' not installed. Using system Node $(node -v). Consider: nvm install \"$spec\"." >&2
    fi
  else
    echo "Warning: nvm not found. Continuing with system Node $(node -v). Potential compatibility issues; installing nvm is recommended." >&2
  fi
fi

if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi

npm run dev


