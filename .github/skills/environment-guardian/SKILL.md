---
name: environment-guardian
description: Deterministically select and enforce the correct environment for coding, integration, release, and production operations.
---

# Skill Instructions

Use this skill for environment correctness before any operational command.

## Procedure

1. Run `bash scripts/agents/environment/agent-env-ops.sh <intent>`.
2. Confirm decision output (`change-needed` or `no-change-needed`).
3. Confirm preflight pass.

## Event-Driven Mode

- Start watcher: `bash scripts/agents/environment/watch-start.sh`
- Check status: `bash scripts/agents/environment/watch-status.sh`
- Stop watcher: `bash scripts/agents/environment/watch-stop.sh`
