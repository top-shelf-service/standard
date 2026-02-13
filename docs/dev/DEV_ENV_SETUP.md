# Development Environment Setup

## Local setup

1. Install Node.js 20 (or use `.nvmrc`):

```bash
nvm install
nvm use
```

1. Bootstrap tooling:

```bash
bash scripts/dev/bootstrap.sh
```

1. If this repo has dependencies, install with:

```bash
pnpm install --frozen-lockfile
```

1. Run no-stub policy check:

```bash
bash scripts/health/no-stubs.sh
```

1. Select active environment:

```bash
bash scripts/dev/use-env.sh local
```

1. Run preflight:

```bash
bash scripts/dev/preflight.sh
```

## VS Code setup

- Recommended extensions are defined in `.vscode/extensions.json`
- Workspace defaults are defined in `.vscode/settings.json`

## Dev Container setup

Open this folder in VS Code and run:

- **Dev Containers: Reopen in Container**

The container pins Node 20 and activates pnpm 9.15.5 automatically.

## Determinism guarantees

- Node version pinned by `.nvmrc`
- pnpm version pinned via corepack in bootstrap and devcontainer
- line endings and formatting normalized via `.editorconfig` and VS Code settings
- runtime-critical files blocked from stub markers via `scripts/health/no-stubs.sh`
- active environment is explicit through `.env.active` and validated by `scripts/dev/preflight.sh`

## Environment switching

See `docs/dev/ENVIRONMENT_STRATEGY.md` for switch rules and promotion flow.
