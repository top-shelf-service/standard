# Engine vs Fuel: Architectural Separation Principle

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Overview

The **Engine vs Fuel** principle is a fundamental architectural pattern at Top Shelf Service LLC that enforces strict separation between reusable business logic (Engine) and client-specific configurations (Fuel). This separation ensures scalability, maintainability, and compliance across all service implementations.

## Core Concept

```
┌─────────────────────────────────────────┐
│              ENGINE                     │
│  (Reusable Business Logic)              │
│  • Deterministic algorithms             │
│  • Validation rules                     │
│  • Decision trees                       │
│  • Compliance checks                    │
│  • Escalation logic                     │
└─────────────────────────────────────────┘
                  ▲
                  │ Consumes
                  │
┌─────────────────────────────────────────┐
│              FUEL                       │
│  (Client-Specific Configuration)        │
│  • Client parameters                    │
│  • Business rules data                  │
│  • Thresholds and limits                │
│  • Workflow definitions                 │
│  • Custom field mappings                │
└─────────────────────────────────────────┘
```

## Definitions

### Engine (Business Logic)

The **Engine** represents the core, reusable business logic that:

- Is **universal** across all clients
- Contains **no hard-coded client data**
- Implements **deterministic algorithms**
- Enforces **compliance and governance rules**
- Provides **decision-making frameworks**
- Remains **stable and version-controlled**

**Examples:**

- Risk assessment algorithms
- Escalation decision trees
- Data validation logic
- Audit trail mechanisms
- State machine implementations

### Fuel (Configuration Data)

The **Fuel** represents client-specific configuration that:

- Is **unique per client or deployment**
- Contains **no business logic**
- Is **data-driven and declarative**
- Can be **modified without code changes**
- Is **validated by the Engine**
- May be **stored separately** (database, config files, CMS)

**Examples:**

- Approval thresholds (e.g., "Amount > $10,000 requires VP approval")
- Client-specific workflows
- Custom field definitions
- Notification preferences
- Integration endpoints

## Enforcement Rules

### DO: Engine

✅ Implement generic algorithms that accept parameters  
✅ Create reusable validation functions  
✅ Build decision trees with configurable nodes  
✅ Use dependency injection for configuration  
✅ Write unit tests with various configuration inputs  
✅ Version control all engine code  
✅ Document all configuration points

### DON'T: Engine

❌ Hard-code client names or IDs  
❌ Include client-specific thresholds in code  
❌ Create one-off functions for single clients  
❌ Mix business logic with configuration data  
❌ Use conditional logic based on client identity

### DO: Fuel

✅ Store all client-specific values in configuration  
✅ Use structured data formats (JSON, YAML, database)  
✅ Validate configuration against schemas  
✅ Version control configuration separately  
✅ Document all configuration options  
✅ Provide configuration templates

### DON'T: Fuel

❌ Include executable code  
❌ Bypass engine validation rules  
❌ Duplicate logic from engine  
❌ Create client-specific algorithms

## Implementation Patterns

### Pattern 1: Configuration-Driven Decision Tree

```javascript
// ENGINE: Generic decision evaluator
function evaluateDecisionTree(tree, context) {
  let currentNode = tree.root;

  while (currentNode) {
    if (currentNode.type === "decision") {
      const result = evaluateCondition(currentNode.condition, context);
      currentNode = result ? currentNode.trueBranch : currentNode.falseBranch;
    } else if (currentNode.type === "action") {
      return currentNode.action;
    }
  }
}

// FUEL: Client-specific decision tree
const clientDecisionTree = {
  root: {
    type: "decision",
    condition: { field: "amount", operator: ">", value: 10000 },
    trueBranch: {
      type: "action",
      action: { type: "escalate", to: "VP_APPROVAL" },
    },
    falseBranch: {
      type: "action",
      action: { type: "auto_approve" },
    },
  },
};
```

### Pattern 2: Rule Engine

```javascript
// ENGINE: Rule evaluator
function applyRules(rules, data) {
  for (const rule of rules) {
    if (evaluateCondition(rule.condition, data)) {
      executeAction(rule.action, data);
      if (rule.stopOnMatch) break;
    }
  }
}

// FUEL: Client rules
const clientRules = [
  {
    name: "High Value Check",
    condition: { field: "value", operator: ">=", threshold: 50000 },
    action: { type: "require_dual_approval" },
    stopOnMatch: false,
  },
  {
    name: "Weekend Processing",
    condition: { field: "dayOfWeek", operator: "in", values: ["Saturday", "Sunday"] },
    action: { type: "defer_until_weekday" },
    stopOnMatch: true,
  },
];
```

### Pattern 3: Template-Based Processing

```javascript
// ENGINE: Template processor
function processTemplate(template, data, validators) {
  const processed = {};

  for (const [key, definition] of Object.entries(template.fields)) {
    const value = extractValue(data, definition.source);
    const validated = validators[definition.validator](value, definition.rules);
    processed[key] = validated;
  }

  return processed;
}

// FUEL: Client template
const clientTemplate = {
  fields: {
    customerName: {
      source: "customer.fullName",
      validator: "required_string",
      rules: { minLength: 2, maxLength: 100 },
    },
    orderValue: {
      source: "order.total",
      validator: "currency",
      rules: { min: 0, currency: "USD" },
    },
  },
};
```

## Benefits

1. **Scalability**: Onboard new clients without changing core logic
2. **Maintainability**: Bug fixes improve all clients simultaneously
3. **Testability**: Test engine once with various configurations
4. **Compliance**: Ensure consistent governance across all deployments
5. **Auditability**: Clear separation enables better audit trails
6. **Flexibility**: Clients can customize behavior without code changes

## Migration Strategy

When converting existing systems to Engine/Fuel architecture:

1. **Identify**: Locate hard-coded client-specific values
2. **Extract**: Move values to configuration structures
3. **Generalize**: Refactor logic to accept configuration parameters
4. **Validate**: Create schema validators for configuration
5. **Test**: Verify behavior with various configurations
6. **Document**: Explain all configuration options
7. **Deploy**: Roll out with existing client configurations

## Configuration Management

### Storage Options

- **Git Repository**: For version-controlled configuration (recommended for most use cases)
- **Database**: For frequently changing or client-managed configuration
- **Key-Value Store**: For simple, flat configuration
- **CMS**: For non-technical user-managed configuration

### Security Considerations

- Encrypt sensitive configuration data
- Implement access controls on configuration storage
- Audit all configuration changes
- Validate configuration before deployment
- Separate production and non-production configurations

## Compliance and Governance

The Engine/Fuel separation supports compliance by:

- **Traceability**: Clear audit trail of what logic was applied
- **Consistency**: Same logic applied to all clients
- **Validation**: Configuration validated before execution
- **Documentation**: Self-documenting through configuration
- **Testing**: Repeatable testing with known configurations

## Review and Approval

All changes to Engine or Fuel must follow these approval paths:

| Change Type | Approval Required             | Review Process                     |
| ----------- | ----------------------------- | ---------------------------------- |
| Engine Code | Engineering Lead + Compliance | Code review + security scan        |
| Engine API  | Architecture Review Board     | Design review + impact analysis    |
| Fuel Schema | Product + Engineering         | Schema validation + migration plan |
| Client Fuel | Account Manager + Compliance  | Configuration review + testing     |

## Related Documents

- [Escalation Rules](escalation-rules.md)
- [Deterministic Behavior Guidelines](deterministic-behavior.md)
- [Compliance Architecture](compliance-architecture.md)
- [AI Agent Decision Trees](../ai-agent/README.md)

## Revision History

- v1.0.0 (2026-02-09): Initial version
