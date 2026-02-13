#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: bash scripts/agents/environment/agent-run.sh <intent|auto> -- <command...>"
  echo "Example: bash scripts/agents/environment/agent-run.sh auto -- pnpm test"
  exit 1
fi

intent_input="$1"
shift

if [[ "${1:-}" != "--" ]]; then
  echo "❌ Missing '--' separator before command"
  echo "Usage: bash scripts/agents/environment/agent-run.sh <intent|auto> -- <command...>"
  exit 1
fi
shift

if [[ $# -eq 0 ]]; then
  echo "❌ Missing command to run"
  exit 1
fi

infer_intent() {
  local cmd="$*"

  if echo "$cmd" | grep -Eiq "\b(prod|production|live|hotfix-prod)\b"; then
    echo "production-ops"
    return
  fi

  if echo "$cmd" | grep -Eiq "\b(release|deploy|tag|promote)\b"; then
    echo "release"
    return
  fi

  if echo "$cmd" | grep -Eiq "\b(integration|e2e|compose|contract|smoke)\b"; then
    echo "integration"
    return
  fi

  echo "coding"
}

if [[ "$intent_input" == "auto" ]]; then
  intent="$(infer_intent "$*")"
else
  intent="$intent_input"
fi

echo "🤖 Agent Runner"
echo "Intent mode: $intent_input"
echo "Resolved intent: $intent"
echo "Command: $*"

bash scripts/agents/environment/agent-env-ops.sh "$intent"

echo "▶️ Running guarded command..."
"$@"
