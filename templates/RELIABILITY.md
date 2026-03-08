# Reliability & Monitoring Standards

> These rules MUST be followed at all times.
> Applies to all production environments.

---

## 1. Error Monitoring

### MUST FOLLOW
- Set up error monitoring BEFORE going to production —
  not after the first incident
- Recommended tools:
  - Sentry (most widely used, generous free tier)
  - BetterStack (logs + uptime in one)
  - Highlight.io (open source option)
- Capture:
  - All unhandled exceptions
  - All unhandled promise rejections
  - All 500-level HTTP responses
  - Client-side JavaScript errors
- Group errors by type and frequency —
  fix the most frequent errors first, not the most recent
- Set up alerts for new error types and error rate spikes
- Include enough context in errors to diagnose without
  needing to reproduce locally:
  - User ID (not email — use anonymised ID)
  - Request path and method
  - Relevant request parameters (scrub PII first)
  - Stack trace
  - Environment
- NEVER capture PII, passwords, or payment data in error events
- Resolve or acknowledge errors within your defined SLA

---

## 2. Database Backups

### MUST FOLLOW
- Back up your database EVERY DAY —
  more frequently for high-write production systems
- Test restores regularly —
  an untested backup is not a backup, it is a hope
- Restore test schedule:
  - Automated restore test: monthly minimum
  - Manual restore drill: quarterly
- Store backups in a geographically separate location
  from your primary database
- Retain backups for a minimum of 30 days
- Encrypt backups at rest
- Document the restore procedure step-by-step —
  an incident is the wrong time to figure this out
- For managed databases (Supabase, PlanetScale, Railway, Neon),
  verify what is included in your plan's backup policy —
  do not assume backups are enabled by default
- NEVER rely solely on your hosting provider's backups —
  maintain your own independent backup process

---

## 3. Uptime Monitoring

### MUST FOLLOW
- Monitor uptime from an external service —
  not from within your own infrastructure
- Recommended tools:
  - BetterStack
  - UptimeRobot (free tier available)
  - Checkly
  - Pagerduty
- Monitor at minimum:
  - Your main application URL
  - Your API health endpoint (/health or /api/health)
  - Your authentication endpoint
  - Any critical third-party integrations you depend on
- Alert within 2 minutes of downtime
- Define who gets alerted and how (email, SMS, Slack, PagerDuty)
- Create a status page so users can check during incidents:
  - BetterStack provides hosted status pages
  - Instatus is a good alternative
- Implement a /health endpoint that checks:
  - Database connectivity
  - Redis/cache connectivity (if used)
  - Key service dependencies
  - Returns 200 if healthy, 503 if degraded

---

## 4. Deployment & Environments

### MUST FOLLOW
- NEVER deploy directly to production from a local machine
  or without a review step
- Maintain at minimum:
  - Development — local developer machines
  - Staging — mirrors production as closely as possible
  - Production — live user traffic
- Staging environment must use:
  - A copy of the production database schema
    (not necessarily production data)
  - Production-equivalent infrastructure (not a smaller tier)
  - Separate API keys and credentials from production
- Use a CI/CD pipeline for all deployments:
  - Run tests before deploying
  - Run linting and type checking before deploying
  - Require passing checks before merge to main
- Implement zero-downtime deployments where possible
- Maintain a rollback procedure for every deployment —
  know before you deploy how to revert if something breaks
- Use feature flags for large changes —
  deploy code dark before enabling it for users

---

## 5. Logging Standards

### MUST FOLLOW
- Log ENOUGH to reconstruct what happened during an incident —
  but not so much that logs are unusable noise
- ALWAYS log:
  - Application start and shutdown
  - Every HTTP request (method, path, status code, duration)
  - Authentication events (login, logout, failed login, MFA)
  - All admin actions
  - Payment events
  - Errors and exceptions with full context
  - Background job start, completion, and failure
- NEVER log:
  - Passwords or password reset tokens
  - API keys or secrets
  - Full credit card numbers or CVV
  - PII (email, name, phone, IP address — use anonymised IDs)
  - Full request bodies (redact sensitive fields)
  - LLM prompt inputs or outputs that contain user data
  - Session tokens or refresh tokens
- Use structured logging (JSON format) — not plain text strings
- Recommended logging libraries:
  - pino (Node.js — very fast)
  - winston (Node.js)
  - structlog (Python)
- Set a log retention policy —
  30–90 days for application logs is typical
- Restrict log access to those who need it

---

## 6. Incident Response

### MUST FOLLOW
- Define and document your incident response process
  before an incident occurs
- Classify incidents by severity:

| Severity | Definition | Response Time |
|----------|-----------|---------------|
| P0 | Full outage, data loss, security breach | Immediate |
| P1 | Major feature broken, significant data issue | Within 1 hour |
| P2 | Partial degradation, workaround exists | Within 4 hours |
| P3 | Minor issue, cosmetic bug | Next working day |

- During an incident:
  1. Acknowledge — confirm someone is investigating
  2. Communicate — update status page
  3. Mitigate — restore service even if root cause unknown
  4. Resolve — fix root cause
  5. Review — conduct a post-mortem
- Write a post-mortem for every P0 and P1 incident —
  focus on systems and processes, not blame
- Post-mortem must include:
  - Timeline of events
  - Root cause
  - Impact assessment
  - What went well
  - What went wrong
  - Action items with owners and deadlines
