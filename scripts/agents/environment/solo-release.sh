#!/usr/bin/env bash
set -euo pipefail

echo "🧑‍🍳 Solo Release Flow"

echo "[1/4] Switch to local"
bash scripts/agents/environment/use-env.sh local

echo "[2/4] Local preflight"
bash scripts/agents/environment/preflight.sh

echo "[3/4] Switch to stage"
bash scripts/agents/environment/use-env.sh stage

echo "[4/4] Stage preflight"
bash scripts/agents/environment/preflight.sh

echo "✅ Solo release gate passed (local + stage)"
echo "Next: run your release/deploy command"
