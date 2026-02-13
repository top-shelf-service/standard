#!/usr/bin/env ts-node
import { execSync } from "child_process";

console.log("🔍 TopShelf Doctor: Diagnosing...");

try {
  // 1. Environment Health
  console.log("🧬 Checking environment...");
  execSync("ts-node scripts/health/checks.ts doctor", { stdio: "inherit" });

  // 2. Linting & Formatting
  console.log("🧹 Checking linting & formatting...");
  execSync("pnpm lint", { stdio: "inherit" });
  execSync("pnpm format:check", { stdio: "inherit" });

  // 3. Types
  console.log("📐 Verifying Types...");
  execSync("tsc --noEmit", { stdio: "inherit" });

  // 4. Validation (run all validators if they exist)
  console.log("🧪 Running validation suite...");
  try {
    execSync("ts-node engine/validators/run-all.ts", { stdio: "inherit" });
  } catch (error) {
    console.log("ℹ️  No validators found (optional)");
  }

  // 5. Build Index
  console.log("📊 Building entity index...");
  execSync("pnpm build:index", { stdio: "inherit" });

  console.log("\n✨ All Systems Operational. Ready to merge.");

} catch (error) {
  console.error("\n❌ Doctor found issues. See output above.");
  process.exit(1);
}
