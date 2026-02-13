import { createServer } from "node:http";
import { cwd } from "node:process";
import { join } from "node:path";
import { fileExists, readTextFile } from "./lib/fs-utils.js";
import { buildPack } from "../engine/compiler/build-pack.js";

interface RetrievalIndex {
  generatedAt: string;
  records: Array<{ id: string; path: string; title: string; bytes: number }>;
}

function getPort(): number {
  const raw = process.env.RETRIEVAL_PORT ?? "4040";
  const port = Number.parseInt(raw, 10);
  return Number.isFinite(port) && port > 0 ? port : 4040;
}

function sendJson(response: import("node:http").ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(`${JSON.stringify(body)}\n`);
}

export function startRetrievalServer(projectRoot = cwd()): void {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (url.pathname === "/health") {
      return sendJson(response, 200, { status: "ok" });
    }

    if (url.pathname === "/pack/rebuild" && request.method === "POST") {
      const result = buildPack(projectRoot);
      return sendJson(response, 200, {
        status: "rebuilt",
        documents: result.totalDocuments,
        generatedAt: result.generatedAt
      });
    }

    if (url.pathname === "/index") {
      const indexPath = join(projectRoot, "dist", "index.json");
      if (!fileExists(indexPath)) {
        buildPack(projectRoot);
      }
      const index = JSON.parse(readTextFile(indexPath)) as RetrievalIndex;
      return sendJson(response, 200, index);
    }

    if (url.pathname === "/document") {
      const requestedPath = url.searchParams.get("path");
      if (!requestedPath) {
        return sendJson(response, 400, { error: "Query param 'path' is required" });
      }

      const normalized = requestedPath.replace(/^\/+/, "");
      const absolutePath = join(projectRoot, normalized);
      if (!fileExists(absolutePath)) {
        return sendJson(response, 404, { error: "Document not found" });
      }

      const content = readTextFile(absolutePath);
      return sendJson(response, 200, {
        path: normalized,
        bytes: Buffer.byteLength(content, "utf8"),
        content
      });
    }

    return sendJson(response, 404, { error: "Not found" });
  });

  const port = getPort();
  server.listen(port, () => {
    console.log(`retrieval_server_port=${port}`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startRetrievalServer();
}
