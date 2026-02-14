import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";

export function ensureDirectory(path: string): void {
  mkdirSync(path, { recursive: true });
}

export function writeJsonFile(path: string, value: unknown): void {
  ensureDirectory(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function readTextFile(path: string): string {
  return readFileSync(path, "utf8");
}

export function listFilesRecursive(root: string, allowedExtensions?: string[]): string[] {
  const collected: string[] = [];

  function walk(currentPath: string): void {
    const entries = readdirSync(currentPath, { withFileTypes: true })
      .filter((entry) => !entry.name.startsWith("."))
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (allowedExtensions && allowedExtensions.length > 0) {
        const extension = extname(entry.name).toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          continue;
        }
      }

      collected.push(fullPath);
    }
  }

  walk(root);
  return collected;
}

export function toPosixRelativePath(root: string, absolutePath: string): string {
  return relative(root, absolutePath).split("\\").join("/");
}

export type PathType = "file" | "directory" | "none";

export function pathExists(path: string, type?: "file" | "directory"): boolean {
  try {
    const stats = statSync(path);
    if (type === "file") {
      return stats.isFile();
    }
    if (type === "directory") {
      return stats.isDirectory();
    }
    return true;
  } catch {
    return false;
  }
}

export function directoryExists(path: string): boolean {
  return pathExists(path, "directory");
}

export function fileExists(path: string): boolean {
  return pathExists(path, "file");
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
