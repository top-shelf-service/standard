# Scripts Layout

This directory is intentionally split into **canonical domains** and **compatibility wrappers**.

## Canonical (authoritative)

- `scripts/agents/environment/`
- `scripts/agents/orchestrator/`
- `scripts/agents/health/`
- `scripts/agents/tests/`

Use these paths for all new development and retrieval.

## Compatibility layer

- `scripts/dev/`
- `scripts/health/`

These are thin wrappers that forward to canonical scripts to avoid breaking old commands.

## Index

- `scripts/agents/INDEX.md` is the command index for agent retrieval.
