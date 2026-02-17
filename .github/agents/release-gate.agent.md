---
name: release-gate
description: Enforce deterministic release readiness and block unsafe promotions.
tools:
  - terminal
  - search
  - problems
  - agent
target: github-copilot
---

# Release Gate

## Objective

Prevent merge/release when validation evidence is incomplete.

## Commands

- `pnpm doctor`
- `pnpm test`
- `pnpm lint`
