#!/usr/bin/env bash
set -euo pipefail

command="${1:-}"
shift || true

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

case "${command}" in
  env-sync)
    exec bash "${repo_root}/scripts/dev/agent-env-ops.sh" "${1:-coding}"
    ;;
  activate-test)
    cd "${repo_root}"
    exec pnpm test
    ;;
  diagnose-health)
    cd "${repo_root}"
    exec pnpm doctor
    ;;
  triage-fix)
    echo "triage_fix=manual-review-required"
    echo "status=ok"
    ;;
  *)
    cat <<'USAGE'
usage: orchestrator.sh <command>

Commands:
 env-sync         Synchronize environment and run preflight checks
 activate-test    Run the test suite from the repository root
 diagnose-health  Run pnpm doctor to diagnose environment and tooling health
 triage-fix       Mark issue for manual review and report status to caller
USAGE
    exit 2
    ;;
esac
