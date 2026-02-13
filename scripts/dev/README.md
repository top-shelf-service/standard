# Dev Wrappers (Compatibility Only)

`scripts/dev/` is condensed to simple wrapper entrypoints.

Each file forwards to canonical script domains under `scripts/agents/`.

Examples:

- `scripts/dev/preflight.sh` -> `scripts/agents/environment/preflight.sh`
- `scripts/dev/orchestrator.sh` -> `scripts/agents/orchestrator/orchestrator.sh`

Do not add business logic to wrappers. Add logic only in canonical domains.
