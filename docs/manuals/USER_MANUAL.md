# 👥 User Manual

**Top Shelf Service LLC Standards Repository**  
Version: 1.0  
Last Updated: 2026-02-13

## Overview

This repository contains the standard operating procedures, brand assets, design system, and knowledge packs for the TopShelf ecosystem.

**Purpose**: Single source of truth for:

- 🎨 Brand design system and UI components
- 📋 Governance policies and procedures
- ⚖️ Legal and compliance frameworks
- 🤖 AI agent decision trees
- 📊 Knowledge packs for applications

## What's Inside

### Brand Assets

Located in `brand/` and `design-system/`:

- **UI Templates**: Copy/paste HTML templates for common page types
- **CSS Variables**: Dark-mode color system and design tokens
- **Typography**: Font specifications and usage guidelines
- **Component Library**: Pre-built UI components with `ts-*` classes

### Governance Documentation

Located in `governance/`:

- **Engine vs Fuel**: Separation of business logic and configuration
- **Escalation Rules**: Decision routing framework
- **Deterministic Behavior**: Guidelines for reproducible systems
- **Compliance Architecture**: Audit and compliance patterns

### Legal & Compliance

Located in `legal/`:

- Compliance requirements (SOX, GDPR, CCPA, HIPAA, PCI-DSS)
- Data retention policies
- Breach notification procedures
- Vendor management frameworks

### AI Agent Decision Trees

Located in `ai-agent/`:

- JSON schema for decision trees
- Example decision tree structures
- Integration guidelines

## Using This Repository

### For Developers

Integrate the design system and standards into your application:

1. **Import Design System**:
   - Link to `brand/topshelf.css` for UI styling
   - Reference `design-system/css/variables.css` for CSS variables

2. **Follow Governance Policies**:
   - Implement Engine/Fuel separation
   - Use decision trees for business logic
   - Follow escalation rules

3. **Consume Knowledge Packs** (Future):
   - Access compiled JSON from `dist/` folder
   - Use RAG endpoints for agent queries

### For Designers

Use brand assets for consistent design:

1. **Color System**: Reference `design-system/README.md` for:
   - Brand colors (muted green: #4A7C59)
   - Background hierarchy (charcoal/slate tones)
   - Semantic colors for states

2. **UI Templates**: Copy templates from `brand/ui-usage.md`:
   - Dashboard layouts
   - List pages
   - Detail views
   - Forms
   - Multi-step wizards

3. **Typography**: Use specified fonts:
   - Headings: Space Grotesk
   - Body: Inter
   - Code: JetBrains Mono

### For Compliance Officers

Review compliance frameworks:

1. **Governance Policies**: `governance/` directory
2. **Legal Requirements**: `legal/` directory
3. **Audit Trails**: Implementation in `governance/compliance-architecture.md`

### For Product Managers

Understand system architecture and decision frameworks:

1. **Engine vs Fuel**: `governance/engine-vs-fuel.md`
2. **Escalation Rules**: `governance/escalation-rules.md`
3. **Decision Trees**: `ai-agent/` directory

## Consuming Packs

Applications should ingest the artifacts generated in the `dist/` folder:

### JSON Packs

```javascript
// Example: Load decision tree
import decisionTree from "@topshelf/standard/dist/decision-trees.json";
```

### SQLite Databases

```python
# Example: Query knowledge base
import sqlite3
conn = sqlite3.connect('dist/knowledge.db')
```

### RAG Endpoints (Future)

```bash
# Start retrieval server
pnpm serve:retrieval

# Query endpoint
curl http://localhost:3000/api/query?q=escalation+rules
```

## Governance

### Change Control

Changes to "Core" policies must:

1. Pass the `pnpm doctor` health check
2. Be reviewed by appropriate stakeholders
3. Pass CI validation
4. Be approved before merging

### Version Control

This repository uses:

- Git for version control
- GitHub for hosting
- Semantic versioning for releases

### Access Control

Repository access is controlled via GitHub permissions:

- **Read**: All team members
- **Write**: Developers and content authors
- **Admin**: Platform team

## Distribution

### No Manual Publishing

This repo does **not** publish to npm or pnpm registries.

Artifacts are distributed via:

- **Git Tags**: Version releases
- **GitHub Releases**: Downloadable `.tar.gz` archives
- **CI Builds**: Auto-generated `dist/` folder

### Integration Methods

#### Method 1: Git Submodule

```bash
git submodule add https://github.com/top-shelf-service/standard.git
```

#### Method 2: Direct Clone

```bash
git clone https://github.com/top-shelf-service/standard.git
```

#### Method 3: Release Archive

Download from GitHub Releases page.

## Updates

### Checking for Updates

```bash
git fetch origin
git log HEAD..origin/main --oneline
```

### Applying Updates

```bash
git pull origin main
pnpm install  # If dependencies changed
```

## Support

### Documentation

- **Technical Details**: `docs/manuals/TECHNICAL_MANUAL.md`
- **Developer Guide**: `docs/manuals/DEVELOPER_MANUAL.md`
- **This Manual**: `docs/manuals/USER_MANUAL.md`

### Getting Help

1. Check relevant manual
2. Review documentation in repository
3. Search GitHub issues
4. Contact platform team

## Frequently Asked Questions

### Q: Can I modify the design system for my app?

**A**: The design system provides base styles. You can extend with additional classes, but don't modify the core `ts-*` classes.

### Q: How do I report a bug or request a feature?

**A**: Create an issue on GitHub with appropriate labels.

### Q: Can I use this in a different organization?

**A**: No. This is proprietary to Top Shelf Service LLC.

### Q: How often is this repository updated?

**A**: Updates are made as needed. Watch the repository for notifications.

### Q: What if my app needs a component not in the design system?

**A**: First try to compose existing components. If truly needed, propose adding it to the standard.

## License

**PROPRIETARY AND CONFIDENTIAL**

Copyright (c) 2026 Top Shelf Service LLC. All rights reserved.

This repository and its contents are proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

## Changelog

### Version 1.0.0 (2026-02-13)

- Initial release
- Complete design system with dark-mode theme
- Governance documentation
- AI agent decision tree framework
- Legal and compliance templates
- Build tooling and validation
