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

export function directoryExists(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

export function fileExists(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}
