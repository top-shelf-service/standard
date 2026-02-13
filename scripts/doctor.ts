import { cwd } from "node:process";
import { buildPack } from "../engine/compiler/build-pack.js";
import { runAllValidations } from "../engine/validators/run-all.js";

export interface DoctorReport {
  ok: boolean;
  generatedAt: string;
  validationsOk: boolean;
  builtDocuments: number;
}

export function runDoctor(projectRoot = cwd()): DoctorReport {
  const validationSummary = runAllValidations(projectRoot);
  const packResult = buildPack(projectRoot);

  return {
    ok: validationSummary.ok,
    generatedAt: new Date().toISOString(),
    validationsOk: validationSummary.ok,
    builtDocuments: packResult.totalDocuments
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = runDoctor();
  console.log(`doctor_ok=${report.ok}`);
  console.log(`built_documents=${report.builtDocuments}`);
  if (!report.ok) {
    process.exitCode = 1;
  }
}
