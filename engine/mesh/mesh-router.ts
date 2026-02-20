// engine/mesh/mesh-router.ts
import type {
  MeshInvocationResult,
  CapabilityBinding,
} from './types.js';
import type { PersonaRegistry } from './persona-registry.js';
import type { CapabilityMap } from './capability-map.js';

export class MeshRouter {
  constructor(
    private registry: PersonaRegistry,
    private capabilities: CapabilityMap
  ) {}

  /**
   * Invoke a capability through the mesh.
   * Replaces all direct calls to validators/compilers.
   */
  async invoke(capabilityId: string, context?: unknown): Promise<MeshInvocationResult> {
    const binding = this.capabilities.get(capabilityId);
    if (!binding) {
      return {
        capability_id: capabilityId,
        persona_id: 'unknown',
        success: false,
        duration_ms: 0,
        output: null,
        error: `MESH ROUTE FAIL: Capability not found: ${capabilityId}`,
      };
    }

    // Verify persona is ready
    const node = this.registry.get(binding.persona_id);
    if (!node || node.status !== 'ready') {
      return {
        capability_id: capabilityId,
        persona_id: binding.persona_id,
        success: false,
        duration_ms: 0,
        output: null,
        error: `MESH ROUTE FAIL: Persona ${binding.persona_id} status: ${node?.status ?? 'missing'}`,
      };
    }

    // Check dependencies are satisfied
    for (const dep of binding.depends_on) {
      if (!this.capabilities.has(dep)) {
        return {
          capability_id: capabilityId,
          persona_id: binding.persona_id,
          success: false,
          duration_ms: 0,
          output: null,
          error: `MESH ROUTE FAIL: Dependency not met: ${dep}`,
        };
      }
    }

    // Execute with timeout
    const start = Date.now();
    try {
      const handler = await this.loadHandler(binding.handler_path);
      const result = await this.executeWithTimeout(
        handler,
        context,
        binding.timeout_ms
      );

      node.last_invoked = Date.now();

      return {
        capability_id: capabilityId,
        persona_id: binding.persona_id,
        success: true,
        duration_ms: Date.now() - start,
        output: result,
      };
    } catch (error) {
      const duration = Date.now() - start;
      const message = error instanceof Error ? error.message : 'Unknown error';

      // Retry logic
      const cap = node.persona.execution.capabilities.find(
        (c) => c.id === capabilityId
      );
      if (cap && cap.retry.max_attempts > 0) {
        return this.invokeWithRetry(capabilityId, context, cap.retry.max_attempts, cap.retry.backoff_ms);
      }

      return {
        capability_id: capabilityId,
        persona_id: binding.persona_id,
        success: false,
        duration_ms: duration,
        output: null,
        error: `MESH EXEC FAIL: ${message}`,
      };
    }
  }

  /**
   * Invoke all capabilities in dependency-resolved order.
   */
  async invokeAll(context?: unknown): Promise<MeshInvocationResult[]> {
    const order = this.capabilities.getExecutionOrder();
    const results: MeshInvocationResult[] = [];

    for (const capId of order) {
      const result = await this.invoke(capId, context);
      results.push(result);

      // Stop on first boot-blocker failure
      if (!result.success) {
        const binding = this.capabilities.get(capId);
        if (binding) {
          const node = this.registry.get(binding.persona_id);
          if (node?.persona.execution.boot_blocker) {
            results.push({
              capability_id: 'mesh.boot',
              persona_id: 'mesh',
              success: false,
              duration_ms: 0,
              output: null,
              error: `MESH BOOT HALTED: Boot blocker ${capId} failed`,
            });
            break;
          }
        }
      }
    }

    return results;
  }

  private async loadHandler(handlerPath: string): Promise<(ctx?: unknown) => Promise<unknown>> {
    // Dynamic import of handler module
    const module = await import(`../../${handlerPath}`);
    if (typeof module.default === 'function') return module.default;
    if (typeof module.run === 'function') return module.run;
    if (typeof module.execute === 'function') return module.execute;
    throw new Error(`Handler has no default/run/execute export: ${handlerPath}`);
  }

  private async executeWithTimeout(
    handler: (ctx?: unknown) => Promise<unknown>,
    context: unknown,
    timeoutMs: number
  ): Promise<unknown> {
    return Promise.race([
      handler(context),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  }

  private async invokeWithRetry(
    capabilityId: string,
    context: unknown,
    maxAttempts: number,
    backoffMs: number
  ): Promise<MeshInvocationResult> {
    let lastError = '';
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, backoffMs * attempt));
      const result = await this.invoke(capabilityId, context);
      if (result.success) return result;
      lastError = result.error ?? 'Unknown';
    }
    return {
      capability_id: capabilityId,
      persona_id: 'retry-exhausted',
      success: false,
      duration_ms: 0,
      output: null,
      error: `MESH RETRY EXHAUSTED after ${maxAttempts} attempts: ${lastError}`,
    };
  }
}
