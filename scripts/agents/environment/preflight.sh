#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running preflight checks..."

if [[ ! -f ".env.active" ]]; then
  echo "❌ Missing .env.active"
  echo "Run: bash scripts/dev/use-env.sh local"
  exit 1
fi

required_vars=(
  "NODE_ENV"
  "TOPSHELF_ENV"
  "API_BASE_URL"
  "LOG_LEVEL"
)

for key in "${required_vars[@]}"; do
  if ! grep -E "^${key}=" .env.active >/dev/null; then
    echo "❌ Missing required key in .env.active: $key"
    exit 1
  fi
done

bash scripts/health/no-stubs.sh

echo "✅ Preflight passed"
