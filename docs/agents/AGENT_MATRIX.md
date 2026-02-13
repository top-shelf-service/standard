# Agent Matrix

| Agent | Trigger | Owner Script | Primary Actions | Escalation |
| --- | --- | --- | --- | --- |
| Environment Guardian | intent command, watcher signal | `scripts/agents/environment/agent-env-ops.sh` | env select/switch, preflight, no-stub gate | to Orchestrator Controller |
| Orchestrator Controller | explicit orchestration request | `scripts/agents/orchestrator/orchestrator.sh` | env-sync, activate-test, diagnose-health, triage-fix | fail-closed + manual intervention |
| Health Triage | health failure | `scripts/agents/orchestrator/orchestrator.sh triage-fix` | deterministic fix attempt + retry once | escalate if retry exhausted |
| Release Gate | release operation | `scripts/agents/environment/solo-release.sh` + orchestrator | local/stage preflight + health checks | block release |

## Retrieval Notes

- Policy source: `AGENTS.md`
- Skills source: `.github/skills/`
- Contracts source: `ai-agent/`
- Script index: `scripts/agents/INDEX.md`
