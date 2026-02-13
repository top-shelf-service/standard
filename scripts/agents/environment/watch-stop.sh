#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

pid_file=".agent-env-watch.pid"

if [[ ! -f "$pid_file" ]]; then
  echo "ℹ️  env-watch is not running"
  exit 0
fi

pid="$(cat "$pid_file")"
if ps -p "$pid" >/dev/null 2>&1; then
  kill "$pid"
  echo "✅ env-watch stopped (pid=$pid)"
else
  echo "ℹ️  env-watch pid was stale (pid=$pid)"
fi

rm -f "$pid_file"
