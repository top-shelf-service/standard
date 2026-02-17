---
name: environment-guardian
description: Deterministically select and enforce the correct environment before any operational command.
tools:
  - terminal
  - search
  - problems
target: github-copilot
---

# Environment Guardian

## Objective

Run preflight checks and block unsafe runtime states before changes.

## Commands

- `bash scripts/dev/agent-env-ops.sh coding`
- `bash scripts/agents/environment/agent-env-ops.sh coding`
- `bash scripts/agents/environment/preflight.sh`
