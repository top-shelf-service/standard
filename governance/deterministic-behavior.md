# Deterministic Behavior Guidelines

**PROPRIETARY AND CONFIDENTIAL**  
Copyright (c) 2026 Top Shelf Service LLC

## Overview

Deterministic behavior is a cornerstone of Top Shelf Service LLC's engineering and compliance standards. A system exhibits deterministic behavior when identical inputs always produce identical outputs, regardless of when or how many times the operation is performed.

## Why Determinism Matters

### 1. Compliance and Auditability

- Regulators require reproducible decisions
- Audit trails must be verifiable
- Historical analysis requires consistent behavior

### 2. Testing and Quality Assurance

- Reliable automated testing
- Reproducible bug reports
- Predictable system behavior

### 3. Customer Trust

- Consistent service delivery
- Explainable decisions
- Fair treatment across all clients

### 4. Debugging and Troubleshooting

- Issues can be reproduced reliably
- Root cause analysis is possible
- Fixes can be verified

## Core Principles

### Principle 1: Pure Functions

Functions should be pure: same input → same output, no side effects.

✅ **DO:**

```javascript
function calculateRiskScore(transaction) {
  return transaction.amount * 0.01 + transaction.riskFactors.length * 5;
}
```

❌ **DON'T:**

```javascript
let globalCounter = 0;
function calculateRiskScore(transaction) {
  globalCounter++; // Side effect!
  return transaction.amount + Math.random(); // Non-deterministic!
}
```

### Principle 2: Explicit Dependencies

All dependencies must be explicit inputs, not hidden state.

✅ **DO:**

```javascript
function processOrder(order, config, currentTime) {
  if (currentTime.hour >= config.businessHours.start) {
    return processImmediately(order);
  }
  return scheduleForLater(order, config.businessHours.start);
}
```

❌ **DON'T:**

```javascript
function processOrder(order) {
  const now = new Date(); // Hidden dependency!
  if (now.getHours() >= 9) {
    return processImmediately(order);
  }
  return scheduleForLater(order);
}
```

### Principle 3: No Hidden State

Avoid relying on mutable global state or external state changes.

✅ **DO:**

```javascript
function applyDiscount(order, discountRules) {
  for (const rule of discountRules) {
    if (matchesCondition(order, rule.condition)) {
      return applyDiscountRate(order, rule.rate);
    }
  }
  return order;
}
```

❌ **DON'T:**

```javascript
let currentPromotion = null; // Mutable global state
function applyDiscount(order) {
  if (currentPromotion && matchesCondition(order, currentPromotion)) {
    return applyDiscountRate(order, currentPromotion.rate);
  }
  return order;
}
```

### Principle 4: Time as an Input

Never use current system time implicitly; always pass time as parameter.

✅ **DO:**

```javascript
function isBusinessHours(timestamp, config) {
  const hour = new Date(timestamp).getHours();
  return hour >= config.startHour && hour < config.endHour;
}
```

❌ **DON'T:**

```javascript
function isBusinessHours(config) {
  const hour = new Date().getHours(); // Implicit time!
  return hour >= config.startHour && hour < config.endHour;
}
```

## Common Non-Deterministic Sources

### 1. Random Number Generation

❌ **Problem:**

```javascript
const transactionId = Math.random().toString(36).substring(7);
```

✅ **Solution:**

```javascript
// Use deterministic ID generation with provided seed/input
const transactionId = generateDeterministicId(transaction.timestamp, transaction.account);
```

### 2. Current Date/Time

❌ **Problem:**

```javascript
function isExpired(item) {
  return item.expiryDate < new Date();
}
```

✅ **Solution:**

```javascript
function isExpired(item, currentTime) {
  return item.expiryDate < currentTime;
}
```

### 3. Network Calls

❌ **Problem:**

```javascript
async function enrichData(data) {
  const apiResponse = await fetch("https://api.example.com/enrich");
  return { ...data, ...apiResponse.data };
}
```

✅ **Solution:**

```javascript
function enrichData(data, enrichmentData) {
  // Enrichment data passed as input
  return { ...data, ...enrichmentData };
}
```

### 4. Database Queries

❌ **Problem:**

```javascript
function processUser(userId) {
  const user = db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return calculateUserScore(user);
}
```

✅ **Solution:**

```javascript
function calculateUserScore(user) {
  // User data passed as input, not queried internally
  return user.transactions.length * 10 + user.reputation;
}
```

### 5. Filesystem Operations

❌ **Problem:**

```javascript
function loadConfig() {
  return JSON.parse(fs.readFileSync("/config/settings.json"));
}
```

✅ **Solution:**

```javascript
function processWithConfig(data, config) {
  // Config loaded once and passed as parameter
  return applyRules(data, config.rules);
}
```

### 6. Iteration Order of Maps/Sets

❌ **Problem:**

```javascript
function processMap(dataMap) {
  for (const [key, value] of dataMap) {
    // Iteration order not guaranteed in all environments
    process(value);
  }
}
```

✅ **Solution:**

```javascript
function processMap(dataMap) {
  const sortedKeys = Array.from(dataMap.keys()).sort();
  for (const key of sortedKeys) {
    process(dataMap.get(key));
  }
}
```

### 7. Parallel Processing

❌ **Problem:**

```javascript
async function processItems(items) {
  const results = await Promise.all(items.map(process));
  return results.reduce((acc, r) => acc + r.value, 0);
}
```

✅ **Solution:**

```javascript
async function processItems(items) {
  // Process sequentially or ensure order is maintained
  const results = [];
  for (const item of items) {
    results.push(await process(item));
  }
  return results.reduce((acc, r) => acc + r.value, 0);
}
```

## Handling Necessary Non-Determinism

Some operations inherently require non-deterministic elements (timestamps, IDs, external APIs). Handle these at system boundaries:

### Pattern 1: Dependency Injection

```javascript
class OrderProcessor {
  constructor(timeProvider, idGenerator, externalService) {
    this.timeProvider = timeProvider;
    this.idGenerator = idGenerator;
    this.externalService = externalService;
  }

  process(order) {
    const timestamp = this.timeProvider.now();
    const orderId = this.idGenerator.generate();
    const enriched = this.externalService.enrich(order);

    return processOrderDeterministically(order, timestamp, orderId, enriched);
  }
}
```

In production: inject real implementations
In tests: inject mock/fake implementations with fixed values

### Pattern 2: Boundary Layer

```javascript
// Boundary Layer (non-deterministic, thin)
async function handleRequest(request) {
  const currentTime = new Date();
  const userData = await fetchUserData(request.userId);
  const config = await loadConfiguration();

  // Core Logic (deterministic, testable)
  return processRequest(request, userData, config, currentTime);
}

// Core Logic (pure, deterministic)
function processRequest(request, userData, config, timestamp) {
  // All inputs explicit, fully testable
  // ...
}
```

### Pattern 3: Event Sourcing

```javascript
// Events captured at boundary with timestamp
const event = {
  type: "OrderPlaced",
  orderId: generateId(),
  timestamp: new Date(),
  data: orderData,
};

// Processing is deterministic replay of events
function processEvent(event) {
  // event.timestamp is input, not current time
  return applyBusinessRules(event.data, event.timestamp);
}
```

## Testing Deterministic Systems

### Unit Tests

```javascript
describe("calculateRiskScore", () => {
  it("produces consistent results", () => {
    const transaction = { amount: 1000, riskFactors: ["high_value"] };

    // Run multiple times
    const result1 = calculateRiskScore(transaction);
    const result2 = calculateRiskScore(transaction);
    const result3 = calculateRiskScore(transaction);

    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });

  it("same inputs always produce same output", () => {
    const transaction = { amount: 1000, riskFactors: ["high_value"] };
    const expected = 15; // 10 + 5

    for (let i = 0; i < 100; i++) {
      expect(calculateRiskScore(transaction)).toBe(expected);
    }
  });
});
```

### Property-Based Testing

```javascript
test("risk score is deterministic", () => {
  fc.assert(
    fc.property(
      fc.record({
        amount: fc.integer(),
        riskFactors: fc.array(fc.string()),
      }),
      (transaction) => {
        const result1 = calculateRiskScore(transaction);
        const result2 = calculateRiskScore(transaction);
        return result1 === result2;
      },
    ),
  );
});
```

## Documentation Requirements

All functions that must be deterministic should be documented:

```javascript
/**
 * Calculate risk score for a transaction.
 *
 * DETERMINISTIC: This function is deterministic and will always produce
 * the same output for the same input parameters.
 *
 * @param {Object} transaction - Transaction data
 * @param {number} transaction.amount - Transaction amount
 * @param {string[]} transaction.riskFactors - Risk factors present
 * @returns {number} Risk score (0-100)
 */
function calculateRiskScore(transaction) {
  // ...
}
```

## Code Review Checklist

When reviewing code for determinism:

- [ ] Are all time dependencies passed as parameters?
- [ ] Is random number generation avoided or properly seeded?
- [ ] Are external API calls isolated to boundary layer?
- [ ] Are database queries isolated from business logic?
- [ ] Does the function have side effects?
- [ ] Does iteration order matter? Is it consistent?
- [ ] Are global variables or shared mutable state used?
- [ ] Can this function be tested with fixed inputs?
- [ ] Is the function documented as deterministic or non-deterministic?

## Exceptions and Special Cases

### When Non-Determinism is Acceptable

1. **User-Facing IDs**: UUIDs for user-visible identifiers (tracking numbers, etc.)
2. **Security Tokens**: Random tokens, nonces, salts
3. **Performance Optimizations**: Cache keys, load balancing decisions (if not affecting correctness)
4. **Logging**: Log timestamps (if not used for business logic)

### Pseudo-Determinism

Sometimes "deterministic enough" is acceptable:

```javascript
// Seeded random for reproducible "randomness"
const seededRandom = new Random(transaction.id);
const shuffledItems = seededRandom.shuffle(items);
```

## Monitoring and Validation

### Runtime Assertions

```javascript
function processOrder(order, timestamp) {
  if (isDevelopment() || isTest()) {
    // Assert determinism by re-running
    const result1 = _processOrder(order, timestamp);
    const result2 = _processOrder(order, timestamp);
    assert.deepEqual(result1, result2, "processOrder must be deterministic");
    return result1;
  }
  return _processOrder(order, timestamp);
}
```

### Audit Logging

Log inputs and outputs for critical decisions:

```json
{
  "function": "calculateApprovalDecision",
  "inputs": {
    "amount": 50000,
    "riskScore": 75,
    "customerTier": "gold"
  },
  "output": {
    "decision": "APPROVED",
    "approver": "AUTO",
    "confidence": 0.95
  },
  "timestamp": "2026-02-09T20:00:00Z",
  "version": "1.2.3"
}
```

This enables:

- Replaying decisions later
- Verifying historical decisions
- Detecting unintended changes in behavior

## Benefits Summary

1. **Testability**: Easy to write comprehensive tests
2. **Debuggability**: Issues can be reliably reproduced
3. **Auditability**: Decisions can be verified and explained
4. **Predictability**: System behavior is consistent
5. **Scalability**: Can be parallelized safely
6. **Maintainability**: Changes don't introduce subtle bugs

## Related Documents

- [Engine vs Fuel](engine-vs-fuel.md)
- [Escalation Rules](escalation-rules.md)
- [Compliance Architecture](compliance-architecture.md)
- [AI Agent Decision Trees](../ai-agent/README.md)

## Revision History

- v1.0.0 (2026-02-09): Initial version
