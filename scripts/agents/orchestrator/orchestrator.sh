#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: bash scripts/agents/orchestrator/orchestrator.sh <env-sync|activate-test|diagnose-health|triage-fix|sync-main> [args...]"
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

sync_main() {
  local delete_clean="false"
  local branches=()
  local arg
  for arg in "$@"; do
    if [[ "$arg" == "--delete-clean" ]]; then
      delete_clean="true"
    else
      branches+=("$arg")
    fi
  done

  if [[ ${#branches[@]} -eq 0 ]]; then
    echo "Usage: bash scripts/agents/orchestrator/orchestrator.sh sync-main <branch> [branch...] [--delete-clean]"
    return 1
  fi

  if [[ -n "$(git status --porcelain)" ]]; then
    echo "❌ Working tree is not clean. Commit or stash changes before sync-main."
    return 1
  fi

  local branch
  for branch in "${branches[@]}"; do
    if ! git check-ref-format --branch "$branch" >/dev/null 2>&1; then
      echo "❌ Invalid branch name: $branch"
      return 1
    fi
  done

  if ! git fetch origin main; then
    echo "❌ Unable to fetch main from origin."
    return 1
  fi
  for branch in "${branches[@]}"; do
    if ! git fetch origin "refs/heads/$branch:refs/remotes/origin/$branch"; then
      echo "❌ Unable to fetch branch from origin: $branch"
      return 1
    fi
  done
  if git show-ref --verify --quiet refs/heads/main; then
    git checkout main
  else
    git checkout -b main origin/main
  fi
  git pull --ff-only origin main

  for branch in "${branches[@]}"; do
    log "sync-main cherry-pick branch=$branch"
    if ! git show-ref --verify --quiet "refs/remotes/origin/$branch"; then
      echo "❌ Missing remote branch: origin/$branch"
      return 1
    fi

    local pending_commits=()
    mapfile -t pending_commits < <(git cherry main "origin/$branch" | awk '/^\+ / { print $2 }')
    if [[ ${#pending_commits[@]} -eq 0 ]]; then
      echo "ℹ️ No new commits to cherry-pick from $branch"
      continue
    fi

    if ! git cherry-pick "${pending_commits[@]}"; then
      git cherry-pick --abort || true
      echo "❌ Conflict while cherry-picking $branch. Cherry-pick aborted. Resolve conflicts and retry."
      return 1
    fi

    if [[ "$delete_clean" == "true" ]]; then
      local remaining_commits=()
      mapfile -t remaining_commits < <(git cherry main "origin/$branch" | awk '/^\+ / { print $2 }')
      if [[ ${#remaining_commits[@]} -eq 0 ]]; then
        if ! git push origin --delete "$branch"; then
          echo "❌ Failed to delete branch on origin: $branch"
          return 1
        fi
      else
        echo "ℹ️ Skipping delete for $branch (branch still has commits not yet applied to main)."
      fi
    fi
  done

  if ! git push origin main; then
    echo "❌ Failed to push updated main. Re-run after syncing with origin/main."
    return 1
  fi
  echo "✅ Main updated from requested branches."
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
  sync-main)
    sync_main "$@"
    ;;
  *)
    echo "❌ Unknown action: $action"
    echo "Allowed: env-sync | activate-test | diagnose-health | triage-fix | sync-main"
    exit 1
    ;;
esac
