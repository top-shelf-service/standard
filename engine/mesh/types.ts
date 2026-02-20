// engine/mesh/types.ts
// Runtime mesh type definitions — no external dependencies

export interface ExecutionCapability {
  id: string;
  name: string;
  handler: string;
  timeout_ms: number;
  retry: {
    max_attempts: number;
    backoff_ms: number;
  };
  depends_on: string[];
}

export interface ExecutionPersona {
  id: string;
  derived_from: string;
  version: string;
  persona: {
    name: string;
    title: string;
    role_type: 'validator' | 'compiler' | 'monitor' | 'enforcer' | 'router';
  };
  execution: {
    capabilities: ExecutionCapability[];
    invoke_mode: 'sync' | 'async' | 'event-driven';
    mesh_priority: number;
    runtime_enforced: boolean;
    boot_blocker: boolean;
    mesh_scope: 'global' | 'package' | 'file';
  };
  vscode?: {
    task_group: string;
    problem_matcher: string;
    status_bar?: {
      text: string;
      tooltip: string;
      priority: number;
    };
  };
}

export interface MeshNode {
  persona: ExecutionPersona;
  status: 'registered' | 'ready' | 'failed' | 'disabled';
  registered_at: number;
  last_invoked?: number;
  error?: string;
}

export interface CapabilityBinding {
  capability_id: string;
  persona_id: string;
  handler_path: string;
  timeout_ms: number;
  depends_on: string[];
}

export interface MeshInvocationResult {
  capability_id: string;
  persona_id: string;
  success: boolean;
  duration_ms: number;
  output: unknown;
  error?: string;
}

export interface MeshBootResult {
  success: boolean;
  personas_loaded: number;
  personas_registered: number;
  personas_failed: number;
  capabilities_bound: number;
  boot_blockers_passed: boolean;
  errors: string[];
  timestamp: string;
}
