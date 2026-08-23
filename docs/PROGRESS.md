# Kora LCA Platform - Development Progress

This document tracks the current readiness state of the various components of the Kora application.

## 1. Working
- **Backend Core**: Express routing, CORS, Compression, and sanitization middleware.
- **User Authentication & Session Lifecycle**: JWT token issue, refresh token rotation, and sessionStorage persistence on client side.
- **LCA Multi-Step Wizard**: Copper and Aluminium data collection steps, validation, and AI prediction fallback generation.
- **Process Canvas Integration**: Rendering of process nodes, connections, and parameter modification handlers.
- **Dashboard Aggregation Engine**: Live aggregation of `CopperWorkflow`, `WizardWorkflow`, and `Project` records, showing accurate count and cumulative circularity score.
- **Calculation & PDF Engine**: Server-side PDF layout generation and document downloading.
- **Alchemy Lab**: Interface category sorting and filtering toggles.
- **Analytics Section**: Dynamic Mongoose parameter extraction and empty/insufficient data states rendering.


## 2. Partially Working
- **Dashboard Monthly Trends / Charts**:
  - The aggregation query for monthly trends (`GET /api/dashboard/trends` and `GET /api/dashboard/performance`) still queries the legacy `Project` collection rather than combining `CopperWorkflow` and `WizardWorkflow`. This causes the trend charts to remain empty even when workflows exist.

## 3. Broken
- None.

## 4. Not Implemented
- None.

## 5. Needs Verification
- **External Gemini API Integration**: The platform operates on the custom rule-based fallback generator since the `GEMINI_API_KEY` is not set in development `.env`. Integration needs verification once a valid key is provided.
