#!/usr/bin/env bash
set -euo pipefail

interval=10
apply_changes=false
once=false
default_env="local"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --interval)
      interval="${2:-10}"
      shift 2
      ;;
    --apply)
      apply_changes=true
      shift
      ;;
    --once)
      once=true
      shift
      ;;
    --default-env)
      default_env="${2:-local}"
      shift 2
      ;;
    *)
      echo "Usage: bash scripts/agents/environment/agent-env-watch.sh [--interval <seconds>] [--apply] [--once] [--default-env <env>]"
      exit 1
      ;;
  esac
done

    root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

state_file=".agent-env-watch.state"

intent_from_branch() {
  local branch="$1"

  if echo "$branch" | grep -Eiq '^(hotfix/|prod/|production/)'; then
    echo "production-ops"
    return
  fi

  if echo "$branch" | grep -Eiq '^(main|master|release/)'; then
    echo "release"
    return
  fi

  if echo "$branch" | grep -Eiq '^(integration/|qa/|test/)'; then
    echo "integration"
    return
  fi

  echo "coding"
}

active_env() {
  if [[ -f ".env.active" ]]; then
    grep -E '^TOPSHELF_ENV=' .env.active | cut -d'=' -f2- || true
  fi
}

intent_to_env() {
  case "$1" in
    coding) echo "local" ;;
    integration) echo "dev" ;;
    release) echo "stage" ;;
    production-ops) echo "prod" ;;
    *) echo "local" ;;
  esac
}

default_intent="coding"
case "$default_env" in
  local) default_intent="coding" ;;
  dev) default_intent="integration" ;;
  stage) default_intent="release" ;;
  prod) default_intent="production-ops" ;;
esac

while true; do
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
  dirty="clean"
  if [[ -n "$(git status --porcelain 2>/dev/null || true)" ]]; then
    dirty="dirty"
  fi

base_intent="$(intent_from_branch "$branch")"
signal_reason="branch-rule"

if [[ "$dirty" == "dirty" ]]; then
    base_intent="coding"
    signal_reason="worktree-dirty"
  fi

if [[ -f ".agent-intent" ]]; then
    forced_intent="$(cat .agent-intent | tr -d '[:space:]')"
    if [[ -n "$forced_intent" ]]; then
      base_intent="$forced_intent"
      signal_reason="agent-intent-override"
    fi
  fi

target_env="$(intent_to_env "$base_intent")"
current_env="$(active_env)"
if [[ -z "$current_env" ]]; then
    current_env="unknown"
  fi

  if [[ ! -f ".agent-intent" && "$dirty" == "clean" && "$base_intent" == "coding" && "$current_env" != "$default_env" ]]; then
    signal_reason="auto-return-default"
    base_intent="$default_intent"
    target_env="$default_env"
  fi

decision="no-change-needed"
if [[ "$target_env" != "$current_env" ]]; then
    decision="change-needed"
  fi

fingerprint="branch=$branch|dirty=$dirty|intent=$base_intent|target=$target_env|current=$current_env|decision=$decision|reason=$signal_reason"
last=""
if [[ -f "$state_file" ]]; then
    last="$(cat "$state_file")"
  fi

if [[ "$fingerprint" != "$last" ]]; then
    echo "[env-watch] reason=$signal_reason branch=$branch dirty=$dirty intent=$base_intent current=$current_env target=$target_env decision=$decision"
    echo "$fingerprint" > "$state_file"

    if [[ "$apply_changes" == true && "$decision" == "change-needed" ]]; then
      echo "[env-watch] applying env change via orchestrator"
      if ! bash scripts/agents/orchestrator/orchestrator.sh env-sync "$base_intent" "$signal_reason"; then
        echo "[env-watch] apply failed for intent=$base_intent"
      fi
    fi
  fi

  if [[ "$once" == true ]]; then
    exit 0
  fi

  sleep "$interval"
done
