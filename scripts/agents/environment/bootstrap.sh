#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Enabling corepack"
corepack enable

echo "[2/4] Activating pnpm 9.15.5"
corepack prepare pnpm@9.15.5 --activate

echo "[3/4] Verifying node and pnpm"
node --version
pnpm --version

if [[ -f "package.json" ]]; then
  echo "[4/4] Installing dependencies"
  pnpm install --frozen-lockfile || pnpm install
else
  echo "[4/4] No package.json found, skipping install"
fi

echo "✅ Development environment bootstrap complete"
