# AI Agent Decision Trees

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Overview

AI Agent Decision Trees provide a structured, deterministic framework for automated business logic enforcement. These trees enable AI agents to make consistent, auditable decisions based on predefined rules while maintaining full transparency and compliance.

## Core Principles

1. **Deterministic**: Same inputs always yield same outputs
2. **Transparent**: Every decision path is explainable
3. **Auditable**: All decisions are logged with reasoning
4. **Configurable**: Trees are defined as data (Fuel), not code (Engine)
5. **Composable**: Trees can reference other trees
6. **Validated**: Trees are validated before deployment

## Decision Tree Structure

### Node Types

#### 1. Decision Node

Evaluates a condition and branches based on result.

```json
{
  "type": "decision",
  "id": "check_amount",
  "condition": {
    "field": "transaction.amount",
    "operator": ">=",
    "value": 10000
  },
  "trueBranch": "escalate_to_manager",
  "falseBranch": "auto_approve",
  "metadata": {
    "description": "Check if amount requires manager approval",
    "owner": "Risk Management"
  }
}
```

#### 2. Action Node

Executes an action and terminates decision path.

```json
{
  "type": "action",
  "id": "auto_approve",
  "action": {
    "type": "approve",
    "actor": "system",
    "reason": "Amount below threshold"
  },
  "metadata": {
    "description": "Automatically approve low-value transactions"
  }
}
```

#### 3. Composite Node

Evaluates multiple conditions with AND/OR logic.

```json
{
  "type": "composite",
  "id": "high_risk_check",
  "logic": "AND",
  "conditions": [
    {
      "field": "transaction.amount",
      "operator": ">=",
      "value": 50000
    },
    {
      "field": "customer.riskScore",
      "operator": ">=",
      "value": 80
    }
  ],
  "trueBranch": "require_dual_approval",
  "falseBranch": "continue_standard_flow"
}
```

#### 4. Reference Node

Invokes another decision tree.

```json
{
  "type": "reference",
  "id": "run_fraud_check",
  "treeId": "fraud_detection_v2",
  "onSuccess": "continue",
  "onFailure": "reject_transaction"
}
```

#### 5. Data Transformation Node

Enriches or transforms data before further processing.

```json
{
  "type": "transform",
  "id": "enrich_customer_data",
  "transformations": [
    {
      "target": "customer.riskScore",
      "source": "externalRiskData.score"
    },
    {
      "target": "customer.tier",
      "function": "calculateTier",
      "inputs": ["customer.totalTransactions", "customer.accountAge"]
    }
  ],
  "next": "evaluate_risk"
}
```

## Operators

### Comparison Operators

- `==`: Equal to
- `!=`: Not equal to
- `>`: Greater than
- `>=`: Greater than or equal to
- `<`: Less than
- `<=`: Less than or equal to

### Logical Operators

- `in`: Value is in array
- `not_in`: Value is not in array
- `contains`: Array/string contains value
- `matches`: Regular expression match
- `exists`: Field exists and is not null

### Temporal Operators

- `before`: Date/time is before
- `after`: Date/time is after
- `between`: Value is between two values
- `age_gt`: Age (calculated from date) is greater than

## Example Decision Trees

### Example 1: Transaction Approval Flow

```json
{
  "id": "transaction_approval_v1",
  "name": "Transaction Approval Flow",
  "version": "1.0.0",
  "description": "Standard transaction approval decision tree",
  "rootNode": "check_amount",
  "nodes": {
    "check_amount": {
      "type": "decision",
      "condition": {
        "field": "amount",
        "operator": ">=",
        "value": 10000
      },
      "trueBranch": "check_customer_tier",
      "falseBranch": "auto_approve"
    },
    "check_customer_tier": {
      "type": "decision",
      "condition": {
        "field": "customer.tier",
        "operator": "in",
        "value": ["gold", "platinum"]
      },
      "trueBranch": "manager_approval",
      "falseBranch": "vp_approval"
    },
    "manager_approval": {
      "type": "action",
      "action": {
        "type": "escalate",
        "level": 2,
        "role": "Manager",
        "reason": "High-value transaction for premium customer"
      }
    },
    "vp_approval": {
      "type": "action",
      "action": {
        "type": "escalate",
        "level": 3,
        "role": "VP",
        "reason": "High-value transaction for standard customer"
      }
    },
    "auto_approve": {
      "type": "action",
      "action": {
        "type": "approve",
        "actor": "system",
        "reason": "Amount below auto-approval threshold"
      }
    }
  },
  "metadata": {
    "owner": "Risk Management",
    "effectiveDate": "2026-01-01",
    "reviewDate": "2026-07-01",
    "tags": ["approval", "transaction", "escalation"]
  }
}
```

### Example 2: Fraud Detection Flow

```json
{
  "id": "fraud_detection_v2",
  "name": "Fraud Detection Flow",
  "version": "2.0.0",
  "rootNode": "check_velocity",
  "nodes": {
    "check_velocity": {
      "type": "decision",
      "condition": {
        "field": "transaction.velocity.last24h",
        "operator": ">",
        "value": 5
      },
      "trueBranch": "high_velocity_check",
      "falseBranch": "check_amount_deviation"
    },
    "high_velocity_check": {
      "type": "composite",
      "logic": "AND",
      "conditions": [
        {
          "field": "transaction.velocity.last24h",
          "operator": ">",
          "value": 10
        },
        {
          "field": "transaction.amount",
          "operator": ">=",
          "value": 5000
        }
      ],
      "trueBranch": "block_transaction",
      "falseBranch": "manual_review"
    },
    "check_amount_deviation": {
      "type": "decision",
      "condition": {
        "field": "transaction.deviationFromAverage",
        "operator": ">=",
        "value": 3.0
      },
      "trueBranch": "manual_review",
      "falseBranch": "pass_fraud_check"
    },
    "block_transaction": {
      "type": "action",
      "action": {
        "type": "reject",
        "reason": "Potential fraud: High velocity and high amount",
        "notifyFraud": true,
        "notifyCustomer": true
      }
    },
    "manual_review": {
      "type": "action",
      "action": {
        "type": "escalate",
        "level": 1,
        "role": "FraudAnalyst",
        "reason": "Unusual transaction pattern requires review",
        "priority": "high"
      }
    },
    "pass_fraud_check": {
      "type": "action",
      "action": {
        "type": "continue",
        "reason": "No fraud indicators detected"
      }
    }
  }
}
```

### Example 3: KYC/AML Compliance Flow

```json
{
  "id": "kyc_aml_check_v1",
  "name": "KYC/AML Compliance Check",
  "version": "1.0.0",
  "rootNode": "check_sanctions_list",
  "nodes": {
    "check_sanctions_list": {
      "type": "decision",
      "condition": {
        "field": "customer.onSanctionsList",
        "operator": "==",
        "value": true
      },
      "trueBranch": "reject_sanctions",
      "falseBranch": "check_pep_status"
    },
    "check_pep_status": {
      "type": "decision",
      "condition": {
        "field": "customer.isPEP",
        "operator": "==",
        "value": true
      },
      "trueBranch": "enhanced_due_diligence",
      "falseBranch": "check_high_risk_country"
    },
    "check_high_risk_country": {
      "type": "decision",
      "condition": {
        "field": "customer.country",
        "operator": "in",
        "value": ["KP", "IR", "SY"]
      },
      "trueBranch": "enhanced_due_diligence",
      "falseBranch": "standard_kyc"
    },
    "reject_sanctions": {
      "type": "action",
      "action": {
        "type": "reject",
        "reason": "Customer on sanctions list",
        "notifyCompliance": true,
        "blockFuture": true
      }
    },
    "enhanced_due_diligence": {
      "type": "action",
      "action": {
        "type": "escalate",
        "level": 3,
        "role": "ComplianceOfficer",
        "reason": "Enhanced due diligence required",
        "requireDocuments": ["sourceOfFunds", "businessPurpose"]
      }
    },
    "standard_kyc": {
      "type": "action",
      "action": {
        "type": "continue",
        "reason": "Standard KYC requirements met"
      }
    }
  }
}
```

## Execution Engine

### Decision Tree Evaluator

```javascript
class DecisionTreeEvaluator {
  constructor(tree, context) {
    this.tree = tree;
    this.context = context;
    this.executionLog = [];
  }

  async evaluate() {
    let currentNodeId = this.tree.rootNode;

    while (currentNodeId) {
      const node = this.tree.nodes[currentNodeId];

      this.log({
        nodeId: currentNodeId,
        nodeType: node.type,
        timestamp: new Date(),
      });

      switch (node.type) {
        case "decision":
          currentNodeId = await this.evaluateDecision(node);
          break;
        case "composite":
          currentNodeId = await this.evaluateComposite(node);
          break;
        case "action":
          return this.executeAction(node);
        case "reference":
          currentNodeId = await this.evaluateReference(node);
          break;
        case "transform":
          currentNodeId = await this.executeTransform(node);
          break;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    }
  }

  evaluateDecision(node) {
    const value = this.getFieldValue(node.condition.field);
    const result = this.applyOperator(value, node.condition.operator, node.condition.value);

    this.log({
      evaluation: {
        field: node.condition.field,
        value: value,
        operator: node.condition.operator,
        expected: node.condition.value,
        result: result,
      },
    });

    return result ? node.trueBranch : node.falseBranch;
  }

  evaluateComposite(node) {
    const results = node.conditions.map((condition) => {
      const value = this.getFieldValue(condition.field);
      return this.applyOperator(value, condition.operator, condition.value);
    });

    const finalResult = node.logic === "AND" ? results.every((r) => r) : results.some((r) => r);

    this.log({
      composite: {
        logic: node.logic,
        individualResults: results,
        finalResult: finalResult,
      },
    });

    return finalResult ? node.trueBranch : node.falseBranch;
  }

  getFieldValue(fieldPath) {
    return fieldPath.split(".").reduce((obj, key) => obj?.[key], this.context);
  }

  log(entry) {
    this.executionLog.push({
      timestamp: new Date(),
      ...entry,
    });
  }

  getExecutionLog() {
    return this.executionLog;
  }
}
```

## Validation and Testing

### Schema Validation

All decision trees must conform to a JSON schema:

```javascript
const decisionTreeSchema = {
  type: "object",
  required: ["id", "name", "version", "rootNode", "nodes"],
  properties: {
    id: { type: "string", pattern: "^[a-z0-9_]+$" },
    name: { type: "string" },
    version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
    rootNode: { type: "string" },
    nodes: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["type"],
        properties: {
          type: {
            enum: ["decision", "composite", "action", "reference", "transform"],
          },
        },
      },
    },
  },
};
```

### Test Cases

```javascript
describe("Decision Tree Evaluation", () => {
  it("follows correct path for high-value transaction", () => {
    const tree = loadTree("transaction_approval_v1");
    const context = {
      amount: 15000,
      customer: { tier: "gold" },
    };

    const evaluator = new DecisionTreeEvaluator(tree, context);
    const result = evaluator.evaluate();

    expect(result.action.type).toBe("escalate");
    expect(result.action.role).toBe("Manager");
  });

  it("logs all decision points", () => {
    const tree = loadTree("transaction_approval_v1");
    const context = { amount: 5000 };

    const evaluator = new DecisionTreeEvaluator(tree, context);
    evaluator.evaluate();

    const log = evaluator.getExecutionLog();
    expect(log).toContainEqual(
      expect.objectContaining({
        nodeId: "check_amount",
        nodeType: "decision",
      }),
    );
  });
});
```

## Tree Versioning

### Semantic Versioning

- **Major (X.0.0)**: Breaking changes to tree structure or logic
- **Minor (1.X.0)**: New branches or nodes, backward compatible
- **Patch (1.0.X)**: Bug fixes, clarifications

### Deployment Process

1. **Develop**: Create/modify tree in development environment
2. **Validate**: Run schema validation and tests
3. **Review**: Security and compliance review
4. **Stage**: Deploy to staging environment
5. **Test**: Run with production-like data
6. **Approve**: Get sign-off from stakeholders
7. **Deploy**: Gradually roll out to production
8. **Monitor**: Track decisions and outcomes

## Governance

### Tree Ownership

Each decision tree must have:

- **Owner**: Team/role responsible for maintenance
- **Effective Date**: When tree becomes active
- **Review Cycle**: How often tree is reviewed (quarterly, annually)
- **Approvers**: Who must approve changes

### Change Control

All changes require:

1. **Impact Analysis**: What will change?
2. **Testing**: Proof that tree works as intended
3. **Documentation**: Why the change is needed
4. **Approval**: Sign-off from owner and compliance
5. **Rollback Plan**: How to revert if issues arise

## Monitoring and Analytics

### Key Metrics

- **Execution Count**: How many times tree was executed
- **Path Distribution**: Which branches are taken most often
- **Decision Time**: How long evaluation takes
- **Error Rate**: Failed evaluations
- **Action Distribution**: Types of actions taken

### Anomaly Detection

Monitor for:

- Sudden changes in path distribution
- Unusual increase in errors
- New edge cases not covered
- Performance degradation

## Best Practices

1. ✅ **Keep Trees Shallow**: Avoid deeply nested structures (max 5-7 levels)
2. ✅ **Use Descriptive IDs**: `check_high_value_threshold` not `node_7`
3. ✅ **Document Rationale**: Explain why each decision exists
4. ✅ **Test Edge Cases**: What if field is null? Negative? Very large?
5. ✅ **Version Control**: Store trees in Git
6. ✅ **Default to Safe**: When uncertain, escalate don't auto-approve
7. ✅ **Fail Gracefully**: Handle missing data without crashing

## Integration with Engine/Fuel

Decision trees are **Fuel** (configuration), evaluated by **Engine** (code):

- **Engine**: DecisionTreeEvaluator, node type handlers, operators
- **Fuel**: Tree definitions, thresholds, conditions, actions

This separation allows:

- Trees to be modified without code changes
- A/B testing different decision logic
- Client-specific trees while sharing evaluation engine
- Rapid iteration on business rules

## Related Documents

- [Engine vs Fuel](../governance/engine-vs-fuel.md)
- [Escalation Rules](../governance/escalation-rules.md)
- [Deterministic Behavior](../governance/deterministic-behavior.md)
- [Compliance Architecture](../governance/compliance-architecture.md)

## Revision History

- v1.0.0 (2026-02-09): Initial version
