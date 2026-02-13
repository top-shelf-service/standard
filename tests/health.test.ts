/**
 * Basic health tests for the standards repository
 */

import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join } from "path";

describe("Repository Structure", () => {
  it("should have required configuration files", () => {
    expect(existsSync("package.json")).toBe(true);
    expect(existsSync(".npmrc")).toBe(true);
    expect(existsSync(".editorconfig")).toBe(true);
    expect(existsSync("tsconfig.json")).toBe(true);
    expect(existsSync("eslint.config.mjs")).toBe(true);
    expect(existsSync("prettier.config.cjs")).toBe(true);
  });

  it("should have required documentation", () => {
    expect(existsSync("docs/manuals/TECHNICAL_MANUAL.md")).toBe(true);
    expect(existsSync("docs/manuals/DEVELOPER_MANUAL.md")).toBe(true);
    expect(existsSync("docs/manuals/USER_MANUAL.md")).toBe(true);
  });

  it("should have required scripts", () => {
    expect(existsSync("scripts/doctor.ts")).toBe(true);
    expect(existsSync("scripts/health/checks.ts")).toBe(true);
    expect(existsSync("scripts/build-index.ts")).toBe(true);
  });
});

describe("Package Configuration", () => {
  it("should enforce pnpm as package manager", () => {
    const pkg = require("../package.json");
    expect(pkg.packageManager).toBe("pnpm@9.15.5");
  });

  it("should be marked as private", () => {
    const pkg = require("../package.json");
    expect(pkg.private).toBe(true);
  });

  it("should have correct Node version requirement", () => {
    const pkg = require("../package.json");
    expect(pkg.engines.node).toBe(">=20.0.0");
  });
});
