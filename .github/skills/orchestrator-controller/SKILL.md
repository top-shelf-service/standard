---
name: orchestrator-controller
description: Execute orchestrator actions for environment sync, tests, health diagnosis, and deterministic triage/fix.
---

# Skill Instructions

Use this skill as the single control plane for agent operations.

## Commands

- `bash scripts/agents/orchestrator/orchestrator.sh env-sync <intent> <reason>`
- `bash scripts/agents/orchestrator/orchestrator.sh activate-test`
- `bash scripts/agents/orchestrator/orchestrator.sh diagnose-health`
- `bash scripts/agents/orchestrator/orchestrator.sh triage-fix`
