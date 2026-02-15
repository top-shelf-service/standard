# Top Shelf Service Brand Design System

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Overview

This design system defines the visual language and UI standards for all Top Shelf Service LLC products and interfaces. It emphasizes a professional, sophisticated dark-mode aesthetic with charcoal backgrounds and muted green accents that convey trust, precision, and technical excellence.

## Core Principles

1. **Clarity**: Every element serves a clear purpose
2. **Consistency**: Unified experience across all touchpoints
3. **Accessibility**: WCAG 2.1 AA compliance minimum
4. **Performance**: Lightweight and optimized
5. **Modularity**: Reusable components and patterns

## Color System

### Brand Colors

- **Primary (Muted Green)**: `#4A7C59` - Used for primary actions, buttons, and brand elements
- **Secondary (Light Green)**: `#5A8C6B` - Used for secondary actions and accents
- **Tertiary (Dark Green)**: `#3D6549` - Used for success states and approvals

### Background Hierarchy

- **Primary**: `#1A1D23` - Main application background (charcoal)
- **Secondary**: `#252A31` - Content areas and panels (dark slate)
- **Tertiary**: `#2E3440` - Elevated surfaces (slate)
- **Elevated**: `#353C47` - Modals, cards, and prominent elements (light slate)

### Semantic Colors

- **Success**: `#4A7C59` - Positive outcomes, confirmations (muted green)
- **Warning**: `#D4A574` - Caution, important notices (amber)
- **Error**: `#C55A5A` - Errors, destructive actions (muted red)
- **Info**: `#5A8C9E` - Informational messages (muted blue)

## Typography

### Font Stack

- **Primary**: Inter (body text, UI)
- **Monospace**: JetBrains Mono (code, technical content)
- **Headings**: Space Grotesk (headlines, emphasis)

### Type Scale

```
5xl: 48px - Hero headings
4xl: 36px - Page titles
3xl: 30px - Section headings
2xl: 24px - Subsection headings
xl:  20px - Card titles
lg:  18px - Emphasized text
base: 16px - Body text (default)
sm:  14px - Secondary text
xs:  12px - Labels, captions
```

### Font Weights

- Light (300): Rarely used
- Normal (400): Body text
- Medium (500): Emphasized text
- Semibold (600): Subheadings
- Bold (700): Headings, strong emphasis

## Spacing System

Based on 4px baseline grid:

```
xs:  4px   - Tight spacing within components
sm:  8px   - Component internal spacing
md:  16px  - Default spacing between elements
lg:  24px  - Spacing between sections
xl:  32px  - Large spacing
2xl: 48px  - Section dividers
3xl: 64px  - Major layout divisions
4xl: 96px  - Page-level spacing
```

## Component Guidelines

### Buttons

- Height: 40px (default), 32px (small), 48px (large)
- Border radius: 8px
- Font weight: 600 (semibold)
- Transition: 250ms ease-in-out
- Focus state: 2px green outline with glow

### Cards

- Background: `var(--color-bg-elevated)`
- Border: 1px `var(--color-border-primary)`
- Border radius: 12px
- Padding: 24px
- Shadow: Medium elevation

### Forms

- Input height: 40px
- Border: 1px `var(--color-border-primary)`
- Border radius: 8px
- Focus: 2px green border with glow
- Label: 14px semibold, 8px bottom margin

## Accessibility Requirements

1. **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI elements
2. **Focus Indicators**: Always visible, never removed
3. **Keyboard Navigation**: Full support required
4. **Screen Readers**: Proper ARIA labels on all interactive elements
5. **Motion**: Respect `prefers-reduced-motion`

## Usage

Include the variables file in your project:

```html
<link rel="stylesheet" href="/design-system/css/variables.css" />
```

Or import in CSS:

```css
@import url("/design-system/css/variables.css");
```

## File Organization

```
design-system/
├── css/
│   └── variables.css       # CSS custom properties
├── README.md               # This file
└── examples/               # (Future) Component examples
```

## Maintenance

The design system is maintained by the Top Shelf Service Design & Engineering team. Updates follow semantic versioning:

- **Major**: Breaking changes to variables or structure
- **Minor**: New variables or enhancements
- **Patch**: Bug fixes, clarifications

## Support

For questions or contributions, contact: design@topshelfservice.com
