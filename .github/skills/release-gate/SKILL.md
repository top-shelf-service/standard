---
name: release-gate
description: Run deterministic release gates for single-operator and production-safe promotion.
---

# Skill Instructions

Use this skill to block unsafe release attempts.

## Commands

- Solo gate: `bash scripts/agents/environment/solo-release.sh`
- Full gate: `bash scripts/agents/orchestrator/orchestrator.sh activate-test && bash scripts/agents/orchestrator/orchestrator.sh diagnose-health`
