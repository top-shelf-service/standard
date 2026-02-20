// engine/mesh/capability-map.ts
import { existsSync } from 'fs';
import { resolve } from 'path';
import type { CapabilityBinding, ExecutionPersona } from './types.js';

export class CapabilityMap {
  private bindings: Map<string, CapabilityBinding> = new Map();
  private dependencyGraph: Map<string, string[]> = new Map();

  /**
   * Bind all capabilities from a persona to the map.
   * Validates handler files exist.
   */
  bindPersona(
    persona: ExecutionPersona,
    engineRoot: string
  ): { bound: string[]; errors: string[] } {
    const bound: string[] = [];
    const errors: string[] = [];

    for (const cap of persona.execution.capabilities) {
      // Check for duplicate capability ID across all personas
      if (this.bindings.has(cap.id)) {
        const existing = this.bindings.get(cap.id)!;
        errors.push(
          `MESH: Capability ${cap.id} already bound to ${existing.persona_id}. ` +
          `Cannot rebind to ${persona.id}.`
        );
        continue;
      }

      // Verify handler file exists
      const handlerPath = resolve(engineRoot, cap.handler);
      if (!existsSync(handlerPath)) {
        errors.push(
          `MESH: Handler not found for ${cap.id}: ${cap.handler} ` +
          `(resolved: ${handlerPath})`
        );
        continue;
      }

      // Register binding
      const binding: CapabilityBinding = {
        capability_id: cap.id,
        persona_id: persona.id,
        handler_path: cap.handler,
        timeout_ms: cap.timeout_ms,
        depends_on: cap.depends_on,
      };

      this.bindings.set(cap.id, binding);
      this.dependencyGraph.set(cap.id, cap.depends_on);
      bound.push(cap.id);
    }

    return { bound, errors };
  }

  /**
   * Validate dependency graph — no circular dependencies.
   */
  validateDependencies(): { valid: boolean; cycles: string[][] } {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (node: string, path: string[]): boolean => {
      if (stack.has(node)) {
        const cycleStart = path.indexOf(node);
        cycles.push(path.slice(cycleStart));
        return true;
      }
      if (visited.has(node)) return false;

      visited.add(node);
      stack.add(node);

      const deps = this.dependencyGraph.get(node) ?? [];
      for (const dep of deps) {
        if (!this.bindings.has(dep)) {
          // Dependency references capability that doesn't exist
          cycles.push([node, `MISSING:${dep}`]);
          continue;
        }
        if (dfs(dep, [...path, node])) return true;
      }

      stack.delete(node);
      return false;
    };

    for (const capId of this.bindings.keys()) {
      if (!visited.has(capId)) {
        dfs(capId, []);
      }
    }

    return { valid: cycles.length === 0, cycles };
  }

  /**
   * Get execution order respecting dependencies (topological sort).
   */
  getExecutionOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();

    const visit = (capId: string) => {
      if (visited.has(capId)) return;
      visited.add(capId);

      const deps = this.dependencyGraph.get(capId) ?? [];
      for (const dep of deps) {
        if (this.bindings.has(dep)) {
          visit(dep);
        }
      }
      order.push(capId);
    };

    for (const capId of this.bindings.keys()) {
      visit(capId);
    }

    return order;
  }

  /**
   * Get binding for a capability.
   */
  get(capabilityId: string): CapabilityBinding | undefined {
    return this.bindings.get(capabilityId);
  }

  /**
   * Get all bindings.
   */
  getAll(): CapabilityBinding[] {
    return Array.from(this.bindings.values());
  }

  /**
   * Check if capability exists.
   */
  has(capabilityId: string): boolean {
    return this.bindings.has(capabilityId);
  }

  get size(): number {
    return this.bindings.size;
  }
}
