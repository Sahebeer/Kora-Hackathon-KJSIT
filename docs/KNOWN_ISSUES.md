# Kora LCA Platform - Known Issues & Diagnostics

This document lists verified issues and bugs in the platform, providing root cause analysis, severity, and files affected.

## 1. Dashboard Trend Charts & Monthly Aggregation
- **Symptom**: Dashboard monthly trends charts show empty fields, and monthly performance comparisons show 0% changes even though workflows exist.
- **Root Cause**: The controllers `getMonthlyTrends` and `getPerformanceSummary` query the legacy `Project` model using:
  ```javascript
  const trends = await Project.aggregate([...])
  ```
  Since all active user projects are stored inside the `CopperWorkflow` and `WizardWorkflow` collections instead of `Project`, the aggregation yields 0 results.
- **Affected Files**: `server/src/controllers/dashboardController.js` (lines 222-397)
- **Severity**: Medium
- **Status**: Verified

## 2. Playwright Browser Driver Download Timeout (Local Dev Only)
- **Symptom**: Local Playwright test environment cannot launch browser pages, returning 404 errors when trying to install driver packages for macOS ARM64.
- **Root Cause**: Playwright driver registry mirrors returned 404 Not Found response codes for the requested version (1.57.0) on macOS ARM64.
- **Affected Files**: Local Node dev dependencies
- **Severity**: Low (Does not impact production runtime execution)
- **Status**: Verified
