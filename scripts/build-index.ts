import { cwd } from "node:process";
import { basename, extname, join } from "node:path";
import {
  directoryExists,
  getCurrentTimestamp,
  listFilesRecursive,
  readTextFile,
  toPosixRelativePath,
  writeJsonFile
} from "./lib/fs-utils.js";

export interface IndexRecord {
  id: string;
  path: string;
  title: string;
  bytes: number;
  content?: string;
}

export interface BuildIndexResult {
  generatedAt: string;
  root: string;
  records: IndexRecord[];
}

const DOC_EXTENSIONS = [".md", ".mdx", ".txt", ".json", ".yaml", ".yml"];
const INDEX_CANDIDATE_DIRS = ["docs", "governance", "legal", "brand", "design-system"];

function deriveTitle(path: string, content: string): string {
  const lines = content.split(/\r?\n/);
  const firstMarkdownHeading = lines.find((line) => line.trim().startsWith("#"));
  if (firstMarkdownHeading) {
    return firstMarkdownHeading.replace(/^#+\s*/, "").trim();
  }
  return basename(path, extname(path));
}

export function buildIndex(projectRoot = cwd(), includeContent = false): BuildIndexResult {
  const sourceFiles = INDEX_CANDIDATE_DIRS
    .map((directory) => join(projectRoot, directory))
    .filter((directory) => directoryExists(directory))
    .flatMap((directory) => listFilesRecursive(directory, DOC_EXTENSIONS))
    .sort((a, b) => a.localeCompare(b));

  const records = sourceFiles.map((absolutePath) => {
    const content = readTextFile(absolutePath);
    const path = toPosixRelativePath(projectRoot, absolutePath);

    const record: IndexRecord = {
      id: path,
      path,
      title: deriveTitle(path, content),
      bytes: Buffer.byteLength(content, "utf8")
    };

    if (includeContent) {
      record.content = content;
    }

    return record;
  });

  const result: BuildIndexResult = {
    generatedAt: getCurrentTimestamp(),
    root: projectRoot,
    records
  };

  writeJsonFile(join(projectRoot, "dist", "index.json"), result);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = buildIndex();
  console.log(`index_records=${result.records.length}`);
  console.log("dist/index.json written");
}
