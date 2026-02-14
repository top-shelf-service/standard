import { cwd } from "node:process";
import { join } from "node:path";
import { buildIndex } from "../../scripts/build-index.js";
import { getCurrentTimestamp, writeJsonFile } from "../../scripts/lib/fs-utils.js";

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
  const index = buildIndex(projectRoot, true);
  const documents: RetrievalDocument[] = index.records.map((record) => {
    if (!record.content) {
      throw new Error(
        `Expected content for record ${record.id}. Ensure buildIndex is called with includeContent=true.`
      );
    }
    return {
      id: record.id,
      path: record.path,
      title: record.title,
      content: record.content
    };
  });

  const outputPath = join(projectRoot, "dist", "retrieval-pack.json");
  writeJsonFile(outputPath, {
    generatedAt: getCurrentTimestamp(),
    totalDocuments: documents.length,
    documents
  });

  return {
    generatedAt: getCurrentTimestamp(),
    totalDocuments: documents.length,
    outputPath
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = buildPack();
  console.log(`total_documents=${result.totalDocuments}`);
  console.log(`output=${result.outputPath}`);
}
