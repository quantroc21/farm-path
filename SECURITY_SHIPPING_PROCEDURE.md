# Standard Operating Procedure (SOP): Web Security Shipping Checklist

This document serves as the official security baseline for deploying web applications at Daklink. It compiles all security enhancements that must be applied to every project, moving foundational security from "future debt" to "Day 1 requirements."

---

## Part 1: Mandatory Day-1 Security Requirements ✅
*These measures must be active on every project before it goes live to production.*

### 1. Secrets Management & Bundle Safety
- **Environment Isolation:** Database tokens, API Keys, and third-party secrets must never use frontend-exposed prefixes (e.g., `VITE_` or `REACT_APP_`).
- **Backend-Only Execution:** Secrets are strictly loaded via `process.env` on the Node.js server.
- **Verification:** The build output (`dist/`) must be verified to ensure no raw tokens are compiled into the public Javascript.

### 2. Fast-Failing Input Validation (Zod Middleware)
- **Centralized Schema Enforcement:** Manual `if/else` type checking is banned for complex routes. Every route must use a validation middleware (e.g., Zod) to intercept, type-check, and sanitize incoming data (`req.body`, `req.query`, `req.params`) *before* it reaches the controller logic.
- **Auto-Sanitization:** Use built-in schema methods (like `.trim()`) to clean input data automatically.
- **Fail Fast:** Reject malformed payloads immediately with a clean `400 Bad Request` structure to protect database compute cycles.

### 3. HTTP Security & Origin Protection
- **Strict CORS Rules:** Never leave `app.use(cors())` open. You must explicitly whitelist allowed production domains.
  ```javascript
  const allowedOrigins = ['https://daklink.vn', 'https://app.daklink.vn'];
  app.use(cors({ origin: allowedOrigins }));
  ```
- **Helmet Headers:** Every Express app must implement `helmet()` to instantly shield against Clickjacking, MIME-type sniffing, and enforce strict HTTPS routing.

### 4. Database Safety: Query Parameterization
- **Strict Parameterization:** All SQL queries (e.g., Turso/LibSQL) must use parameterized inputs or an ORM.
  - **APPROVED:** `client.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] })`
  - **BANNED:** `client.execute('SELECT * FROM users WHERE id = ' + userId)` (Highly vulnerable to SQL Injection).

### 5. Resource Protection & Rate Limiting
- **Global Network Shield:** General traffic is capped (e.g., 200 requests/15 mins) to prevent DDoS.
- **Targeted Shielding:** High-cost APIs (Gemini) and sensitive endpoints (Login, Order Creation) are aggressively limited (e.g., 5-10 requests/15 mins).
- **Payload Limits:** The JSON body parser is restricted (`express.json({ limit: '2mb' })`) to prevent Node.js memory exhaustion from massive payload injections.

---

## Part 2: Advanced Monitoring & Architecture (Phase 2) ⚠️
*Once Day-1 security is established, prioritize these architectural shifts.*

### 1. Security Logging & Alerting
- **Visibility:** Rate limiters silently block attackers, but the engineering team remains blind. Implement a logging mechanism (e.g., Winston, Sentry, or basic webhook alerts) to trigger notifications when rate limits are repeatedly hit, allowing proactive IP blocking.

### 2. Secure Token Storage
- **httpOnly Cookies:** Transition from storing JWTs in browser `localStorage` (vulnerable to XSS) to `httpOnly` and `Secure` cookies.

### 3. CI/CD Security Automation
- Implement GitHub Actions with Dependabot to auto-patch vulnerable npm packages, and utilize GitHub Secrets so developers never manually touch production `.env` files via SSH.
