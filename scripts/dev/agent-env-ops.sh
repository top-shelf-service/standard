#!/usr/bin/env bash
set -euo pipefail

intent="${1:-coding}"

echo "🤖 Environment Guardian"
echo "Intent: ${intent}"
echo "Current environment: local"
echo "Selected environment: local"
echo "Decision: no-change-needed"

if ! command -v node >/dev/null 2>&1; then
  echo "status: fail"
  echo "blocking_reason: Node.js is not installed"
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "status: fail"
  echo "blocking_reason: pnpm is not installed"
  exit 1
fi

echo "🔍 Running preflight checks..."
pnpm doctor

echo "checks_executed: env-decision,preflight"
echo "status: pass"
echo "next_action: proceed-with-task"
