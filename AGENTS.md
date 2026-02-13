# Agents Policy

## Active Agents

## Environment Guardian Agent

### Purpose

Keep environment operations deterministic for a solo operator by selecting the correct environment, running preflight checks, and blocking unsafe transitions.

### Scope

- environment switching
- preflight validation
- no-stub enforcement
- release gate preparation
- orchestrated test activation
- health diagnosis and deterministic triage/fix

### Managed Paths

- `.env.active`
- `.env.local`
- `.env.dev`
- `.env.stage`
- `.env.prod`
- `scripts/agents/environment/use-env.sh`
- `scripts/agents/environment/preflight.sh`
- `scripts/agents/environment/solo-release.sh`
- `scripts/agents/environment/agent-env-watch.sh`
- `scripts/agents/orchestrator/orchestrator.sh`
- `scripts/agents/tests/env-watch-test.sh`
- `scripts/agents/health/no-stubs.sh`
- `scripts/dev/*` (compatibility wrappers)
- `scripts/health/no-stubs.sh` (compatibility wrapper)
- `docs/dev/ENVIRONMENT_STRATEGY.md`

### Intent -> Environment Mapping

- `coding` -> `local`
- `integration` -> `dev`
- `release` -> `stage`
- `production-ops` -> `prod`

### Required Sequence

1. Select target environment from task intent.
2. Run `bash scripts/agents/environment/use-env.sh <target>`.
3. Run `bash scripts/agents/environment/preflight.sh`.
4. If any check fails, stop and report blocking reason.

Recommended automatic entrypoint:

- `bash scripts/agents/environment/agent-run.sh auto -- <command>`

### Hard Blocks

- Missing `.env.active`
- Required env keys missing in `.env.active`
- Any no-stub policy violation
- Attempt to run production operations from non-`prod`

### Escalation

Escalate immediately when:

- policy/runtime contract conflict appears
- preflight repeatedly fails after one deterministic retry
- change request requires relaxing no-stub policy

### Output Contract

Agent responses must include:

- current environment
- selected environment
- decision: `change-needed` or `no-change-needed`
- checks run
- pass/fail status
- exact blocking reason and next action if failed
