# Agent Knowledge Base

## Canonical Environment Entrypoints

- Preferred compatibility path: `bash scripts/dev/agent-env-ops.sh coding`
- Canonical environment path: `bash scripts/agents/environment/agent-env-ops.sh coding`
- Preflight shorthand: `bash scripts/agents/environment/preflight.sh`

## Validation Baseline

- `pnpm doctor`
- `pnpm test`
- `pnpm lint`

## Notes

- This repository enforces pnpm (`packageManager` in `package.json`).
- Use path-compatible wrappers under both `scripts/dev` and `scripts/agents` to avoid branch drift.
