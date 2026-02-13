#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/agents/environment/agent-env-ops.sh <coding|integration|release|production-ops>"
  exit 1
fi

intent="$1"

case "$intent" in
  coding)
    target="local"
    ;;
  integration)
    target="dev"
    ;;
  release)
    target="stage"
    ;;
  production-ops)
    target="prod"
    ;;
  *)
    echo "❌ Unknown intent: $intent"
    echo "Allowed intents: coding | integration | release | production-ops"
    exit 1
    ;;
esac

current_env="unknown"
if [[ -f ".env.active" ]]; then
  current_env="$(grep -E '^TOPSHELF_ENV=' .env.active | cut -d'=' -f2- || true)"
  if [[ -z "$current_env" ]]; then
    current_env="unknown"
  fi
fi

change_decision="change-needed"
if [[ "$current_env" == "$target" ]]; then
  change_decision="no-change-needed"
fi

echo "🤖 Environment Guardian"
echo "Intent: $intent"
echo "Current environment: $current_env"
echo "Selected environment: $target"
echo "Decision: $change_decision"

if [[ "$change_decision" == "change-needed" ]]; then
  bash scripts/agents/environment/use-env.sh "$target"
else
  echo "ℹ️  Environment already correct, skipping switch"
fi

bash scripts/agents/environment/preflight.sh

echo "checks_executed: env-decision,env-switch-or-skip,preflight"
echo "status: pass"
echo "next_action: proceed-with-task"
echo "✅ Agent checks passed for intent: $intent"
