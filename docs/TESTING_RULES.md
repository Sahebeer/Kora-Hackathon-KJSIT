# Kora LCA Platform - Testing Guidelines & Procedures

This document outlines standard testing procedures to verify the correctness, state flow, and performance of the Kora application.

## 1. Starting the Application

### Backend Service
Start the backend Express server:
```bash
cd server
npm run dev
# Or to start in production/normal mode:
npm run start
```
- **Port**: `5001`
- **Output**: Logs database connectivity status and initialized REST endpoints.

### Frontend Client
Start the Vite development server:
```bash
cd client
npm run dev
```
- **Port**: `5173` (accessible at `http://localhost:5173`)

---

## 2. Testing Procedures

### A. Database Verification
Since MongoDB shell (`mongosh`) might not be universally available on development boxes, check database documents using direct Mongoose scripts:
```bash
cd server
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sih69').then(async () => {
  const db = mongoose.connection.db;
  console.log('Wizard workflows:', await db.collection('wizardworkflows').countDocuments());
  console.log('Copper workflows:', await db.collection('copperworkflows').countDocuments());
  console.log('Users:', await db.collection('users').countDocuments());
  mongoose.disconnect();
});
"
```

### B. API Testing Procedure
Test Express routes via `curl` utilizing a valid JWT token generated for `hashim@example.com`.

1. **Generate Token**:
```bash
node -e "
const jwt = require('jsonwebtoken');
console.log(jwt.sign({ userId: 'USER_ID_HERE', email: 'hashim@example.com' }, 'sih69_development_jwt_secret_key_change_in_production'));
"
```
2. **Execute GET /api/dashboard**:
```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:5001/api/dashboard?forceRefresh=true"
```

### C. Frontend Browser & Console Inspection
1. Open Chrome DevTools (`Cmd + Option + I` or `F12`).
2. **Network Tab**: Inspect `/api/dashboard`, `/api/wizard/workflows`, and `/api/lca/reports` payloads. Check for 401/403/500 errors.
3. **Application Tab**: Check `sessionStorage` for `accessToken`, `refreshToken`, and `user` JSON payload. Check `localStorage` for wizard IDs.
4. **Console Tab**: Verify no uncaught runtime errors (e.g., `Can't find variable` or `isCalculatingLca undefined`).

---

## 3. Important Diagnostic Test Scripts

Run specific backend workflow tests to verify controller validation logic:
- **Test recycling metrics integration**: `node server/scripts/testRecyclingStep.js`
- **Test wizard workflow update**: `node server/scripts/testMiningStepUpdate.js`
- **Test reports API**: `node server/scripts/testReportsAPI.js`
- **Test PDF exports**: `node server/scripts/testPdfExport.js`

---

## 4. Critical User Flows for Manual Verification

1. **Auth Cycle**: Login (with seeded accounts) ──> Redirect to Dashboard.
2. **Dashboard Project Sync**: Ensure project count changes dynamically after creating a new wizard workflow or submitting a step.
3. **Multi-Stage Wizard Flow**:
   - Fill and save mining step.
   - Click "AI Predict" to populate blank fields.
   - Advance through stages up to Recycling.
4. **Interactive Canvas**: Navigate to `/canvas`. Modify recycling rates or input streams. Ensure flow values recalculate and update node state.
5. **LCA Calculation & PDF Generation**:
   - Complete all required fields.
   - Click "Calculate LCA".
   - Confirm calculations finish.
   - Download the generated PDF and verify layout formatting.
