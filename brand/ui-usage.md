# Top Shelf UI Usage Standard (Templates)
Version: 1.0  
Owner: Top Shelf Service LLC™

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## PURPOSE

This document provides copy/paste UI templates that are:
- **Reproducible** (same building blocks every time)
- **Flexible** (content and nav vary by product)
- **On-brand by default** (powered by brand/topshelf.css)

This repo does NOT define routing or page lists. App repos define:
- Routes/pages
- Sidebar items / dropdown items
- Feature logic (auth, org, scheduling, training, etc.)

This repo defines:
- The UI "shell" patterns
- Page composition templates
- Allowed customization points

────────────────────────────────────────
## 1) HOW TO USE IN AN APP
────────────────────────────────────────

1. Import the brand stylesheet once:
   - Next.js App Router: `app/layout.tsx`
   - Vite/React: `src/main.tsx`
   - Plain HTML: `<link rel="stylesheet" href="path/to/brand/topshelf.css">`

2. Build pages by composing these primitives:
   - `ts-container`
   - `ts-header`
   - `ts-card`
   - `ts-list` + `ts-list-item`
   - `ts-btn` + `ts-btn-primary/secondary/danger`
   - `ts-input/ts-select/ts-textarea`
   - `ts-badge-*`

**Rule**: If you need a layout not covered here, extend with composition first (add another card, list, grid). Do NOT create new styling until required.

────────────────────────────────────────
## 2) TOP SHELF PAGE SHELL (BASE PATTERN)
────────────────────────────────────────

Use this structure for every screen.

```html
<div class="ts-container">
  <div class="ts-header">
    <div>
      <h1>PAGE TITLE</h1>
      <div class="ts-subtle">Short page purpose / context</div>
    </div>

    <!-- Optional: header actions -->
    <button class="ts-btn ts-btn-primary">Primary Action</button>
  </div>

  <!-- Page content cards -->
  <div class="ts-card">
    <h2>SECTION TITLE</h2>
    <div class="ts-subtle">Section description</div>
    <div class="ts-divider"></div>

    <!-- Content goes here -->
  </div>

  <div class="ts-footer">
    © 2026 Top Shelf Service LLC™. All rights reserved.
  </div>
</div>
```

────────────────────────────────────────
## 3) TEMPLATE: DASHBOARD PAGE
────────────────────────────────────────

Dashboard = quick entry points + status cards + recent activity.

```html
<div class="ts-container">
  <div class="ts-header">
    <div>
      <h1>Dashboard</h1>
      <div class="ts-subtle">Welcome back! Here's your overview.</div>
    </div>
    <button class="ts-btn ts-btn-secondary">Refresh</button>
  </div>

  <!-- Quick Stats Grid -->
  <div class="ts-grid ts-grid-4">
    <div class="ts-card ts-card-compact">
      <div class="ts-subtle">Total Orders</div>
      <h2 class="ts-mt-sm">1,247</h2>
      <div class="ts-badge ts-badge-success ts-mt-md">+12% this week</div>
    </div>

    <div class="ts-card ts-card-compact">
      <div class="ts-subtle">Pending Approvals</div>
      <h2 class="ts-mt-sm">23</h2>
      <div class="ts-badge ts-badge-warning ts-mt-md">Requires attention</div>
    </div>

    <div class="ts-card ts-card-compact">
      <div class="ts-subtle">Risk Score</div>
      <h2 class="ts-mt-sm">72</h2>
      <div class="ts-badge ts-badge-info ts-mt-md">Normal range</div>
    </div>

    <div class="ts-card ts-card-compact">
      <div class="ts-subtle">Active Users</div>
      <h2 class="ts-mt-sm">89</h2>
      <div class="ts-badge ts-badge-success ts-mt-md">+5 today</div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="ts-card">
    <h2>Quick Actions</h2>
    <div class="ts-subtle">Common tasks and workflows</div>
    <div class="ts-divider"></div>

    <div class="ts-grid ts-grid-3">
      <button class="ts-btn ts-btn-secondary ts-btn-full">
        Create New Order
      </button>
      <button class="ts-btn ts-btn-secondary ts-btn-full">
        Review Pending Items
      </button>
      <button class="ts-btn ts-btn-secondary ts-btn-full">
        Generate Report
      </button>
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="ts-card">
    <h2>Recent Activity</h2>
    <div class="ts-subtle">Latest updates across your systems</div>
    <div class="ts-divider"></div>

    <ul class="ts-list">
      <li class="ts-list-item ts-list-item-interactive">
        <div>
          <div class="ts-font-semibold">Order #12345 Approved</div>
          <div class="ts-subtle">Customer: Acme Corp • Amount: $45,000</div>
        </div>
        <div class="ts-flex ts-gap-sm">
          <span class="ts-badge ts-badge-success">Approved</span>
          <span class="ts-subtle">2 mins ago</span>
        </div>
      </li>

      <li class="ts-list-item ts-list-item-interactive">
        <div>
          <div class="ts-font-semibold">High Risk Transaction Flagged</div>
          <div class="ts-subtle">Order #12346 • Requires review</div>
        </div>
        <div class="ts-flex ts-gap-sm">
          <span class="ts-badge ts-badge-warning">Pending</span>
          <span class="ts-subtle">15 mins ago</span>
        </div>
      </li>

      <li class="ts-list-item ts-list-item-interactive">
        <div>
          <div class="ts-font-semibold">New Customer Onboarded</div>
          <div class="ts-subtle">XYZ Industries • Tier: Gold</div>
        </div>
        <div class="ts-flex ts-gap-sm">
          <span class="ts-badge ts-badge-info">Complete</span>
          <span class="ts-subtle">1 hour ago</span>
        </div>
      </li>
    </ul>
  </div>

  <div class="ts-footer">
    © 2026 Top Shelf Service LLC™. All rights reserved.
  </div>
</div>
```

────────────────────────────────────────
## 4) TEMPLATE: LIST PAGE (COLLECTION INDEX)
────────────────────────────────────────

List pages should be "scannable" and tap-friendly.

```html
<div class="ts-container">
  <div class="ts-header">
    <div>
      <h1>Orders</h1>
      <div class="ts-subtle">View and manage all orders</div>
    </div>
    <div class="ts-flex ts-gap-sm">
      <button class="ts-btn ts-btn-secondary">Filter</button>
      <button class="ts-btn ts-btn-primary">Create Order</button>
    </div>
  </div>

  <!-- Filters / Search Bar -->
  <div class="ts-card ts-card-compact">
    <div class="ts-flex ts-gap-md">
      <input 
        type="search" 
        class="ts-input" 
        placeholder="Search by order ID, customer name..."
        style="flex: 1;"
      />
      <select class="ts-select" style="width: 200px;">
        <option>All Statuses</option>
        <option>Pending</option>
        <option>Approved</option>
        <option>Rejected</option>
      </select>
      <button class="ts-btn ts-btn-secondary">Search</button>
    </div>
  </div>

  <!-- List Items -->
  <div class="ts-card">
    <div class="ts-flex-between ts-mb-md">
      <h2>All Orders (127)</h2>
      <div class="ts-subtle">Showing 1-20</div>
    </div>
    <div class="ts-divider"></div>

    <ul class="ts-list">
      <li class="ts-list-item ts-list-item-interactive">
        <div style="flex: 1;">
          <div class="ts-flex ts-gap-md ts-mb-sm">
            <span class="ts-font-semibold">Order #12345</span>
            <span class="ts-badge ts-badge-success">Approved</span>
          </div>
          <div class="ts-subtle">Acme Corp • $45,000 • Created: 2026-02-09</div>
        </div>
        <button class="ts-btn ts-btn-ghost ts-btn-small">View Details →</button>
      </li>

      <li class="ts-list-item ts-list-item-interactive">
        <div style="flex: 1;">
          <div class="ts-flex ts-gap-md ts-mb-sm">
            <span class="ts-font-semibold">Order #12346</span>
            <span class="ts-badge ts-badge-warning">Pending Review</span>
          </div>
          <div class="ts-subtle">XYZ Industries • $78,500 • Created: 2026-02-09</div>
        </div>
        <button class="ts-btn ts-btn-ghost ts-btn-small">View Details →</button>
      </li>

      <li class="ts-list-item ts-list-item-interactive">
        <div style="flex: 1;">
          <div class="ts-flex ts-gap-md ts-mb-sm">
            <span class="ts-font-semibold">Order #12347</span>
            <span class="ts-badge ts-badge-error">Rejected</span>
          </div>
          <div class="ts-subtle">Beta Corp • $12,300 • Created: 2026-02-08</div>
        </div>
        <button class="ts-btn ts-btn-ghost ts-btn-small">View Details →</button>
      </li>

      <li class="ts-list-item ts-list-item-interactive">
        <div style="flex: 1;">
          <div class="ts-flex ts-gap-md ts-mb-sm">
            <span class="ts-font-semibold">Order #12348</span>
            <span class="ts-badge ts-badge-info">Processing</span>
          </div>
          <div class="ts-subtle">Gamma LLC • $34,200 • Created: 2026-02-08</div>
        </div>
        <button class="ts-btn ts-btn-ghost ts-btn-small">View Details →</button>
      </li>
    </ul>

    <div class="ts-divider"></div>
    <div class="ts-flex-between">
      <button class="ts-btn ts-btn-secondary">← Previous</button>
      <div class="ts-subtle">Page 1 of 7</div>
      <button class="ts-btn ts-btn-secondary">Next →</button>
    </div>
  </div>

  <div class="ts-footer">
    © 2026 Top Shelf Service LLC™. All rights reserved.
  </div>
</div>
```

────────────────────────────────────────
## 5) TEMPLATE: DETAIL PAGE (VIEW / REVIEW)
────────────────────────────────────────

Detail page = read-only primary view with clear actions.

```html
<div class="ts-container">
  <div class="ts-header">
    <div>
      <h1>Order #12345</h1>
      <div class="ts-subtle">View order details and take action</div>
    </div>
    <div class="ts-flex ts-gap-sm">
      <button class="ts-btn ts-btn-secondary">Edit</button>
      <button class="ts-btn ts-btn-primary">Approve</button>
      <button class="ts-btn ts-btn-danger">Reject</button>
    </div>
  </div>

  <!-- Status Overview -->
  <div class="ts-card">
    <div class="ts-flex-between ts-mb-md">
      <h2>Status</h2>
      <span class="ts-badge ts-badge-warning">Pending Review</span>
    </div>
    <div class="ts-divider"></div>

    <div class="ts-grid ts-grid-3">
      <div>
        <div class="ts-subtle">Created</div>
        <div class="ts-font-semibold ts-mt-sm">2026-02-09 10:34 AM</div>
      </div>
      <div>
        <div class="ts-subtle">Last Updated</div>
        <div class="ts-font-semibold ts-mt-sm">2026-02-09 11:15 AM</div>
      </div>
      <div>
        <div class="ts-subtle">Risk Score</div>
        <div class="ts-font-semibold ts-mt-sm">75 <span class="ts-badge ts-badge-info">Normal</span></div>
      </div>
    </div>
  </div>

  <!-- Customer Information -->
  <div class="ts-card">
    <h2>Customer Information</h2>
    <div class="ts-divider"></div>

    <div class="ts-grid ts-grid-2">
      <div class="ts-form-group">
        <div class="ts-label">Customer Name</div>
        <div class="ts-font-semibold">Acme Corporation</div>
      </div>

      <div class="ts-form-group">
        <div class="ts-label">Customer Tier</div>
        <div class="ts-font-semibold">
          Gold <span class="ts-badge ts-badge-success">Premium</span>
        </div>
      </div>

      <div class="ts-form-group">
        <div class="ts-label">Contact Email</div>
        <div class="ts-font-semibold">john.smith@acmecorp.com</div>
      </div>

      <div class="ts-form-group">
        <div class="ts-label">Account Manager</div>
        <div class="ts-font-semibold">Jane Doe</div>
      </div>
    </div>
  </div>

  <!-- Order Details -->
  <div class="ts-card">
    <h2>Order Details</h2>
    <div class="ts-divider"></div>

    <div class="ts-form-group">
      <div class="ts-label">Order Amount</div>
      <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);">
        $45,000.00 USD
      </div>
    </div>

    <div class="ts-form-group">
      <div class="ts-label">Description</div>
      <div>Enterprise software license renewal for 500 users. Includes premium support and training credits.</div>
    </div>

    <div class="ts-form-group">
      <div class="ts-label">Payment Terms</div>
      <div>Net 30 days</div>
    </div>

    <div class="ts-form-group">
      <div class="ts-label">Delivery Date</div>
      <div>2026-03-01</div>
    </div>
  </div>

  <!-- Approval History -->
  <div class="ts-card">
    <h2>Approval History</h2>
    <div class="ts-subtle">Track of all approvals and actions</div>
    <div class="ts-divider"></div>

    <ul class="ts-list">
      <li class="ts-list-item">
        <div style="flex: 1;">
          <div class="ts-font-semibold">Order Created</div>
          <div class="ts-subtle">By: John Smith (Customer)</div>
        </div>
        <div class="ts-subtle">2026-02-09 10:34 AM</div>
      </li>

      <li class="ts-list-item">
        <div style="flex: 1;">
          <div class="ts-font-semibold">Escalated to Manager</div>
          <div class="ts-subtle">Amount exceeds auto-approval threshold</div>
        </div>
        <div class="ts-subtle">2026-02-09 10:35 AM</div>
      </li>

      <li class="ts-list-item">
        <div style="flex: 1;">
          <div class="ts-font-semibold">Under Review</div>
          <div class="ts-subtle">Assigned to: Jane Doe (Manager)</div>
        </div>
        <div class="ts-subtle">2026-02-09 11:15 AM</div>
      </li>
    </ul>
  </div>

  <div class="ts-footer">
    © 2026 Top Shelf Service LLC™. All rights reserved.
  </div>
</div>
```

────────────────────────────────────────
## 6) TEMPLATE: FORM PAGE (CREATE / EDIT)
────────────────────────────────────────

Forms must be readable, touch-friendly, and low-error.

```html
<div class="ts-container">
  <div class="ts-header">
    <div>
      <h1>Create New Order</h1>
      <div class="ts-subtle">Fill in the form to create a new order</div>
    </div>
  </div>

  <form>
    <!-- Customer Section -->
    <div class="ts-card">
      <h2>Customer Information</h2>
      <div class="ts-subtle">Select or enter customer details</div>
      <div class="ts-divider"></div>

      <div class="ts-form-group">
        <label class="ts-label" for="customer">
          Customer *
        </label>
        <select id="customer" class="ts-select" required>
          <option value="">Select a customer...</option>
          <option value="acme">Acme Corporation</option>
          <option value="xyz">XYZ Industries</option>
          <option value="beta">Beta Corp</option>
        </select>
      </div>

      <div class="ts-grid ts-grid-2">
        <div class="ts-form-group">
          <label class="ts-label" for="contact-name">
            Contact Name *
          </label>
          <input 
            type="text" 
            id="contact-name" 
            class="ts-input" 
            placeholder="John Smith"
            required
          />
        </div>

        <div class="ts-form-group">
          <label class="ts-label" for="contact-email">
            Contact Email *
          </label>
          <input 
            type="email" 
            id="contact-email" 
            class="ts-input" 
            placeholder="john.smith@example.com"
            required
          />
        </div>
      </div>
    </div>

    <!-- Order Details Section -->
    <div class="ts-card">
      <h2>Order Details</h2>
      <div class="ts-subtle">Provide order information</div>
      <div class="ts-divider"></div>

      <div class="ts-form-group">
        <label class="ts-label" for="order-amount">
          Order Amount (USD) *
        </label>
        <input 
          type="number" 
          id="order-amount" 
          class="ts-input" 
          placeholder="0.00"
          step="0.01"
          required
        />
        <div class="ts-subtle ts-mt-sm">
          Orders over $10,000 require manager approval
        </div>
      </div>

      <div class="ts-form-group">
        <label class="ts-label" for="description">
          Description *
        </label>
        <textarea 
          id="description" 
          class="ts-textarea" 
          placeholder="Describe the order details, products, or services..."
          required
        ></textarea>
      </div>

      <div class="ts-grid ts-grid-2">
        <div class="ts-form-group">
          <label class="ts-label" for="payment-terms">
            Payment Terms *
          </label>
          <select id="payment-terms" class="ts-select" required>
            <option value="">Select terms...</option>
            <option value="net15">Net 15 days</option>
            <option value="net30">Net 30 days</option>
            <option value="net60">Net 60 days</option>
            <option value="immediate">Immediate</option>
          </select>
        </div>

        <div class="ts-form-group">
          <label class="ts-label" for="delivery-date">
            Expected Delivery Date *
          </label>
          <input 
            type="date" 
            id="delivery-date" 
            class="ts-input"
            required
          />
        </div>
      </div>

      <div class="ts-form-group">
        <label style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
          <input type="checkbox" class="ts-checkbox" id="rush-order" />
          <span class="ts-label" style="margin: 0;">Rush Order (Additional fees apply)</span>
        </label>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="ts-card">
      <h2>Additional Information</h2>
      <div class="ts-subtle">Optional details</div>
      <div class="ts-divider"></div>

      <div class="ts-form-group">
        <label class="ts-label" for="notes">
          Internal Notes
        </label>
        <textarea 
          id="notes" 
          class="ts-textarea" 
          placeholder="Add any internal notes or comments..."
          rows="3"
        ></textarea>
      </div>

      <div class="ts-form-group">
        <label class="ts-label" for="reference">
          Reference Number
        </label>
        <input 
          type="text" 
          id="reference" 
          class="ts-input" 
          placeholder="PO-12345"
        />
      </div>
    </div>

    <!-- Form Actions -->
    <div class="ts-card">
      <div class="ts-flex ts-gap-sm" style="justify-content: flex-end;">
        <button type="button" class="ts-btn ts-btn-secondary">
          Cancel
        </button>
        <button type="button" class="ts-btn ts-btn-secondary">
          Save as Draft
        </button>
        <button type="submit" class="ts-btn ts-btn-primary">
          Submit Order
        </button>
      </div>
    </div>
  </form>

  <div class="ts-footer">
    © 2026 Top Shelf Service LLC™. All rights reserved.
  </div>
</div>
```

────────────────────────────────────────
## 7) TEMPLATE: WIZARD (MULTI-STEP FLOW)
────────────────────────────────────────

Use for onboarding flows. Keep steps short.

```html
<div class="ts-container">
  <div class="ts-header">
    <div>
      <h1>New Customer Onboarding</h1>
      <div class="ts-subtle">Step-by-step customer setup</div>
    </div>
  </div>

  <!-- Wizard Steps Progress -->
  <div class="ts-card">
    <ol class="ts-wizard-steps">
      <li class="ts-wizard-step ts-wizard-step-complete">
        <div class="ts-wizard-step-circle">✓</div>
        <div class="ts-wizard-step-label">Basic Info</div>
      </li>
      <li class="ts-wizard-step ts-wizard-step-active">
        <div class="ts-wizard-step-circle">2</div>
        <div class="ts-wizard-step-label">Contact Details</div>
      </li>
      <li class="ts-wizard-step">
        <div class="ts-wizard-step-circle">3</div>
        <div class="ts-wizard-step-label">Preferences</div>
      </li>
      <li class="ts-wizard-step">
        <div class="ts-wizard-step-circle">4</div>
        <div class="ts-wizard-step-label">Review</div>
      </li>
    </ol>
  </div>

  <!-- Current Step Content -->
  <div class="ts-card">
    <h2>Step 2: Contact Details</h2>
    <div class="ts-subtle">Provide primary contact information</div>
    <div class="ts-divider"></div>

    <div class="ts-form-group">
      <label class="ts-label" for="primary-contact">
        Primary Contact Name *
      </label>
      <input 
        type="text" 
        id="primary-contact" 
        class="ts-input" 
        placeholder="Jane Doe"
        required
      />
    </div>

    <div class="ts-grid ts-grid-2">
      <div class="ts-form-group">
        <label class="ts-label" for="email">
          Email Address *
        </label>
        <input 
          type="email" 
          id="email" 
          class="ts-input" 
          placeholder="jane.doe@example.com"
          required
        />
      </div>

      <div class="ts-form-group">
        <label class="ts-label" for="phone">
          Phone Number *
        </label>
        <input 
          type="tel" 
          id="phone" 
          class="ts-input" 
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>
    </div>

    <div class="ts-form-group">
      <label class="ts-label" for="address">
        Business Address *
      </label>
      <textarea 
        id="address" 
        class="ts-textarea" 
        placeholder="123 Business St, Suite 100&#10;City, State ZIP"
        rows="3"
        required
      ></textarea>
    </div>

    <div class="ts-form-group">
      <label style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
        <input type="checkbox" class="ts-checkbox" id="same-billing" />
        <span class="ts-label" style="margin: 0;">Billing address is the same as business address</span>
      </label>
    </div>

    <!-- Wizard Navigation -->
    <div class="ts-wizard-actions">
      <button type="button" class="ts-btn ts-btn-secondary">
        ← Previous Step
      </button>
      <div class="ts-flex ts-gap-sm">
        <button type="button" class="ts-btn ts-btn-ghost">
          Save & Exit
        </button>
        <button type="button" class="ts-btn ts-btn-primary">
          Next Step →
        </button>
      </div>
    </div>
  </div>

  <div class="ts-footer">
    © 2026 Top Shelf Service LLC™. All rights reserved.
  </div>
</div>
```

────────────────────────────────────────
## 8) NAV PATTERNS
────────────────────────────────────────

Navigation structure (what pages exist) lives in the app repo.
This section gives safe, reproducible patterns.

### Topbar Pattern

Use for primary navigation and global actions.

```html
<nav class="ts-topbar">
  <!-- Brand / Logo -->
  <a href="/" class="ts-topbar-brand">
    Top Shelf
  </a>

  <!-- Primary Navigation -->
  <div class="ts-topbar-nav">
    <a href="/dashboard" class="ts-topbar-link ts-topbar-link-active">
      Dashboard
    </a>
    <a href="/orders" class="ts-topbar-link">
      Orders
    </a>
    <a href="/customers" class="ts-topbar-link">
      Customers
    </a>
    <a href="/reports" class="ts-topbar-link">
      Reports
    </a>
  </div>

  <!-- User Actions -->
  <div class="ts-topbar-nav">
    <button class="ts-btn ts-btn-ghost ts-btn-small">
      Notifications (3)
    </button>
    <button class="ts-btn ts-btn-ghost ts-btn-small">
      Profile
    </button>
  </div>
</nav>
```

### Sidebar Pattern (Simple List)

Use for secondary navigation within a section.

```html
<aside class="ts-sidebar">
  <h3 class="ts-mb-lg">Orders</h3>
  
  <ul class="ts-sidebar-nav">
    <li>
      <a href="/orders/all" class="ts-sidebar-link ts-sidebar-link-active">
        All Orders
      </a>
    </li>
    <li>
      <a href="/orders/pending" class="ts-sidebar-link">
        Pending Review
      </a>
    </li>
    <li>
      <a href="/orders/approved" class="ts-sidebar-link">
        Approved
      </a>
    </li>
    <li>
      <a href="/orders/rejected" class="ts-sidebar-link">
        Rejected
      </a>
    </li>
  </ul>

  <div class="ts-divider"></div>

  <h3 class="ts-mb-lg">Actions</h3>
  
  <ul class="ts-sidebar-nav">
    <li>
      <a href="/orders/create" class="ts-sidebar-link">
        Create Order
      </a>
    </li>
    <li>
      <a href="/orders/export" class="ts-sidebar-link">
        Export Data
      </a>
    </li>
  </ul>
</aside>
```

### Combined Layout Pattern (Topbar + Sidebar + Content)

Complete page layout with both navigation types.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top Shelf Service</title>
  <link rel="stylesheet" href="path/to/brand/topshelf.css">
</head>
<body>
  <!-- Topbar -->
  <nav class="ts-topbar">
    <a href="/" class="ts-topbar-brand">Top Shelf</a>
    <div class="ts-topbar-nav">
      <a href="/dashboard" class="ts-topbar-link">Dashboard</a>
      <a href="/orders" class="ts-topbar-link ts-topbar-link-active">Orders</a>
      <a href="/customers" class="ts-topbar-link">Customers</a>
    </div>
    <div class="ts-topbar-nav">
      <button class="ts-btn ts-btn-ghost ts-btn-small">Profile</button>
    </div>
  </nav>

  <!-- Main Layout: Sidebar + Content -->
  <div style="display: flex;">
    <!-- Sidebar -->
    <aside class="ts-sidebar">
      <h3 class="ts-mb-lg">Orders</h3>
      <ul class="ts-sidebar-nav">
        <li>
          <a href="/orders/all" class="ts-sidebar-link ts-sidebar-link-active">
            All Orders
          </a>
        </li>
        <li>
          <a href="/orders/pending" class="ts-sidebar-link">
            Pending Review
          </a>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main style="flex: 1;">
      <div class="ts-container">
        <div class="ts-header">
          <div>
            <h1>All Orders</h1>
            <div class="ts-subtle">View and manage orders</div>
          </div>
          <button class="ts-btn ts-btn-primary">Create Order</button>
        </div>

        <!-- Page content here -->
        <div class="ts-card">
          <p>Your page content goes here...</p>
        </div>

        <div class="ts-footer">
          © 2026 Top Shelf Service LLC™. All rights reserved.
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

### Dropdown Pattern

Use the app framework's dropdown component; keep styling consistent:

**Styling Requirements:**
- Dark surface (`var(--color-bg-elevated)`)
- Slate border (`var(--color-border-primary)`)
- Mist text (`var(--color-text-secondary)`)
- Green focus (`var(--color-border-focus)`)

**Rule**: Dropdowns are for low-frequency actions only.

Example structure (framework-agnostic):
```html
<div class="dropdown-container">
  <button class="ts-btn ts-btn-secondary ts-btn-small">
    Options ▾
  </button>
  
  <!-- Dropdown menu (positioned absolutely by framework) -->
  <div class="dropdown-menu" style="
    position: absolute;
    min-width: 200px;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-sm);
  ">
    <a href="#" class="dropdown-item" style="
      display: block;
      padding: var(--space-sm) var(--space-md);
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: var(--border-radius-sm);
      transition: all var(--transition-fast);
    ">
      Edit
    </a>
    <a href="#" class="dropdown-item">
      Duplicate
    </a>
    <div class="ts-divider" style="margin: var(--space-sm) 0;"></div>
    <a href="#" class="dropdown-item" style="color: var(--color-error);">
      Delete
    </a>
  </div>
</div>
```

────────────────────────────────────────
## 9) WHAT MAY VARY (FLEXIBILITY CONTRACT)
────────────────────────────────────────

### Allowed to Vary by Product

✅ **Navigation structure** (pages, sidebar items)  
✅ **Content** (copy, workflows, data)  
✅ **Which templates you use**  
✅ **Layout composition** (how many cards, grids, lists per page)  
✅ **Data displayed** (customer-specific fields, custom statuses)  

### Not Allowed to Vary Without Updating the Standard

❌ **Fonts** (Space Grotesk headers + Inter body)  
❌ **Base palette** (cyan/purple/green brand colors, navy backgrounds)  
❌ **Core components** (button/card/input/list structure)  
❌ **Focus behavior** (cyan outline with glow)  
❌ **Touch targets** (minimum 40px height for interactive elements)  
❌ **Spacing scale** (4px baseline grid)  

### If You Need a New Component

1. **Try composition first** - Can you build it with existing components?
2. **Check for similar patterns** - Does another product have something close?
3. **Propose to Standard** - If truly needed, add it to `brand/topshelf.css` in this repo
4. **Document usage** - Add template to this file

────────────────────────────────────────
## 10) IMPLEMENTATION CHECKLIST
────────────────────────────────────────

When building a new page:

- [ ] Import `brand/topshelf.css` in your app
- [ ] Start with `ts-container` wrapper
- [ ] Add `ts-header` with title and actions
- [ ] Choose appropriate template (Dashboard, List, Detail, Form, Wizard)
- [ ] Use `ts-card` for content sections
- [ ] Use `ts-btn-primary` for main actions, `ts-btn-secondary` for others
- [ ] Use `ts-badge-*` for status indicators
- [ ] Use `ts-list` + `ts-list-item` for scannable content
- [ ] Add `ts-footer` at bottom
- [ ] Test keyboard navigation (tab through all interactive elements)
- [ ] Test mobile responsiveness (layouts stack at 768px)
- [ ] Verify color contrast meets WCAG AA

────────────────────────────────────────
## 11) SUPPORT & EVOLUTION
────────────────────────────────────────

### Questions or Issues?

- **Design System**: design@topshelfservice.com
- **Technical Implementation**: engineering@topshelfservice.com
- **Standards Repository**: github.com/top-shelf-service/standard

### Contributing New Patterns

1. Build prototype using existing components
2. Document use case and rationale
3. Submit PR to `standard` repo with:
   - New component CSS in `brand/topshelf.css`
   - Template in this `ui-usage.md` file
   - Example implementation
4. Get approval from Design & Engineering teams
5. Announce to all product teams

### Version History

- **v1.0.0** (2026-02-09): Initial release with core templates and nav patterns

────────────────────────────────────────

**You're doing it right.** This is the correct way to build a front-end system when you don't want to become a UI specialist: lock the brand primitives, provide templates, and keep app structure separate so content can vary safely.
