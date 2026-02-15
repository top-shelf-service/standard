# Compliance-First Architecture

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Overview

Compliance-First Architecture is a design philosophy where regulatory compliance, auditability, and governance are primary concerns integrated into every layer of the system, not afterthoughts bolted on later. This approach ensures that Top Shelf Service LLC systems meet regulatory requirements while remaining maintainable and scalable.

## Core Tenets

1. **Compliance by Design**: Regulatory requirements inform architecture from inception
2. **Audit Trail Everything**: Every decision and data change is traceable
3. **Immutable Records**: Historical data cannot be modified or deleted
4. **Separation of Duties**: Critical operations require multiple actors
5. **Deterministic Processing**: Same inputs produce same outputs for reproducibility
6. **Data Governance**: Clear ownership, lineage, and retention policies
7. **Privacy by Default**: Minimal data collection, encryption, access controls

## Architectural Patterns

### Pattern 1: Event Sourcing for Audit Trails

Store all state changes as immutable events, not just current state.

**Benefits:**

- Complete audit trail
- Ability to replay history
- Time-travel debugging
- Regulatory reporting

**Implementation:**

```javascript
// Event Store (immutable)
const events = [
  {
    eventId: "evt_001",
    eventType: "OrderCreated",
    timestamp: "2026-02-09T10:00:00Z",
    actor: "user:john@example.com",
    data: { orderId: "ord_123", amount: 1000 },
  },
  {
    eventId: "evt_002",
    eventType: "OrderApproved",
    timestamp: "2026-02-09T10:05:00Z",
    actor: "system:approval-engine",
    data: { orderId: "ord_123", approver: "manager:jane@example.com" },
  },
];

// Current state is derived from events
function getCurrentState(orderId) {
  return events.filter((e) => e.data.orderId === orderId).reduce(applyEvent, initialState);
}
```

### Pattern 2: Write-Ahead Logging (WAL)

Log intended changes before executing them.

**Benefits:**

- Recovery from failures
- Audit of attempted operations
- Debugging failed transactions

**Implementation:**

```javascript
async function processTransaction(transaction) {
  // 1. Write intent log
  const logId = await writeLog({
    type: "INTENT",
    operation: "processTransaction",
    data: transaction,
    timestamp: new Date(),
  });

  try {
    // 2. Execute operation
    const result = await executeTransaction(transaction);

    // 3. Write success log
    await writeLog({
      type: "SUCCESS",
      logId: logId,
      result: result,
    });

    return result;
  } catch (error) {
    // 4. Write failure log
    await writeLog({
      type: "FAILURE",
      logId: logId,
      error: error.message,
    });
    throw error;
  }
}
```

### Pattern 3: Separation of Duties (SoD)

Critical operations require multiple authorized individuals.

**Implementation:**

```javascript
class DualApprovalWorkflow {
  constructor() {
    this.pendingApprovals = new Map();
  }

  async requestApproval(operation, requestor) {
    const approvalId = generateId();

    this.pendingApprovals.set(approvalId, {
      operation,
      requestor,
      approvals: [],
      required: 2,
      created: new Date(),
    });

    await audit.log({
      type: "APPROVAL_REQUESTED",
      approvalId,
      requestor,
      operation: operation.type,
    });

    return approvalId;
  }

  async approve(approvalId, approver) {
    const pending = this.pendingApprovals.get(approvalId);

    // Validate: approver != requestor
    if (approver === pending.requestor) {
      throw new Error("Cannot self-approve");
    }

    // Validate: no duplicate approvals
    if (pending.approvals.includes(approver)) {
      throw new Error("Already approved by this user");
    }

    pending.approvals.push(approver);

    await audit.log({
      type: "APPROVAL_GRANTED",
      approvalId,
      approver,
      approvalNumber: pending.approvals.length,
    });

    // Execute if threshold met
    if (pending.approvals.length >= pending.required) {
      await this.execute(pending.operation);
      this.pendingApprovals.delete(approvalId);
    }
  }
}
```

### Pattern 4: Data Classification and Access Control

Classify data by sensitivity and enforce access controls.

**Data Classification:**

```javascript
const DataClassification = {
  PUBLIC: "public", // No restrictions
  INTERNAL: "internal", // Employees only
  CONFIDENTIAL: "confidential", // Need-to-know basis
  RESTRICTED: "restricted", // PII, financial, health data
  CRITICAL: "critical", // Trade secrets, keys
};

const dataRules = {
  customer_email: {
    classification: DataClassification.RESTRICTED,
    retention: "7 years",
    encryption: "required",
    auditAccess: true,
  },
  transaction_amount: {
    classification: DataClassification.CONFIDENTIAL,
    retention: "10 years",
    encryption: "required",
    auditAccess: true,
  },
};
```

**Access Control:**

```javascript
class DataAccessController {
  canAccess(user, resource, operation) {
    // Check role-based access
    if (!user.roles.includes(resource.requiredRole)) {
      this.auditAccessDenied(user, resource, "INSUFFICIENT_ROLE");
      return false;
    }

    // Check data classification
    if (resource.classification === DataClassification.RESTRICTED) {
      if (!this.hasDataAccessCertification(user)) {
        this.auditAccessDenied(user, resource, "NO_CERTIFICATION");
        return false;
      }
    }

    // Log all access to sensitive data
    if (resource.classification >= DataClassification.CONFIDENTIAL) {
      this.auditDataAccess(user, resource, operation);
    }

    return true;
  }
}
```

### Pattern 5: Immutable Audit Logs

Audit logs cannot be modified or deleted, only appended.

**Implementation:**

```javascript
class ImmutableAuditLog {
  constructor(storage) {
    this.storage = storage; // Append-only storage (e.g., blockchain, WORM storage)
  }

  async log(entry) {
    const auditEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      hash: this.calculateHash(entry),
      previousHash: await this.getLatestHash(),
      entry: entry,
    };

    // Verify chain integrity
    if (!this.verifyChain(auditEntry)) {
      throw new Error("Audit log chain integrity violation");
    }

    // Append only - no updates or deletes
    await this.storage.append(auditEntry);

    return auditEntry.id;
  }

  calculateHash(data) {
    // Cryptographic hash ensures tamper detection
    return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
  }
}
```

### Pattern 6: Data Lineage Tracking

Track data flow from source to consumption.

**Implementation:**

```javascript
class DataLineage {
  track(data, operation) {
    return {
      ...data,
      _lineage: {
        source: data._lineage?.derivedFrom || "original",
        operation: operation,
        timestamp: new Date(),
        version: incrementVersion(data._lineage?.version || "0.0.0"),
        transformations: [
          ...(data._lineage?.transformations || []),
          {
            operation: operation.type,
            actor: operation.actor,
            timestamp: new Date(),
          },
        ],
      },
    };
  }

  async getLineage(dataId) {
    // Returns complete transformation history
    return this.storage.query({
      dataId: dataId,
      includeHistory: true,
    });
  }
}
```

## Compliance Requirements by Domain

### Financial Services (SOX, PCI-DSS)

**Key Requirements:**

- Transaction immutability
- Dual approval for high-value transactions
- Encrypted storage of financial data
- Retention: 7 years
- Access audit trails

**Implementation Checklist:**

- [ ] Event-sourced transaction history
- [ ] Dual approval workflow for amounts > threshold
- [ ] AES-256 encryption at rest
- [ ] Automated retention policy enforcement
- [ ] Real-time access monitoring

### Healthcare (HIPAA)

**Key Requirements:**

- PHI encryption in transit and at rest
- Access logging for all PHI
- Minimum necessary access
- Patient consent tracking
- Breach notification procedures

**Implementation Checklist:**

- [ ] Role-based access control (RBAC)
- [ ] PHI data classification and tagging
- [ ] Audit log for every PHI access
- [ ] Automated consent verification
- [ ] Break-glass emergency access with notification

### Privacy (GDPR, CCPA)

**Key Requirements:**

- Data minimization
- Right to erasure
- Right to portability
- Consent management
- Data processing agreements

**Implementation Checklist:**

- [ ] Privacy by design
- [ ] Pseudonymization of PII
- [ ] Data export functionality
- [ ] Consent management system
- [ ] Data processing records

## Monitoring and Enforcement

### Automated Compliance Checks

```javascript
class ComplianceMonitor {
  async runChecks() {
    const results = await Promise.all([
      this.checkAccessPatterns(),
      this.checkRetentionPolicies(),
      this.checkEncryptionCompliance(),
      this.checkAuditLogIntegrity(),
      this.checkSeparationOfDuties(),
    ]);

    const violations = results.filter((r) => !r.compliant);

    if (violations.length > 0) {
      await this.alertComplianceTeam(violations);
    }

    return {
      compliant: violations.length === 0,
      violations: violations,
    };
  }

  async checkRetentionPolicies() {
    const expiredData = await this.findExpiredData();

    if (expiredData.length > 0) {
      return {
        compliant: false,
        issue: "Data retention policy violation",
        details: expiredData,
      };
    }

    return { compliant: true };
  }
}
```

### Real-Time Alerting

```javascript
class ComplianceAlerting {
  async monitorCriticalOperations() {
    // Monitor for suspicious patterns
    this.on("MULTIPLE_FAILED_ACCESS", async (event) => {
      await this.alert({
        severity: "HIGH",
        type: "POTENTIAL_BREACH_ATTEMPT",
        details: event,
      });
    });

    this.on("BULK_DATA_EXPORT", async (event) => {
      if (event.recordCount > 1000) {
        await this.alert({
          severity: "MEDIUM",
          type: "UNUSUAL_DATA_EXPORT",
          details: event,
        });
      }
    });

    this.on("OFF_HOURS_ADMIN_ACCESS", async (event) => {
      await this.alert({
        severity: "MEDIUM",
        type: "OFF_HOURS_ACCESS",
        details: event,
      });
    });
  }
}
```

## Documentation Requirements

Every system must maintain:

1. **Data Flow Diagrams**: Document data movement and transformations
2. **Compliance Matrix**: Map requirements to implementations
3. **Audit Procedures**: How to generate audit reports
4. **Incident Response Plan**: Steps to handle compliance violations
5. **Data Retention Schedule**: What data, how long, why
6. **Access Control Policy**: Who can access what data and why

## Testing Compliance

### Compliance Test Suite

```javascript
describe("Compliance Requirements", () => {
  describe("Audit Trail", () => {
    it("logs all data modifications", async () => {
      const data = await createTestData();
      await updateData(data.id, { field: "new value" });

      const auditLog = await getAuditLog(data.id);
      expect(auditLog).toContainEntry({
        operation: "UPDATE",
        field: "field",
        oldValue: "old value",
        newValue: "new value",
      });
    });

    it("audit logs are immutable", async () => {
      const logId = await createAuditLog({ test: "entry" });

      await expect(updateAuditLog(logId, { test: "modified" })).rejects.toThrow(
        "Audit logs are immutable",
      );
    });
  });

  describe("Separation of Duties", () => {
    it("prevents self-approval", async () => {
      const requestor = "user_1";
      const approvalId = await requestApproval(operation, requestor);

      await expect(approve(approvalId, requestor)).rejects.toThrow("Cannot self-approve");
    });
  });

  describe("Data Retention", () => {
    it("enforces retention policies", async () => {
      const oldData = await createDataWithAge(8, "years");
      await runRetentionPolicy();

      const exists = await dataExists(oldData.id);
      expect(exists).toBe(false);
    });
  });
});
```

## Compliance Reporting

### Automated Report Generation

```javascript
class ComplianceReporter {
  async generateMonthlyReport() {
    return {
      period: this.getCurrentMonth(),
      summary: {
        totalTransactions: await this.countTransactions(),
        auditLogEntries: await this.countAuditEntries(),
        accessViolations: await this.countAccessViolations(),
        dataBreaches: await this.countDataBreaches(),
      },
      details: {
        highValueTransactions: await this.getHighValueTransactions(),
        failedAccessAttempts: await this.getFailedAccessAttempts(),
        dataExports: await this.getDataExports(),
        policyChanges: await this.getPolicyChanges(),
      },
      certifications: {
        auditLogIntegrity: await this.verifyAuditLogIntegrity(),
        encryptionCompliance: await this.verifyEncryption(),
        accessControlCompliance: await this.verifyAccessControls(),
      },
    };
  }
}
```

## Best Practices

1. ✅ **Log Everything**: When in doubt, log more not less
2. ✅ **Fail Secure**: Deny access by default, grant explicitly
3. ✅ **Encrypt Sensitive Data**: Both at rest and in transit
4. ✅ **Regular Audits**: Automated daily, manual quarterly
5. ✅ **Document Decisions**: Why was access granted? Why was data retained?
6. ✅ **Test Compliance**: Automated compliance tests in CI/CD
7. ✅ **Train Staff**: Regular compliance training for all personnel

## Anti-Patterns

1. ❌ **Compliance as Afterthought**: Bolting on compliance later
2. ❌ **Mutable Audit Logs**: Logs that can be modified
3. ❌ **Generic Access Control**: "Admin can do everything"
4. ❌ **Manual Compliance**: Relying on manual processes
5. ❌ **Ignoring Failed Attempts**: Not monitoring failed access
6. ❌ **Deleting Old Logs**: Prematurely removing audit trails

## Related Documents

- [Engine vs Fuel](engine-vs-fuel.md)
- [Escalation Rules](escalation-rules.md)
- [Deterministic Behavior Guidelines](deterministic-behavior.md)
- [AI Agent Decision Trees](../ai-agent/README.md)

## Revision History

- v1.0.0 (2026-02-09): Initial version
