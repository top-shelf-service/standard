# Agent Matrix

| Agent                     | Primary Domain                    | Primary Paths                                                                    |
| ------------------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| `orchestrator-controller` | orchestration                     | cross-cutting                                                                    |
| `environment-guardian`    | environment/preflight             | `scripts/dev/**`, `scripts/agents/environment/**`                                |
| `ci-guardian`             | CI pipeline integrity             | `.github/workflows/**`, `scripts/doctor.ts`, `scripts/health/**`, `package.json` |
| `pr-reviewer`             | PR review and merge readiness     | pull request diff, changed files, validation evidence                            |
| `dependency-governor`     | dependency governance             | `package.json`, `pnpm-lock.yaml`, `.npmrc`                                       |
| `security-supply-chain`   | security and supply-chain posture | `.github/workflows/**`, `scripts/**`, dependency/update surfaces                 |
| `release-gate`            | validation/release                | `.github/workflows/**`, `tests/**`, `scripts/**`                                 |
| `governance-architect`    | governance standards              | `governance/**`                                                                  |
| `legal-compliance`        | legal and compliance              | `legal/**`                                                                       |
| `design-system-curator`   | design system and brand           | `design-system/**`, `brand/**`                                                   |
| `decision-tree-steward`   | AI decision trees                 | `ai-agent/**`, `docs/decision-trees/**`                                          |
| `docs-steward`            | repository documentation          | `README.md`, `docs/manuals/**`                                                   |

## Routing Rules

1. Route cross-domain changes through `orchestrator-controller`.
2. Run `environment-guardian` preflight before operational commands.
3. Require `ci-guardian` checks for workflow or validation-script changes.
4. Require `pr-reviewer` output before merge recommendation.
5. Use `release-gate` as final release checkpoint when preparing promotion.
6. For CI, dependency, or security updates, include official external docs/changelog links with checked date.
