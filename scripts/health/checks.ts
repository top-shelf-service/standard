import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { fileExists, getCurrentTimestamp, readTextFile, writeJsonFile } from "../lib/fs-utils.js";

export interface CheckIssue {
  code: string;
  message: string;
}

export interface CheckResult {
  ok: boolean;
  generatedAt: string;
  issues: CheckIssue[];
}

const REQUIRED_FILES = [
  "package.json",
  ".npmrc",
  ".editorconfig",
  "tsconfig.json",
  "eslint.config.mjs",
  "prettier.config.cjs",
  "engine/validators/run-all.ts",
  "engine/compiler/build-pack.ts",
  "scripts/retrieval-server.ts",
  "scripts/build-index.ts",
  "scripts/doctor.ts"
];

const REQUIRED_ENV_KEYS = ["NODE_ENV", "TOPSHELF_ENV", "API_BASE_URL", "LOG_LEVEL"];

function addIssue(issues: CheckIssue[], code: string, message: string): void {
  issues.push({ code, message });
}

function validateNodeVersion(issues: CheckIssue[]): void {
  const majorVersion = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
  if (majorVersion < 20) {
    addIssue(
      issues,
      "node-version",
      `Node ${process.versions.node} detected. Required: >=20.0.0`
    );
  }
}

function validateRequiredFiles(projectRoot: string, issues: CheckIssue[]): void {
  for (const relativePath of REQUIRED_FILES) {
    if (!fileExists(join(projectRoot, relativePath))) {
      addIssue(issues, "missing-file", `Required file not found: ${relativePath}`);
    }
  }
}

function validateEnvironmentFile(projectRoot: string, issues: CheckIssue[]): void {
  const activeEnvPath = join(projectRoot, ".env.active");
  if (!fileExists(activeEnvPath)) {
    addIssue(issues, "missing-env-active", "Missing .env.active");
    return;
  }

  const envContent = readTextFile(activeEnvPath);
  for (const key of REQUIRED_ENV_KEYS) {
    const hasEnvKey = new RegExp(`^${key}=`, "m").test(envContent);
    if (!hasEnvKey) {
      addIssue(issues, "env-key-missing", `Missing required key in .env.active: ${key}`);
    }
  }
}

function validatePackageManager(projectRoot: string, issues: CheckIssue[]): void {
  const packageJsonPath = join(projectRoot, "package.json");
  if (!fileExists(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      packageManager?: string;
      private?: boolean;
      engines?: { node?: string };
    };

    if (packageJson.packageManager !== "pnpm@9.15.5") {
      addIssue(issues, "package-manager", "packageManager must be pnpm@9.15.5");
    }

    if (packageJson.private !== true) {
      addIssue(issues, "package-private", "package.json must set private=true");
    }

    if (packageJson.engines?.node !== ">=20.0.0") {
      addIssue(issues, "engines-node", "package.json engines.node must be >=20.0.0");
    }
  } catch (error) {
    addIssue(
      issues,
      "invalid-package-json",
      `Failed to parse package.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export function runHealthChecks(projectRoot = cwd()): CheckResult {
  const issues: CheckIssue[] = [];

  validateNodeVersion(issues);
  validateRequiredFiles(projectRoot, issues);
  validateEnvironmentFile(projectRoot, issues);
  validatePackageManager(projectRoot, issues);

  const result: CheckResult = {
    ok: issues.length === 0,
    generatedAt: getCurrentTimestamp(),
    issues
  };

  writeJsonFile(join(projectRoot, "dist", "health-report.json"), result);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runHealthChecks();
  console.log(`health_ok=${result.ok}`);
  console.log(`issues=${result.issues.length}`);
  if (!result.ok) {
    for (const issue of result.issues) {
      console.error(`${issue.code}: ${issue.message}`);
    }
    process.exitCode = 1;
  }
}
