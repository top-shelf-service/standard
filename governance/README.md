# Governance Framework Index

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Overview

This directory contains the core governance documents that define Top Shelf Service LLC's architectural principles, compliance requirements, and operational standards. These documents form the foundation for all system design and implementation decisions.

## Documents

### 1. [Engine vs Fuel](engine-vs-fuel.md)

**Status**: Active | **Version**: 1.0.0 | **Owner**: Engineering Leadership

Defines the architectural separation between reusable business logic (Engine) and client-specific configuration (Fuel). This is the foundational principle for all system design.

**Key Topics:**

- Core concept and definitions
- Implementation patterns
- Configuration management
- Benefits and use cases

**Applies to**: All systems and services

---

### 2. [Escalation Rules](escalation-rules.md)

**Status**: Active | **Version**: 1.0.0 | **Owner**: Risk Management

Framework for routing decisions, approvals, and exceptions through organizational hierarchies with appropriate timeouts and fallback mechanisms.

**Key Topics:**

- Escalation trigger types
- Escalation levels (0-5)
- Decision matrix and routing
- Timeout and fallback behavior
- Audit requirements

**Applies to**: Approval workflows, exception handling, SLA enforcement

---

### 3. [Deterministic Behavior](deterministic-behavior.md)

**Status**: Active | **Version**: 1.0.0 | **Owner**: Engineering Leadership

Guidelines for ensuring systems produce consistent, reproducible results for compliance, testing, and debugging.

**Key Topics:**

- Core principles (pure functions, explicit dependencies)
- Common non-deterministic sources
- Handling necessary non-determinism
- Testing strategies
- Code review checklist

**Applies to**: All business logic, decision engines, data processing

---

### 4. [Compliance-First Architecture](compliance-architecture.md)

**Status**: Active | **Version**: 1.0.0 | **Owner**: Compliance Office

Design philosophy where regulatory compliance and auditability are primary concerns integrated into every system layer from inception.

**Key Topics:**

- Architectural patterns (event sourcing, WAL, SoD)
- Data classification and access control
- Compliance requirements by domain (SOX, HIPAA, GDPR, CCPA, PCI-DSS)
- Monitoring and enforcement
- Automated compliance checks

**Applies to**: All systems handling sensitive or regulated data

---

## Document Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                   Compliance-First                          │
│                   (Overarching Framework)                   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Engine vs    │    │ Deterministic│    │  Escalation  │
│ Fuel         │◄───┤  Behavior    │───►│   Rules      │
│              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   AI Agent       │
                  │ Decision Trees   │
                  └──────────────────┘
```

**Key Relationships:**

- **Compliance-First** provides the overarching framework
- **Engine vs Fuel** enables scalable, configurable compliance
- **Deterministic Behavior** ensures reproducible audit trails
- **Escalation Rules** implement separation of duties
- **AI Agent Decision Trees** operationalize all principles

## Change Management

### Amendment Process

1. **Proposal**: Submit change proposal with rationale
2. **Impact Analysis**: Assess impact on existing systems
3. **Review**: Stakeholder review (Engineering, Compliance, Legal)
4. **Approval**: Document owner + Compliance sign-off required
5. **Communication**: Announce changes to all affected teams
6. **Implementation**: Update systems to comply with new version
7. **Audit**: Verify compliance in next audit cycle

### Version Control

Each document follows semantic versioning:

- **Major (X.0.0)**: Breaking changes requiring immediate action
- **Minor (1.X.0)**: Additions, clarifications (backward compatible)
- **Patch (1.0.X)**: Corrections, typo fixes

### Review Cycle

| Document               | Review Frequency | Next Review |
| ---------------------- | ---------------- | ----------- |
| Engine vs Fuel         | Annually         | 2027-02-09  |
| Escalation Rules       | Quarterly        | 2026-05-09  |
| Deterministic Behavior | Annually         | 2027-02-09  |
| Compliance-First       | Quarterly        | 2026-05-09  |

## Compliance Matrix

| Requirement          | Engine/Fuel | Escalation | Deterministic | Compliance-First |
| -------------------- | ----------- | ---------- | ------------- | ---------------- |
| SOX                  | ✓           | ✓✓         | ✓✓            | ✓✓               |
| GDPR                 | ✓           | -          | ✓             | ✓✓               |
| HIPAA                | ✓           | ✓          | ✓             | ✓✓               |
| PCI-DSS              | ✓           | ✓          | ✓             | ✓✓               |
| Audit Trail          | ✓           | ✓✓         | ✓✓            | ✓✓               |
| Separation of Duties | ✓           | ✓✓         | -             | ✓✓               |

Legend: ✓✓ Primary guidance | ✓ Supporting guidance | - Not applicable

## Training Requirements

All personnel must complete training on applicable governance documents:

| Role                | Required Documents              | Frequency         |
| ------------------- | ------------------------------- | ----------------- |
| All Engineers       | All governance docs             | Annually          |
| Product Managers    | Engine/Fuel, Escalation         | Annually          |
| Compliance Officers | All governance docs             | Semi-annually     |
| QA/Test Engineers   | Deterministic, Compliance-First | Annually          |
| Architects          | All governance docs             | Quarterly updates |

## Support and Questions

For clarification or guidance on governance documents:

- **Architecture Questions**: architecture@topshelfservice.com
- **Compliance Questions**: compliance@topshelfservice.com
- **Policy Interpretation**: legal@topshelfservice.com
- **Training**: training@topshelfservice.com

## Related Resources

- [AI Agent Decision Trees](../ai-agent/README.md)
- [Legal Framework](../legal/README.md)
- [Design System](../design-system/README.md)

---

**Document Owner**: Engineering Leadership  
**Last Updated**: 2026-02-09  
**Next Review**: 2026-05-09
