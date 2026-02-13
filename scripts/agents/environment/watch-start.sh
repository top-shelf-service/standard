#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

pid_file=".agent-env-watch.pid"
log_file=".agent-env-watch.log"
foreground=false
interval=10
apply=true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --foreground)
      foreground=true
      shift
      ;;
    --interval)
      interval="${2:-10}"
      shift 2
      ;;
    --no-apply)
      apply=false
      shift
      ;;
    *)
      echo "Usage: bash scripts/agents/environment/watch-start.sh [--foreground] [--interval <seconds>] [--no-apply]"
      exit 1
      ;;
  esac
done

watch_args=(--interval "$interval")
if [[ "$apply" == true ]]; then
  watch_args+=(--apply)
fi

if [[ "$foreground" == true ]]; then
  echo "▶️  env-watch running in foreground"
  exec bash scripts/agents/environment/agent-env-watch.sh "${watch_args[@]}"
fi

if [[ -f "$pid_file" ]]; then
  pid="$(cat "$pid_file")"
  if ps -p "$pid" >/dev/null 2>&1; then
    echo "ℹ️  env-watch already running (pid=$pid)"
    exit 0
  fi
fi

nohup bash scripts/agents/environment/agent-env-watch.sh "${watch_args[@]}" >> "$log_file" 2>&1 &
echo $! > "$pid_file"
echo "✅ env-watch started (pid=$(cat "$pid_file"))"
echo "📄 log: $log_file"
