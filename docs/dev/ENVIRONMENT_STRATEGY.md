# Environment Strategy

## Environments

- `local`: workstation coding and rapid iteration
- `dev`: shared integration testing
- `stage`: pre-production verification
- `prod`: production runtime

## Line Cook Translation

Think of environments like kitchen modes:

- `local` = **your practice station** (you can test, chop, and adjust fast)
- `dev` = **team prep kitchen** (everyone checks if things work together)
- `stage` = **mock service before doors open** (final rehearsal)
- `prod` = **live service with guests** (no experiments)

If you use the wrong mode, it is like doing a new recipe on a live ticket during rush.

## Switching environments

Canonical script domain (for retrieval and maintenance):

- `scripts/agents/environment/`
- `scripts/agents/orchestrator/`
- `scripts/agents/health/`
- `scripts/agents/tests/`

Compatibility wrappers remain in `scripts/dev/` and `scripts/health/`.

Use:

```bash
bash scripts/dev/use-env.sh <local|dev|stage|prod>
```

This writes `.env.active` from `.env.<target>`.

Agent-driven option:

```bash
bash scripts/dev/agent-env-ops.sh <coding|integration|release|production-ops>
```

Command-guarded option (recommended):

```bash
bash scripts/dev/agent-run.sh auto -- <your-command>
```

This runs the environment decision automatically before the command.

The agent will decide and report:

- `change-needed` if active env does not match intent
- `no-change-needed` if active env already matches intent

## When to switch

- **Start coding**: switch to `local`
- **Integration verification**: switch to `dev`
- **Release candidate validation**: switch to `stage`
- **Production operations only**: switch to `prod`

## Simple Rule of Thumb

- Building or changing code? → `local`
- Checking if your work fits with everyone else's? → `dev`
- Verifying release candidate before go-live? → `stage`
- Handling real operations only? → `prod`

## How to know a switch is required

Run preflight before coding or running checks:

```bash
bash scripts/dev/preflight.sh
```

If `TOPSHELF_ENV` in `.env.active` does not match your current task intent, switch environments.

If it already matches, no switch is needed; just run preflight.

In kitchen terms: if your station card does not match the shift you are on, stop and reset before cooking.

## Guardrails

- Never commit secrets; these files contain non-secret placeholders only.
- Always run `preflight` before `doctor` and before release work.
- Keep environment behavior data-driven; do not hardcode env-specific logic in runtime files.

## Quick Commands

```bash
# Start coding
bash scripts/dev/use-env.sh local && bash scripts/dev/preflight.sh

# Team integration check
bash scripts/dev/use-env.sh dev && bash scripts/dev/preflight.sh

# Release candidate check
bash scripts/dev/use-env.sh stage && bash scripts/dev/preflight.sh

# Production operations only
bash scripts/dev/use-env.sh prod && bash scripts/dev/preflight.sh
```

## Agent Commands

```bash
# coding flow
bash scripts/dev/agent-env-ops.sh coding

# integration flow
bash scripts/dev/agent-env-ops.sh integration

# release flow
bash scripts/dev/agent-env-ops.sh release

# production operations flow
bash scripts/dev/agent-env-ops.sh production-ops

# auto-resolve intent from command and run guarded
bash scripts/dev/agent-run.sh auto -- pnpm test
```

## Background Watcher (Event-Driven)

The watcher runs continuously and listens for signals that could require env changes:

- branch changed
- worktree changed from clean -> dirty
- `.agent-intent` override file changed

The watcher delegates changes to the orchestrator (single control plane):

```bash
bash scripts/dev/orchestrator.sh env-sync <intent> <reason>
```

Start/stop/status:

```bash
bash scripts/dev/agent-env-watch-start.sh
bash scripts/dev/agent-env-watch-status.sh
bash scripts/dev/agent-env-watch-stop.sh
```

One-shot evaluation:

```bash
bash scripts/dev/agent-env-watch.sh --once
```

## Orchestrator Commands

```bash
# run env synchronization
bash scripts/dev/orchestrator.sh env-sync coding manual

# run test matrix
bash scripts/dev/orchestrator.sh activate-test

# diagnose current health
bash scripts/dev/orchestrator.sh diagnose-health

# attempt deterministic triage/fix
bash scripts/dev/orchestrator.sh triage-fix

# update main by cherry-picking branch commits, then optionally delete clean branches
bash scripts/dev/orchestrator.sh sync-main <branch1> <branch2> --delete-clean
```

## Solo Task

Run the full single-operator gate as a VS Code task:

- Task: `solo-release`

Or from shell:

```bash
bash scripts/dev/solo-release.sh
```
