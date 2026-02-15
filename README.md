# Top Shelf Service LLC - Standards Repository

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- Git

### Setup

1. **Enable Corepack** (one-time):

   ```bash
   corepack enable
   ```

2. **Clone and Install**:

   ```bash
   git clone https://github.com/top-shelf-service/standard.git
   cd standard
   pnpm install
   ```

3. **Validate Setup**:
   ```bash
   pnpm doctor
   ```

## Package Manager Enforcement

⚠️ **This repository enforces pnpm-only installation**

- ✅ Use: `pnpm install`
- ❌ Do NOT use: `npm install` or `yarn install`

The preinstall hook will **block** any package manager other than pnpm@9.15.5.

## Available Scripts

```bash
pnpm doctor          # Run complete health check (environment, lint, types, validation)
pnpm lint            # Run ESLint
pnpm format          # Auto-format all files with Prettier
pnpm format:check    # Check formatting without modifying
pnpm test            # Run test suite
pnpm test:watch      # Run tests in watch mode
pnpm build:index     # Build entity index
pnpm build:packs     # Build data packs
```

## Documentation

- 📘 [Technical Manual](docs/manuals/TECHNICAL_MANUAL.md) - Architecture and system design
- 👨‍💻 [Developer Manual](docs/manuals/DEVELOPER_MANUAL.md) - Development workflows
- 👥 [User Manual](docs/manuals/USER_MANUAL.md) - Usage and consumption

## Overview

This repository contains the foundational standards, governance frameworks, design systems, and business logic patterns for Top Shelf Service LLC. It serves as the authoritative source for organizational policies, compliance requirements, and architectural patterns that guide all company operations.

**⚠️ Important**: This is a **documentation-first repository**, not a runnable application. It contains standards, patterns, and guidelines rather than executable code.

## Repository Structure

```
standard/
├── LICENSE                 # Proprietary license
├── README.md              # This file
├── brand/                 # Brand UI patterns and templates
│   ├── topshelf.css       # Complete UI component stylesheet (ts-* classes)
│   └── ui-usage.md        # Copy/paste page templates and patterns
├── design-system/         # Brand design system and UI standards
│   ├── css/
│   │   └── variables.css  # Dark-mode CSS variables
│   └── README.md          # Design system documentation
├── governance/            # Governance and architectural standards
│   ├── engine-vs-fuel.md             # Engine/Fuel separation principle
│   ├── escalation-rules.md           # Escalation framework
│   ├── deterministic-behavior.md     # Determinism guidelines
│   └── compliance-architecture.md    # Compliance-first architecture
├── ai-agent/              # AI agent decision trees
│   ├── README.md                    # Decision tree framework
│   ├── decision-tree-schema.json    # JSON schema for trees
│   └── examples/                    # Example decision trees
└── legal/                 # Legal and compliance documentation
    └── README.md          # Legal framework
```

## Core Principles

### 1. Engine vs Fuel Separation

We maintain strict separation between reusable business logic (**Engine**) and client-specific configuration (**Fuel**). This enables:

- Scalable onboarding of new clients
- Consistent logic across all deployments
- Configuration changes without code modifications
- Better testing and maintainability

📖 [Read more about Engine vs Fuel](governance/engine-vs-fuel.md)

### 2. Deterministic Behavior

All business logic must be deterministic: same inputs always produce same outputs. This ensures:

- Reproducible decisions for compliance
- Reliable automated testing
- Trustworthy audit trails
- Debuggable systems

📖 [Read more about Deterministic Behavior](governance/deterministic-behavior.md)

### 3. Compliance-First Architecture

Regulatory compliance and auditability are designed into every layer, not added as afterthoughts:

- Immutable audit trails
- Event sourcing for complete history
- Data classification and access controls
- Separation of duties
- Privacy by design

📖 [Read more about Compliance-First Architecture](governance/compliance-architecture.md)

### 4. Escalation Rules

Structured framework for routing decisions through organizational hierarchies:

- Threshold-based, risk-based, and time-based triggers
- Clear escalation paths with timeouts
- Dual approval for high-risk operations
- Complete audit trails

📖 [Read more about Escalation Rules](governance/escalation-rules.md)

## Brand UI System

Complete UI pattern library with copy/paste templates for building consistent, on-brand interfaces:

**Features:**

- Pre-built page templates (Dashboard, List, Detail, Form, Wizard)
- Navigation patterns (Topbar, Sidebar, Dropdowns)
- Complete component library (`ts-*` utility classes)
- Dark-mode design with cyan/purple/green brand colors
- Fully responsive and accessible (WCAG AA)
- Framework-agnostic HTML/CSS

📖 [View UI Templates](brand/ui-usage.md) | [Component Stylesheet](brand/topshelf.css)

## Design System

Our brand design system provides a professional, modern dark-mode aesthetic that conveys trust and technical excellence.

**Key Features:**

- CSS custom properties (variables) for easy theming
- Comprehensive color palette for dark mode
- Typography scale and font stack
- Spacing system based on 4px baseline grid
- Component guidelines and patterns
- WCAG 2.1 AA accessibility compliance

📖 [View Design System](design-system/README.md)

## AI Agent Decision Trees

Framework for building deterministic, auditable decision trees that enable AI agents to enforce business logic consistently:

**Features:**

- Multiple node types (decision, composite, action, reference, transform)
- Configurable as data (JSON), not code
- Complete execution logging
- Schema validation
- Version control and change management

📖 [Learn about Decision Trees](ai-agent/README.md)

## Legal and Compliance

Comprehensive legal framework covering:

- Intellectual property policy
- Data protection and privacy (GDPR, CCPA, HIPAA, PCI-DSS)
- Contractual framework (MSA, DPA, SLA, NDA)
- Compliance programs (security, vendor management, BC/DR)
- Retention and disposal policies
- Breach notification procedures

📖 [Review Legal Framework](legal/README.md)

## Usage Guidelines

### For Developers

1. **Read Core Principles**: Understand Engine/Fuel, determinism, compliance-first
2. **Follow Design System**: Use provided CSS variables and patterns
3. **Implement Decision Trees**: Use the framework for business logic
4. **Ensure Compliance**: Follow security and privacy guidelines
5. **Document Everything**: Maintain clear audit trails

### For Product Managers

1. **Define Requirements**: Using Engine/Fuel separation principles
2. **Configure Decision Trees**: Define business logic as configurable data
3. **Set Escalation Rules**: Define appropriate approval workflows
4. **Review Compliance**: Ensure features meet regulatory requirements

### For Compliance Officers

1. **Monitor Standards**: Ensure adherence to documented standards
2. **Review Changes**: Approve modifications to governance documents
3. **Audit Implementations**: Verify compliance with frameworks
4. **Update Policies**: Keep standards current with regulations

## Contributing

All changes to this repository require:

1. **Review**: Appropriate stakeholder review based on document type
2. **Approval**: Sign-off from document owner and compliance
3. **Testing**: Validation that changes don't break existing systems
4. **Documentation**: Clear explanation of what and why

See individual sections for specific approval requirements.

## Version Control

This repository uses semantic versioning for major frameworks:

- **Major (X.0.0)**: Breaking changes requiring implementation updates
- **Minor (1.X.0)**: New features, backward compatible additions
- **Patch (1.0.X)**: Clarifications, corrections, documentation improvements

## Support

For questions or guidance:

- **Engineering**: engineering@topshelfservice.com
- **Design**: design@topshelfservice.com
- **Compliance**: compliance@topshelfservice.com
- **Legal**: legal@topshelfservice.com

## License

See [LICENSE](LICENSE) for full details.

**Summary**: This repository contains proprietary and confidential information. All rights reserved. Unauthorized use, distribution, or disclosure is strictly prohibited.

---

**Last Updated**: 2026-02-09  
**Repository Owner**: Engineering Leadership  
**Compliance Review**: Quarterly
