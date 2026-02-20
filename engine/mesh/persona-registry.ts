// engine/mesh/persona-registry.ts
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { parse } from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { ExecutionPersona, MeshNode } from './types.js';

export class PersonaRegistry {
  private nodes: Map<string, MeshNode> = new Map();
  private ajv: Ajv;
  private schema: object | null = null;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
  }

  /**
   * Load execution persona schema for validation.
   * This runs WITHOUT the mesh — raw schema check only (LOOP-04 guard).
   */
  loadSchema(schemaPath: string): void {
    if (!existsSync(schemaPath)) {
      throw new Error(
        `MESH FATAL: Execution persona schema not found at ${schemaPath}`
      );
    }
    const raw = readFileSync(schemaPath, 'utf-8');
    this.schema = JSON.parse(raw);
  }

  /**
   * Load all *.exec.persona.yaml from a directory.
   * Validates each against schema BEFORE registration.
   */
  loadPersonas(directory: string): {
    loaded: ExecutionPersona[];
    errors: Array<{ file: string; errors: string[] }>;
  } {
    if (!this.schema) {
      throw new Error('MESH FATAL: Schema not loaded. Call loadSchema() first.');
    }

    if (!existsSync(directory)) {
      throw new Error(
        `MESH FATAL: Execution personas directory not found: ${directory}`
      );
    }

    const files = readdirSync(directory).filter(
      (f) => f.endsWith('.exec.persona.yaml') || f.endsWith('.exec.persona.yml')
    );

    if (files.length === 0) {
      throw new Error(
        `MESH FATAL: No *.exec.persona.yaml files found in ${directory}`
      );
    }

    const validate = this.ajv.compile(this.schema);
    const loaded: ExecutionPersona[] = [];
    const errors: Array<{ file: string; errors: string[] }> = [];

    for (const file of files) {
      const filePath = join(directory, file);
      try {
        const raw = readFileSync(filePath, 'utf-8');
        const data = parse(raw) as ExecutionPersona;

        if (!validate(data)) {
          const fileErrors = (validate.errors ?? []).map(
            (e) => `${e.instancePath || '/'}: ${e.message}`
          );
          errors.push({ file, errors: fileErrors });
          continue;
        }

        loaded.push(data);
      } catch (e) {
        errors.push({
          file,
          errors: [e instanceof Error ? e.message : 'Unknown parse error'],
        });
      }
    }

    return { loaded, errors };
  }

  /**
   * Register a validated persona as a mesh node.
   */
  register(persona: ExecutionPersona): MeshNode {
    if (this.nodes.has(persona.id)) {
      throw new Error(
        `MESH: Duplicate persona registration attempt: ${persona.id}`
      );
    }

    const node: MeshNode = {
      persona,
      status: 'registered',
      registered_at: Date.now(),
    };

    this.nodes.set(persona.id, node);
    return node;
  }

  /**
   * Mark a node as ready (handler verified).
   */
  markReady(personaId: string): void {
    const node = this.nodes.get(personaId);
    if (!node) {
      throw new Error(`MESH: Cannot mark unknown persona as ready: ${personaId}`);
    }
    node.status = 'ready';
  }

  /**
   * Mark a node as failed with error.
   */
  markFailed(personaId: string, error: string): void {
    const node = this.nodes.get(personaId);
    if (!node) return;
    node.status = 'failed';
    node.error = error;
  }

  /**
   * Get all registered nodes.
   */
  getAll(): MeshNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get nodes sorted by mesh_priority (0 = first).
   */
  getByPriority(): MeshNode[] {
    return this.getAll().sort(
      (a, b) => a.persona.execution.mesh_priority - b.persona.execution.mesh_priority
    );
  }

  /**
   * Get all boot-blocker nodes.
   */
  getBootBlockers(): MeshNode[] {
    return this.getAll().filter((n) => n.persona.execution.boot_blocker);
  }

  /**
   * Get node by ID.
   */
  get(personaId: string): MeshNode | undefined {
    return this.nodes.get(personaId);
  }

  /**
   * Check if registry is empty (LOOP-05 guard).
   */
  isEmpty(): boolean {
    return this.nodes.size === 0;
  }

  /**
   * Get count of registered personas.
   */
  get size(): number {
    return this.nodes.size;
  }
}
