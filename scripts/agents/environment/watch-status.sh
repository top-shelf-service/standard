#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

pid_file=".agent-env-watch.pid"
log_file=".agent-env-watch.log"
state_file=".agent-env-watch.state"

if [[ -f "$pid_file" ]]; then
  pid="$(cat "$pid_file")"
  if ps -p "$pid" >/dev/null 2>&1; then
    echo "status: running"
    echo "pid: $pid"
  else
    echo "status: stopped (stale pid file)"
  fi
else
  echo "status: stopped"
fi

if [[ -f "$state_file" ]]; then
  echo "last_state: $(cat "$state_file")"
fi

if [[ -f "$log_file" ]]; then
  echo "log_file: $log_file"
fi
