import { cwd } from "node:process";
import { join } from "node:path";
import { buildIndex } from "../../scripts/build-index.js";
import { runHealthChecks } from "../../scripts/health/checks.js";
import { getCurrentTimestamp, writeJsonFile } from "../../scripts/lib/fs-utils.js";

export interface ValidationSummary {
  ok: boolean;
  generatedAt: string;
  checks: {
    health: { ok: boolean; issues: number };
    index: { records: number };
  };
}

export function runAllValidations(projectRoot = cwd()): ValidationSummary {
  const health = runHealthChecks(projectRoot);
  const index = buildIndex(projectRoot);

  const summary: ValidationSummary = {
    ok: health.ok,
    generatedAt: getCurrentTimestamp(),
    checks: {
      health: { ok: health.ok, issues: health.issues.length },
      index: { records: index.records.length }
    }
  };

  writeJsonFile(join(projectRoot, "dist", "validation-summary.json"), summary);
  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = runAllValidations();
  console.log(`validation_ok=${summary.ok}`);
  console.log(`health_issues=${summary.checks.health.issues}`);
  console.log(`index_records=${summary.checks.index.records}`);
  if (!summary.ok) {
    process.exitCode = 1;
  }
}
