#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root"

critical_files=(
  "engine/validators/run-all.ts"
  "engine/compiler/build-pack.ts"
  "scripts/retrieval-server.ts"
  "scripts/doctor.ts"
  "scripts/health/checks.ts"
)

patterns=(
  "\\bstub\\b"
  "stub implementation"
  "placeholder"
  "would start"
  "todo"
)

has_error=0

echo "🔎 Enforcing no-stub policy..."

for file in "${critical_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    continue
  fi

  for pattern in "${patterns[@]}"; do
    if grep -Ein "$pattern" "$file" >/dev/null; then
      echo "❌ No-stub violation in $file (pattern: $pattern)"
      grep -Ein "$pattern" "$file" || true
      has_error=1
    fi
  done
done

if [[ "$has_error" -ne 0 ]]; then
  echo
  echo "Failing: runtime-critical files cannot contain stubs/placeholders/TODO markers."
  exit 1
fi

echo "✅ No-stub policy passed"
