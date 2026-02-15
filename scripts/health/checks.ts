#!/usr/bin/env ts-node
import { exit } from "process";

const REQUIRED_PM = "pnpm";
const REQUIRED_NODE_MAJOR = 20;

function checkPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (!userAgent.startsWith(REQUIRED_PM)) {
    console.error(`\n[FATAL] Invalid Package Manager. You MUST use ${REQUIRED_PM}.`);
    console.error(`Current: ${userAgent || "unknown"}`);
    console.error(`Run: corepack enable && corepack prepare pnpm@9.15.5 --activate\n`);
    exit(1);
  }
}

function checkNodeVersion() {
  const currentMajor = parseInt(process.versions.node.split(".")[0], 10);
  if (currentMajor < REQUIRED_NODE_MAJOR) {
    console.error(
      `\n[FATAL] Node.js version mismatch. Required: >=${REQUIRED_NODE_MAJOR}. Current: ${process.version}\n`,
    );
    exit(1);
  }
}

const mode = process.argv[2];

if (mode === "preinstall") {
  checkPackageManager();
  checkNodeVersion();
} else {
  console.log("🩺 Running Health Checks...");
  checkPackageManager();
  checkNodeVersion();
  console.log("✅ System Healthy");
}
