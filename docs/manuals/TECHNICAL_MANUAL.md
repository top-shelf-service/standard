# 🛠 Technical Manual

**Top Shelf Service LLC Standards Repository**  
Version: 1.0  
Last Updated: 2026-02-13

## Architecture Principles

1. **Single Source of Truth**: The YAML files in `core/` are canonical. Excel is for import only.
2. **Deterministic Build**: `pnpm` is the only allowed package manager.
3. **No Publish**: This repo produces artifacts (JSON/SQLite), not npm packages.

## Data Flow

```
Excel (Optional) → YAML (Canonical) → Compiler → dist/*.json
```

## Doctor Protocol

Run `pnpm doctor` to validate:
- Schema compliance
- Broken references
- Environmental health (pnpm, Node version)
- Type safety
- Linting & formatting

## Entity Lifecycle

1. Author YAML in `core/entities/`
2. Run `pnpm build:packs` to validate
3. Never edit `dist/` manually — it's auto-generated

## System Requirements

- **Node.js**: >= 20.0.0
- **Package Manager**: pnpm 9.15.5 (enforced)
- **Operating System**: Linux, macOS, Windows

## Build Process

### 1. Environment Setup

```bash
corepack enable
corepack prepare pnpm@9.15.5 --activate
```

### 2. Installation

```bash
pnpm install
```

The preinstall hook will automatically verify:
- Package manager is pnpm
- Node.js version meets requirements

### 3. Validation

```bash
pnpm doctor
```

This runs a comprehensive health check including:
- Environment validation
- Code linting
- Type checking
- Format verification
- Schema validation
- Index building

## Directory Structure

```
standard/
├── .github/          # CI/CD workflows
├── ai-agent/         # AI agent decision trees
├── brand/            # Design system and UI assets
├── core/             # Canonical YAML data (future)
├── design-system/    # CSS variables and design tokens
├── dist/             # Auto-generated artifacts (future)
├── docs/             # Documentation
│   ├── manuals/      # User, Developer, Technical manuals
│   └── decision-trees/ # Workflow diagrams
├── engine/           # Build and validation tools
│   ├── compiler/     # YAML to JSON compiler
│   └── validators/   # Schema validators
├── governance/       # Governance policies
├── legal/            # Legal and compliance docs
└── scripts/          # Utility scripts
    ├── health/       # Health check scripts
    ├── doctor.ts     # Self-healing protocol
    ├── build-index.ts # Index generator
    └── retrieval-server.ts # RAG server
```

## Artifacts

All build artifacts are generated in the `dist/` directory:

- `dist/*.json` - Compiled JSON data packs
- `dist/*.db` - SQLite databases for RAG systems
- `dist/index.json` - Master entity index

**Important**: Never manually edit files in `dist/`. They are auto-generated.

## Integration

Applications should consume artifacts from the `dist/` folder, not from the source YAML files.

## Troubleshooting

### Issue: Package Manager Error

**Symptom**: "Invalid Package Manager" error during install

**Solution**:
```bash
corepack enable
corepack prepare pnpm@9.15.5 --activate
rm -rf node_modules
pnpm install
```

### Issue: Node Version Mismatch

**Symptom**: "Node.js version mismatch" error

**Solution**: Upgrade Node.js to version 20 or higher

### Issue: Build Failures

**Symptom**: Build scripts fail

**Solution**: Run `pnpm doctor` to diagnose issues

## Security

This repository contains proprietary information. All data is:
- Private (not published to npm)
- Version controlled
- Access controlled via GitHub permissions

## Support

For technical issues, consult:
1. This manual
2. Developer Manual
3. Repository issues on GitHub
