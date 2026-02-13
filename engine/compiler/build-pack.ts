import { cwd } from "node:process";
import { join } from "node:path";
import { buildIndex } from "../../scripts/build-index.js";
import { readTextFile, writeJsonFile } from "../../scripts/lib/fs-utils.js";

export interface RetrievalDocument {
  id: string;
  path: string;
  title: string;
  content: string;
}

export interface BuildPackResult {
  generatedAt: string;
  totalDocuments: number;
  outputPath: string;
}

export function buildPack(projectRoot = cwd()): BuildPackResult {
  const index = buildIndex(projectRoot);
  const documents: RetrievalDocument[] = index.records.map((record) => {
    const absolutePath = join(projectRoot, record.path);
    return {
      id: record.id,
      path: record.path,
      title: record.title,
      content: readTextFile(absolutePath)
    };
  });

  const outputPath = join(projectRoot, "dist", "retrieval-pack.json");
  writeJsonFile(outputPath, {
    generatedAt: new Date().toISOString(),
    totalDocuments: documents.length,
    documents
  });

  return {
    generatedAt: new Date().toISOString(),
    totalDocuments: documents.length,
    outputPath
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = buildPack();
  console.log(`total_documents=${result.totalDocuments}`);
  console.log(`output=${result.outputPath}`);
}
