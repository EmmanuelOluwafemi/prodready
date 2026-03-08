# Documentation Standards

> These rules MUST be followed at all times.
> Good documentation is part of the product, not an afterthought.

---

## 1. README

### MUST FOLLOW
- EVERY repository must have a README.md at the root
- A README must enable a developer who has never seen
  the project before to get it running locally in under 10 minutes
- Test your README on someone unfamiliar with the project —
  if they get stuck, the README is incomplete

### Required README sections

**Project name and description**
- What does this project do?
- Who is it for?
- What problem does it solve?

**Prerequisites**
- Required software and versions (Node.js 20+, Python 3.11+, etc.)
- Required accounts or access (AWS account, Stripe account, etc.)

**Local setup**
- Step-by-step commands to get running locally
- Must work on macOS and Linux at minimum
- Document Windows differences if known

**Environment variables**
- List every environment variable
- Provide an .env.example file with all variables
  and example/placeholder values
- Explain what each variable is for

**Running the project**
- How to start the development server
- How to run tests
- How to run linting and type checking

**Deployment**
- How to deploy to staging and production
- Any manual steps required

**Architecture overview**
- Brief description of how the system is structured
- Link to more detailed architecture documentation if it exists

---

## 2. Code Comments

### MUST FOLLOW
- Comment code to explain WHY, not WHAT —
  the code itself shows what it does;
  the comment explains why it does it that way

- Bad comment (explains what):
```javascript
// Multiply by 1000
const ms = seconds * 1000;
```

- Good comment (explains why):
```javascript
// Convert to milliseconds because the third-party
// payment library expects timestamps in ms, not seconds
const ms = seconds * 1000;
```

- Always add a comment when you:
  - Write a workaround for a third-party bug or limitation
    (include a link to the issue)
  - Use a non-obvious algorithm or data structure
  - Write intentionally complex code that cannot be simplified
  - Implement a business rule that is not obvious from the code
  - Make a security-sensitive decision

- Use TODO comments for known issues —
  include your name/initials and a ticket reference:
```javascript
// TODO(jsmith): Replace with paginated query — TICKET-123
```

- Prune stale and outdated comments —
  a wrong comment is worse than no comment

- Document all exported functions, classes, and modules
  with JSDoc (JavaScript/TypeScript) or docstrings (Python):

```typescript
/**
 * Calculates the prorated amount for a mid-cycle plan upgrade.
 *
 * @param currentPlanPrice - Monthly price of the current plan in cents
 * @param newPlanPrice - Monthly price of the new plan in cents
 * @param daysRemaining - Days remaining in the current billing period
 * @param totalDaysInPeriod - Total days in the billing period
 * @returns Proration amount in cents to charge immediately
 */
function calculateProration(
  currentPlanPrice: number,
  newPlanPrice: number,
  daysRemaining: number,
  totalDaysInPeriod: number
): number
```

---

## 3. Changelog

### MUST FOLLOW
- Maintain a CHANGELOG.md at the root of the repository
- Follow the Keep a Changelog format (https://keepachangelog.com)
- Update the changelog with EVERY release — no exceptions
- Each release entry must include:
  - Version number (follow Semantic Versioning: MAJOR.MINOR.PATCH)
  - Release date
  - Changes categorised as:

| Category | Use for |
|----------|---------|
| Added | New features |
| Changed | Changes to existing functionality |
| Deprecated | Features that will be removed in a future release |
| Removed | Removed features |
| Fixed | Bug fixes |
| Security | Security fixes — always call these out explicitly |

- Never delete or modify old changelog entries
- Keep an [Unreleased] section at the top for
  changes not yet released

### Changelog entry example
```markdown
## [1.4.0] - 2025-03-01

### Added
- Two-factor authentication via authenticator app
- CSV export for all data tables

### Fixed
- Fixed an issue where password reset emails were not
  being sent to addresses with special characters

### Security
- Updated jsonwebtoken to resolve CVE-2024-XXXXX
```

---

## 4. Environment Variables

### MUST FOLLOW
- Document every environment variable the application requires
- Provide an .env.example file committed to version control
  with all variables present but with placeholder values —
  NEVER commit an .env file with real values
- For every environment variable, document:
  - Name
  - Purpose (what does it do?)
  - Required or optional
  - Example value or format
  - Where to obtain the value
  - Environment-specific notes

### .env.example format
```bash
# Database
# Your PostgreSQL connection string
# Required in all environments
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# Authentication
# Secret key used to sign JWTs — use a random 256-bit string
# Required in all environments
# Generate with: openssl rand -base64 32
JWT_SECRET=your-secret-here

# Stripe
# Your Stripe secret key — use test key (sk_test_) for development
STRIPE_SECRET_KEY=sk_test_yourstripekey
STRIPE_WEBHOOK_SECRET=whsec_yourwebhooksecret

# Email
# Your Resend API key
RESEND_API_KEY=re_yourresendkey
```

- Validate all required environment variables at application startup —
  fail fast with a clear error message if any are missing:
```javascript
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## 5. Architecture & Decision Records

### MUST FOLLOW
- Record significant architectural decisions as
  Architecture Decision Records (ADRs)
- Store ADRs in a /docs/decisions/ directory in the repository
- Write an ADR whenever you:
  - Choose a technology, framework, or library (and why)
  - Make a database design decision
  - Design an authentication or security approach
  - Make a tradeoff between competing approaches
  - Integrate a third-party service
  - Integrate an AI model or LLM API
  - Decide NOT to do something that seems obvious

### ADR format
```markdown
# ADR-001: Use Postgres over MongoDB

## Status
Accepted

## Date
2025-01-15

## Context
We need a database for the core product.
We considered Postgres and MongoDB.

## Decision
We will use PostgreSQL via Supabase.

## Reasons
- Our data is relational by nature (users, projects, memberships)
- Postgres offers Row Level Security which simplifies our
  authorisation model significantly
- Team has more experience with SQL than document databases

## Consequences
- We need to design our schema carefully upfront
- Schema migrations require care in production
- We benefit from strong ACID guarantees and mature tooling
```

- For every AI model or LLM API the application depends on, document:
  - Which model or API is used (e.g. OpenAI GPT-4o, Anthropic Claude)
  - What feature it powers
  - What happens if the API is unavailable (fallback behaviour)
  - What data is sent to the API (for privacy compliance)
  - Cost implications at scale
  - The model version pinned and the date it was last reviewed
- Review LLM-dependent features when models are updated —
  model updates can change behaviour silently
