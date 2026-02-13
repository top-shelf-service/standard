#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/agents/environment/use-env.sh <local|dev|stage|prod>"
  exit 1
fi

target="$1"
source_file=".env.${target}"

if [[ ! -f "$source_file" ]]; then
  echo "❌ Environment file not found: $source_file"
  exit 1
fi

cp "$source_file" .env.active

echo "✅ Active environment: $target"
echo "📄 Wrote .env.active from $source_file"
