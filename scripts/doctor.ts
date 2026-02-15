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
    const { existsSync } = require("fs");
    if (existsSync("engine/validators/run-all.ts")) {
      execSync("ts-node engine/validators/run-all.ts", { stdio: "inherit" });
    } else {
      console.log("ℹ️  No validators found yet (optional)");
    }
  } catch (error: any) {
    // Only catch module not found errors
    if (error.code === "ENOENT" || error.message?.includes("Cannot find module")) {
      console.log("ℹ️  No validators found yet (optional)");
    } else {
      // Re-throw actual validation failures
      throw error;
    }
  }

  // 5. Build Index
  console.log("📊 Building entity index...");
  execSync("pnpm build:index", { stdio: "inherit" });

  // 6. Build Packs
  console.log("📦 Building packs...");
  try {
    const { existsSync } = require("fs");
    if (existsSync("engine/compiler/build-pack.ts")) {
      execSync("pnpm build:packs", { stdio: "inherit" });
    } else {
      console.log("ℹ️  Pack builder not yet implemented (optional)");
    }
  } catch (error: any) {
    if (error.code === "ENOENT" || error.message?.includes("Cannot find module")) {
      console.log("ℹ️  Pack builder not yet implemented (optional)");
    } else {
      throw error;
    }
  }

  console.log("\n✨ All Systems Operational. Ready to merge.");
} catch {
  console.error("\n❌ Doctor found issues. See output above.");
  process.exit(1);
}
