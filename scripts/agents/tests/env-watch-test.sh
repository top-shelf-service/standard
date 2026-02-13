#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

echo "🧪 Env Watch Test Matrix"

rm -f .agent-intent .watch-test.tmp .agent-env-watch.state .agent-env-watch.log

echo "[1/5] Baseline local"
bash scripts/agents/environment/use-env.sh local >/dev/null
bash scripts/agents/environment/agent-env-watch.sh --once >/dev/null

echo "[2/5] Override -> integration"
echo integration > .agent-intent
bash scripts/agents/orchestrator/orchestrator.sh env-sync integration test-override >/dev/null

echo "[3/5] Override -> production-ops"
echo production-ops > .agent-intent
bash scripts/agents/orchestrator/orchestrator.sh env-sync production-ops test-override >/dev/null

echo "[4/5] Clear override and restore default"
rm -f .agent-intent
bash scripts/agents/orchestrator/orchestrator.sh env-sync coding return-default >/dev/null

echo "[5/5] Run diagnose-health"
bash scripts/agents/orchestrator/orchestrator.sh diagnose-health >/dev/null

final_env="$(grep -E '^TOPSHELF_ENV=' .env.active | cut -d'=' -f2-)"
echo "result: pass"
echo "final_env: $final_env"
