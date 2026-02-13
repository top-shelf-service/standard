# Agent Framework Selection

## Decision

Selected framework: **Microsoft Agent Framework** for production orchestration.

## Why this fits the end goal

- Graph-based workflows for deterministic orchestration paths
- Multi-agent support for Environment, Orchestrator, Health, and Release gates
- Native observability hooks (OpenTelemetry) for production diagnostics
- Python and .NET support for future service/runtime evolution
- Workflow checkpoints and human-in-the-loop support for controlled escalation

## Recommended implementation profile

### Phase 1 (now)

- Shell-first deterministic control plane (already implemented)
- Agent contracts and decision trees in-repo (`ai-agent/` + `.github/skills/`)

### Phase 2 (framework adoption)

- Introduce a Python orchestration service using Microsoft Agent Framework workflows
- Map existing orchestrator actions:
  - `env-sync`
  - `activate-test`
  - `diagnose-health`
  - `triage-fix`

### Phase 3 (production hardening)

- Add OpenTelemetry traces for each orchestrator action
- Add durable state/checkpointing for long-running operations
- Add policy enforcement middleware and audit event sinks

## Non-negotiables during migration

- Preserve current deterministic contracts and hard blocks
- No stubs in runtime-critical paths
- Backward-compatible command surface during cutover

## Entry command standard

Until framework service is live, use:

```bash
bash scripts/agents/orchestrator/orchestrator.sh <action>
```

When framework service is introduced, keep this command as the compatibility facade.
