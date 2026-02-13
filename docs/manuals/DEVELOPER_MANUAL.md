# 👨‍💻 Developer Manual

**Top Shelf Service LLC Standards Repository**  
Version: 1.0  
Last Updated: 2026-02-13

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Git
- Text editor or IDE

### Initial Setup

1. **Enable Corepack** (one-time setup):
   ```bash
   corepack enable
   ```

2. **Clone the repository**:
   ```bash
   git clone https://github.com/top-shelf-service/standard.git
   cd standard
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Run health check**:
   ```bash
   pnpm doctor
   ```

## Development Workflow

### Before Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Ensure system is healthy:
   ```bash
   pnpm doctor
   ```

### Making Changes

#### Adding New Documentation

1. Create or edit Markdown files in appropriate directories
2. Follow existing formatting conventions
3. Run formatter:
   ```bash
   pnpm format
   ```

#### Adding New Entities (Future)

1. Create a new `.yaml` file in `core/entities/`
2. Follow the schema defined in `ai-agent/decision-tree-schema.json`
3. Run validation:
   ```bash
   pnpm build:packs
   ```

4. **Do not** manually edit files in `dist/`

### Code Quality

#### Linting

Check for code issues:
```bash
pnpm lint
```

Fix automatically where possible:
```bash
pnpm lint --fix
```

#### Formatting

Check formatting:
```bash
pnpm format:check
```

Auto-format all files:
```bash
pnpm format
```

#### Type Checking

Verify TypeScript types:
```bash
tsc --noEmit
```

### Testing

Run all tests:
```bash
pnpm test
```

Run tests in watch mode during development:
```bash
pnpm test:watch
```

### Complete Health Check

Before committing, always run:
```bash
pnpm doctor
```

This performs:
- ✅ Environment checks
- ✅ Linting
- ✅ Format verification
- ✅ Type checking
- ✅ Validation suite
- ✅ Build verification

## Common Tasks

### Adding a New Script

1. Create the script in `scripts/` directory
2. Add to `package.json` scripts section
3. Document in this manual

### Updating Dependencies

```bash
pnpm update
```

**Note**: Dependencies are pinned. Updates should be intentional and tested.

### Building Artifacts

```bash
pnpm build:index    # Build entity index
pnpm build:packs    # Build data packs
```

## Troubleshooting

### Error: "Invalid Package Manager"

**Cause**: You used `npm` or `yarn` instead of `pnpm`

**Fix**:
```bash
rm -rf node_modules package-lock.json yarn.lock
pnpm install
```

### Error: "TypeScript compilation failed"

**Cause**: Type errors in code

**Fix**: Run `tsc --noEmit` to see detailed error messages, then fix the issues

### Error: "Validation failed"

**Cause**: Schema or data integrity issues

**Fix**: Run `pnpm doctor` to see specific validation failures

### Error: "Prettier check failed"

**Cause**: Code formatting doesn't match standards

**Fix**:
```bash
pnpm format
```

### Error: "ESLint errors"

**Cause**: Code quality issues

**Fix**:
```bash
pnpm lint --fix
```

## Git Workflow

### Commit Messages

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add new decision tree validator"
git commit -m "docs: update technical manual"
git commit -m "fix: correct Node version check"
```

### Pull Requests

1. Ensure `pnpm doctor` passes
2. Push your branch
3. Create PR on GitHub
4. Wait for CI to pass
5. Request review

## CI/CD

### GitHub Actions

Every push and PR triggers:
1. Package manager verification
2. Dependency installation
3. `pnpm doctor` check
4. Test suite

**All checks must pass before merge.**

### Local CI Simulation

Before pushing, simulate CI locally:
```bash
pnpm doctor && pnpm test
```

## Best Practices

### DO

- ✅ Use `pnpm` exclusively
- ✅ Run `pnpm doctor` before committing
- ✅ Write descriptive commit messages
- ✅ Keep documentation up to date
- ✅ Follow existing code patterns
- ✅ Test your changes

### DON'T

- ❌ Use `npm` or `yarn`
- ❌ Commit without running `pnpm doctor`
- ❌ Manually edit `dist/` files
- ❌ Skip linting or formatting
- ❌ Commit `node_modules/`
- ❌ Force push to main

## Editor Setup

### VS Code

Recommended extensions:
- ESLint
- Prettier
- EditorConfig

Settings will be automatically picked up from:
- `.editorconfig`
- `eslint.config.mjs`
- `prettier.config.cjs`

### Other Editors

Configure your editor to respect:
- 2-space indentation
- LF line endings
- UTF-8 encoding
- Trim trailing whitespace

## Getting Help

1. Check this manual
2. Check Technical Manual
3. Run `pnpm doctor` for diagnostics
4. Check GitHub issues
5. Ask team members

## Contributing

See the main README.md for contribution guidelines.
