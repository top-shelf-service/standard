#!/usr/bin/env node
/**
 * Preinstall check - runs before dependencies are installed
 * Must use plain JS (no ts-node) since dependencies aren't available yet
 */

const REQUIRED_PM = "pnpm";
const REQUIRED_PM_VERSION = "9.15.5";
const REQUIRED_NODE_MAJOR = 20;

function checkPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";

  if (!userAgent.startsWith(REQUIRED_PM)) {
    console.error(`\n[FATAL] Invalid Package Manager. You MUST use ${REQUIRED_PM}.`);
    console.error(`Current: ${userAgent || "unknown"}`);
    console.error(
      `Run: corepack enable && corepack prepare pnpm@${REQUIRED_PM_VERSION} --activate\n`,
    );
    process.exit(1);
  }

  // Check pnpm version
  const versionMatch = userAgent.match(/pnpm\/(\d+\.\d+\.\d+)/);
  if (versionMatch) {
    const detectedVersion = versionMatch[1];
    if (detectedVersion !== REQUIRED_PM_VERSION) {
      console.warn(`\n[WARNING] pnpm version mismatch.`);
      console.warn(`Expected: ${REQUIRED_PM_VERSION}`);
      console.warn(`Detected: ${detectedVersion}`);
      console.warn(`Run: corepack prepare pnpm@${REQUIRED_PM_VERSION} --activate\n`);
      // Don't exit - warn only for now
    }
  }
}

function checkNodeVersion() {
  const currentMajor = parseInt(process.versions.node.split(".")[0], 10);
  if (currentMajor < REQUIRED_NODE_MAJOR) {
    console.error(`\n[FATAL] Node.js version mismatch.`);
    console.error(`Required: >=${REQUIRED_NODE_MAJOR}`);
    console.error(`Current: ${process.version}\n`);
    process.exit(1);
  }
}

// Run checks
checkPackageManager();
checkNodeVersion();
