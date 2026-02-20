// engine/mesh/types.ts
/**
 * Runtime mesh type definitions for TSSAS execution layer.
 * These types define the contract between personas, capabilities, and the mesh router.
 * No external dependencies - types only.
 */

/**
 * Configuration for a single capability's retry behavior and execution metadata.
 *
 * A capability is a callable action provided by an execution persona.
 * Each capability has a handler module, timeout, and retry configuration.
 */
export interface ExecutionCapability {
  /** Unique capability identifier in format 'domain.action' (e.g., 'qa.validate.schemas') */
  id: string;
  /** Human-readable capability name */
  name: string;
  /** Path to handler module relative to engine/ directory */
  handler: string;
  /** Execution timeout in milliseconds (1000-300000) */
  timeout_ms: number;
  /** Retry configuration for transient failures */
  retry: {
    /** Maximum retry attempts (0 = no retry) */
    max_attempts: number;
    /** Backoff delay in milliseconds between retries (minimum 100) */
    backoff_ms: number;
  };
  /** Capability IDs that must complete successfully before this one runs */
  depends_on: string[];
}

/**
 * Execution persona definition derived from governance persona.
 *
 * Personas are runtime actors that provide sets of related capabilities.
 * Each persona has metadata, executable capabilities, and execution configuration.
 * Examples: SecurityAuditor, QAEngineer, EnvironmentGuardian.
 */
export interface ExecutionPersona {
  /** Unique persona identifier (kebab-case) */
  id: string;
  /** Reference to the governance persona this execution version derives from */
  derived_from: string;
  /** Semver version of this execution persona */
  version: string;
  /** Persona metadata and identity */
  persona: {
    /** Full name of the persona (person or role) */
    name: string;
    /** Official title or role */
    title: string;
    /** Type of work this persona performs */
    role_type: 'validator' | 'compiler' | 'monitor' | 'enforcer' | 'router';
  };
  /** Runtime execution configuration */
  execution: {
    /** Callable capabilities this persona provides */
    capabilities: ExecutionCapability[];
    /** How the mesh invokes this persona's capabilities */
    invoke_mode: 'sync' | 'async' | 'event-driven';
    /** Boot order priority (0 = first, 100 = last) */
    mesh_priority: number;
    /** If true, missing this persona causes mesh boot failure */
    runtime_enforced: boolean;
    /** If true AND capability fails, mesh boot terminates process with exit 1 */
    boot_blocker: boolean;
    /** Scope at which this persona is registered and available */
    mesh_scope: 'global' | 'package' | 'file';
  };
  /** Optional VS Code integration configuration */
  vscode?: {
    /** VS Code task group this persona's capabilities belong to */
    task_group: string;
    /** VS Code problem matcher pattern for output parsing */
    problem_matcher: string;
    /** Optional status bar integration */
    status_bar?: {
      /** Status bar text with icon variables */
      text: string;
      /** Status bar hover tooltip */
      tooltip: string;
      /** Status bar priority (higher = left side) */
      priority: number;
    };
  };
}

/**
 * Runtime representation of a registered execution persona.
 *
 * A mesh node wraps an execution persona with its current lifecycle state.
 * Nodes progress through states: registered → ready → [used] or failed.
 */
export interface MeshNode {
  /** The execution persona definition */
  persona: ExecutionPersona;
  /** Current lifecycle status */
  status: 'registered' | 'ready' | 'failed' | 'disabled';
  /** Timestamp when persona was registered (ms since epoch) */
  registered_at: number;
  /** Timestamp of last capability invocation (ms since epoch) */
  last_invoked?: number;
  /** Error message if status is 'failed' */
  error?: string;
}

/**
 * Runtime binding of a capability to its handler and metadata.
 *
 * Created during mesh boot when capability handlers are verified to exist.
 * Used by the mesh router to invoke capabilities with correct timeout/retry settings.
 */
export interface CapabilityBinding {
  /** Unique capability identifier */
  capability_id: string;
  /** ID of the persona providing this capability */
  persona_id: string;
  /** Path to handler module (resolved from engine root) */
  handler_path: string;
  /** Execution timeout in milliseconds */
  timeout_ms: number;
  /** Dependency capability IDs that must execute first */
  depends_on: string[];
}

/**
 * Result of a single capability invocation through the mesh router.
 *
 * Contains execution metadata (timing, success/failure) and capability output.
 * Used by the mesh router to report results and coordinate dependent capabilities.
 */
export interface MeshInvocationResult {
  /** The capability that was invoked */
  capability_id: string;
  /** The persona that provided the capability */
  persona_id: string;
  /** Whether invocation succeeded */
  success: boolean;
  /** Execution duration in milliseconds */
  duration_ms: number;
  /** Capability output/return value */
  output: unknown;
  /** Error message if invocation failed */
  error?: string;
}

/**
 * Result of the full mesh boot process.
 *
 * Returned by bootMesh() to indicate overall success/failure.
 * Boot fails if any boot-blocker persona fails or if registry is empty.
 */
export interface MeshBootResult {
  /** Whether boot succeeded completely */
  success: boolean;
  /** Count of execution personas loaded from filesystem */
  personas_loaded: number;
  /** Count of personas successfully registered */
  personas_registered: number;
  /** Count of personas that failed binding */
  personas_failed: number;
  /** Count of capabilities successfully bound to handlers */
  capabilities_bound: number;
  /** Whether all boot-blocker personas passed validation */
  boot_blockers_passed: boolean;
  /** All error messages encountered during boot */
  errors: string[];
  /** ISO 8601 timestamp of boot completion */
  timestamp: string;
}
