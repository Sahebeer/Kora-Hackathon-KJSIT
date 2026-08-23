# Kora LCA Platform - Developer Guidelines & Rules

All developers (including AI coding assistants) working on the SIH 25069 / Kora application must adhere strictly to these engineering rules.

## 1. Safety & Stability First
- **Do not break existing features**: Before making any modification, trace the entire file dependency graph and ensure existing calculations, API routes, database schemas, and visual components are preserved.
- **Minimal safe changes**: Implement the smallest possible diff that addresses the requirement or bug. Do not carry out large-scale or cosmetic refactoring unless explicitly requested.
- **Never modify unrelated modules**: Keep changes scoped strictly to the files directly responsible for the task at hand.

## 2. Real Logic over Fake Functionality
- **No hardcoding/mocking values to hide bugs**: If a UI component displays data (such as project count, circularity score, or emissions metrics), the displayed values MUST originate from the actual database/application state.
- **Trace from database to UI**: Always implement the complete flow:
  `Database (Mongoose schema) ──> Backend Query (Controller) ──> API Route ──> Frontend Request (Service) ──> React State (Component) ──> Rendered UI`

## 3. Workflow & Verification
- **Code Audit before coding**: Inspect existing implementation and trace the execution path before writing any new code.
- **Identify root cause before editing**: Do not patch symptoms. Find out *why* a variable is undefined, *why* a query returns empty, or *why* state does not update, and fix the source.
- **Test before claiming completion**: Run the application and check responses via manual scripts, Postman/curl, and browser console output. Never assume code works merely because it compiled.
- **Clean state setup**: Avoid persisting stale development states. Verify using new login sessions or force-refresh parameters.

## 4. Development Workflow Cycle
For every issue or feature request:
```
  1. Inspect existing code ──> 2. Identify root cause ──> 3. Plan changes ──> 4. Implement safely ──> 5. Verify & Test ──> 6. Update docs
```
