// engine/mesh/boot.ts
/**
 * Mesh boot process for TSSAS runtime execution layer.
 *
 * Initializes the runtime mesh in 7 phases:
 * 1. Load and validate schema (no mesh dependency - LOOP-04 guard)
 * 2. Load execution personas from YAML files
 * 3. Register personas into mesh registry
 * 4. Verify registry not empty (LOOP-05 guard)
 * 5. Bind capabilities to their handler modules
 * 6. Validate dependency graph for circular dependencies
 * 7. Check boot-blocker personas didn't fail
 *
 * Must run BEFORE any validator, indexer, compiler, or doctor.
 * This is the LOOP GUARD for all circular dependencies (LOOPS 1-5).
 */

import { resolve } from 'path';
import { PersonaRegistry } from './persona-registry.js';
import { CapabilityMap } from './capability-map.js';
import { MeshRouter } from './mesh-router.js';
import type { MeshBootResult } from './types.js';

const PROJECT_ROOT = resolve(process.cwd());

/**
 * Initialize the TSSAS runtime mesh.
 *
 * Loads all execution personas, validates their configuration,
 * binds them to handler modules, and creates a router for capability invocation.
 *
 * @returns Promise resolving to mesh router and boot result
 * @throws Never - catches all errors and returns them in boot result
 *
 * @example
 * ```typescript
 * const { router, result } = await bootMesh();
 * if (!result.success) {
 *   console.error('Mesh boot failed:', result.errors);
 *   process.exit(1);
 * }
 * await router.invoke('qa.validate.schemas');
 * ```
 */
export async function bootMesh(): Promise<{
  router: MeshRouter;
  result: MeshBootResult;
}> {
  const startTime = Date.now();
  const errors: string[] = [];

  console.log('╔══════════════════════════════════════════╗');
  console.log('║   TSSAS RUNTIME MESH — BOOTING           ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  // ─── PHASE 1: Load schema (no mesh dependency — LOOP-04 guard) ───
  const registry = new PersonaRegistry();
  const schemaPath = resolve(
    PROJECT_ROOT,
    'ai-agent/schema/execution-persona.schema.json'
  );

  try {
    registry.loadSchema(schemaPath);
    console.log('  ✅ Schema loaded');
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Schema load failed';
    errors.push(msg);
    console.error(`  ❌ ${msg}`);
    return { router: null as never, result: buildFailResult(errors, startTime) };
  }

  // ─── PHASE 2: Load and validate execution personas ───
  const personasDir = resolve(PROJECT_ROOT, 'ai-agent/runtime/personas');
  const { loaded, errors: loadErrors } = registry.loadPersonas(personasDir);

  for (const err of loadErrors) {
    const msg = `${err.file}: ${err.errors.join('; ')}`;
    errors.push(msg);
    console.error(`  ❌ ${msg}`);
  }

  for (const persona of loaded) {
    console.log(`  ✅ Loaded: ${persona.id} (${persona.persona.name})`);
  }

  // ─── PHASE 3: Register personas ───
  for (const persona of loaded) {
    try {
      registry.register(persona);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      errors.push(msg);
    }
  }

  // ─── PHASE 4: Check registry not empty (LOOP-05 guard) ───
  if (registry.isEmpty()) {
    const msg = 'MESH FATAL: Registry is empty. No execution personas registered.';
    errors.push(msg);
    console.error(`  ❌ ${msg}`);
    return { router: null as never, result: buildFailResult(errors, startTime) };
  }

  console.log(`  📊 Registered: ${registry.size} personas`);

  // ─── PHASE 5: Bind capabilities ───
  const capabilities = new CapabilityMap();
  const engineRoot = resolve(PROJECT_ROOT, 'engine');

  for (const node of registry.getByPriority()) {
    const { bound, errors: bindErrors } = capabilities.bindPersona(
      node.persona,
      engineRoot
    );

    for (const err of bindErrors) {
      errors.push(err);
      console.error(`  ❌ ${err}`);
      registry.markFailed(node.persona.id, err);
    }

    if (bindErrors.length === 0) {
      registry.markReady(node.persona.id);
      console.log(
        `  ✅ Bound: ${node.persona.id} → ${bound.length} capabilities`
      );
    }
  }

  // ─── PHASE 6: Validate dependency graph (circular check) ───
  const depCheck = capabilities.validateDependencies();
  if (!depCheck.valid) {
    for (const cycle of depCheck.cycles) {
      const msg = `MESH: Circular dependency detected: ${cycle.join(' → ')}`;
      errors.push(msg);
      console.error(`  ❌ ${msg}`);
    }
  }

  // ─── PHASE 7: Check boot blockers ───
  let bootBlockersPassed = true;
  for (const blocker of registry.getBootBlockers()) {
    if (blocker.status === 'failed') {
      bootBlockersPassed = false;
      const msg = `MESH FATAL: Boot blocker failed: ${blocker.persona.id} — ${blocker.error}`;
      errors.push(msg);
      console.error(`  ❌ ${msg}`);
    }
  }

  // ─── BUILD RESULT ───
  const result: MeshBootResult = {
    success: errors.length === 0 && bootBlockersPassed,
    personas_loaded: loaded.length,
    personas_registered: registry.size,
    personas_failed: registry.getAll().filter((n) => n.status === 'failed').length,
    capabilities_bound: capabilities.size,
    boot_blockers_passed: bootBlockersPassed,
    errors,
    timestamp: new Date().toISOString(),
  };

  const router = new MeshRouter(registry, capabilities);

  console.log('');
  if (result.success) {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   ✅ MESH BOOT COMPLETE                  ║');
    console.log(`║   Personas: ${result.personas_registered}  Capabilities: ${result.capabilities_bound}        ║`);
    console.log('╚══════════════════════════════════════════╝');
  } else {
    console.error('╔══════════════════════════════════════════╗');
    console.error('║   ❌ MESH BOOT FAILED                    ║');
    console.error(`║   Errors: ${result.errors.length}                            ║`);
    console.error('╚══════════════════════════════════════════╝');
  }

  return { router, result };
}

/**
 * Build a failed mesh boot result.
 *
 * Used when boot fails before acquiring router/registry state.
 *
 * @param errors - Array of error messages encountered
 * @param startTime - Timestamp when boot started
 * @returns MeshBootResult with success=false and provided errors
 */
function buildFailResult(
  errors: string[],
  startTime: number
): MeshBootResult {
  return {
    success: false,
    personas_loaded: 0,
    personas_registered: 0,
    personas_failed: 0,
    capabilities_bound: 0,
    boot_blockers_passed: false,
    errors,
    timestamp: new Date().toISOString(),
  };
}

// ─── CLI ENTRY POINT ───
// Allow this file to be run directly as a script
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('mesh/boot.ts') ||
  process.argv[1]?.endsWith('mesh/boot.js')
) {
  bootMesh().then(({ result }) => {
    process.exit(result.success ? 0 : 1);
  });
}
