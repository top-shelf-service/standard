#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: bash scripts/agents/orchestrator/orchestrator.sh <env-sync|activate-test|diagnose-health|triage-fix> [args...]"
  exit 1
fi

action="$1"
shift || true

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

log_file=".orchestrator.log"

log() {
  echo "[orchestrator] $*" | tee -a "$log_file"
}

run_env_sync() {
  local intent="${1:-coding}"
  local reason="${2:-unspecified}"
  log "env-sync intent=$intent reason=$reason"
  bash scripts/agents/environment/agent-env-ops.sh "$intent"
}

activate_test() {
  log "activate-test"
  bash scripts/agents/tests/env-watch-test.sh
}

diagnose_health() {
  log "diagnose-health"

  local status="pass"
  local reason="none"

  if [[ ! -f ".env.active" ]]; then
    status="fail"
    reason="missing .env.active"
  fi

  if [[ "$status" == "pass" ]]; then
    if ! bash scripts/agents/environment/preflight.sh; then
      status="fail"
      reason="preflight failed"
    fi
  fi

  local watch_status="stopped"
  if [[ -f ".agent-env-watch.pid" ]]; then
    pid="$(cat .agent-env-watch.pid)"
    if ps -p "$pid" >/dev/null 2>&1; then
      watch_status="running"
    fi
  fi

  echo "status: $status"
  echo "reason: $reason"
  echo "watcher: $watch_status"

  if [[ "$status" != "pass" ]]; then
    return 1
  fi
}

triage_fix() {
  log "triage-fix"

  if [[ ! -f ".env.active" ]]; then
    log "missing .env.active -> switching to local"
    bash scripts/agents/environment/use-env.sh local
  fi

  if bash scripts/agents/environment/preflight.sh; then
    echo "status: pass"
    echo "fix_applied: none-needed"
    return 0
  fi

  log "first preflight failed -> deterministic retry using local"
  bash scripts/agents/environment/use-env.sh local

  if bash scripts/agents/environment/preflight.sh; then
    echo "status: pass"
    echo "fix_applied: switched-to-local"
    return 0
  fi

  echo "status: fail"
  echo "fix_applied: retry-exhausted"
  echo "next_action: escalate"
  return 1
}

case "$action" in
  env-sync)
    run_env_sync "$@"
    ;;
  activate-test)
    activate_test
    ;;
  diagnose-health)
    diagnose_health
    ;;
  triage-fix)
    triage_fix
    ;;
  *)
    echo "❌ Unknown action: $action"
    echo "Allowed: env-sync | activate-test | diagnose-health | triage-fix"
    exit 1
    ;;
esac
