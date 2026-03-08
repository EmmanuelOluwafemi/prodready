# Security Policy

> These rules MUST be followed at all times. No exceptions.
> This applies to all code written by humans and AI agents.

---

## 1. Secrets & Credentials Management

### MUST FOLLOW
- NEVER hardcode API keys, secrets, tokens, database URLs, or credentials
  anywhere in the codebase — not in source files, not in comments,
  not in test files
- ALWAYS use environment variables for local development
- ALWAYS use a dedicated secrets manager in production:
  - Doppler (recommended for small teams)
  - AWS Secrets Manager
  - HashiCorp Vault
  - Infisical (open source option)
- NEVER commit `.env` files to version control
- ALWAYS add `.env`, `.env.local`, `.env.production` to `.gitignore`
  before the first commit
- Rotate any secret that has been accidentally exposed immediately —
  treat exposure as a confirmed breach, not a maybe
- Use separate secrets for development, staging, and production —
  never share production secrets with development environments

### Examples of secrets that must never be hardcoded
- Database connection strings
- API keys (OpenAI, Stripe, Twilio, SendGrid, etc.)
- JWT signing secrets
- OAuth client secrets
- AWS/GCP/Azure credentials
- Private keys and certificates
- Webhook signing secrets

---

## 2. Input Validation & Sanitisation

### MUST FOLLOW
- ALWAYS validate every input from users, third-party APIs, webhooks,
  and external systems before processing or storing it
- Validate on the SERVER — never trust client-side validation alone
- Use a schema validation library:
  - Zod (TypeScript/JavaScript — recommended)
  - Joi (JavaScript)
  - Pydantic (Python)
  - Marshmallow (Python)
- Validate data type, format, length, range, and allowed values
- Reject requests that fail validation with a 400 status and a clear
  error message — never silently accept malformed data
- NEVER pass user input directly into:
  - Database queries (use parameterised queries or an ORM)
  - Shell commands
  - File paths
  - HTML output without escaping (prevents XSS)
  - LLM prompts without sanitisation (prevents prompt injection)

### Parameterised query example (correct)
```sql
SELECT * FROM users WHERE email = $1
```

### String concatenation (never do this)
```sql
SELECT * FROM users WHERE email = '${userInput}'
```

---

## 3. Error Handling & Information Exposure

### MUST FOLLOW
- NEVER return stack traces, internal error messages, file paths,
  database schema details, or server configuration in API responses
- Return generic, user-safe error messages to clients
- Log full error details server-side with a reference ID
- Return the reference ID to the client so users can report issues
- Use consistent error response shapes across the entire API
- NEVER expose which part of a login failed
  (do not say "email not found" or "wrong password" — say
  "invalid credentials" for both)
- Handle all promise rejections and async errors —
  unhandled rejections crash Node.js processes in production

### Correct error response shape
```json
{
  "error": {
    "message": "An unexpected error occurred",
    "code": "INTERNAL_ERROR",
    "reference": "err_01HXYZ123"
  }
}
```

---

## 4. Rate Limiting

### MUST FOLLOW
- ALWAYS enforce rate limiting on:
  - Login endpoints
  - Registration endpoints
  - Password reset endpoints
  - Magic link / OTP endpoints
  - Payment endpoints
  - AI inference / LLM endpoints (these are expensive to abuse)
  - Any endpoint that sends an email or SMS
  - Any endpoint that performs a write operation
- Implement rate limiting at the infrastructure level where possible
  (Cloudflare, AWS WAF, Nginx) — not only in application code
- Use a sliding window algorithm, not a fixed window, to prevent
  burst attacks at window boundaries
- Return HTTP 429 with a `Retry-After` header when rate limit is hit
- Rate limit by IP address AND by user account —
  authenticated users can still abuse endpoints
- Consider stricter limits for unauthenticated requests

### Recommended libraries
- `express-rate-limit` + `rate-limit-redis` (Node.js)
- `slowapi` (Python/FastAPI)
- Upstash Ratelimit (serverless environments)

---

## 5. Security Headers

### MUST FOLLOW
- Set the following HTTP security headers on every response:

| Header | Recommended Value |
|--------|------------------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disable features you don't use |
| `Content-Security-Policy` | Define allowed sources explicitly |

- Use `helmet` middleware in Express/Node.js apps
- Verify headers are set correctly using https://securityheaders.com
- NEVER disable HTTPS in production
- ALWAYS redirect HTTP to HTTPS
- Set `Secure` and `HttpOnly` flags on all cookies
- Set `SameSite=Strict` or `SameSite=Lax` on cookies to
  prevent CSRF attacks
- NEVER use `SameSite=None` unless cross-site cookie sharing
  is explicitly required

---

## 6. Dependency Security

### MUST FOLLOW
- Run `npm audit` or `pip audit` regularly and before every release
- Enable Dependabot or Snyk to automatically flag vulnerable dependencies
- Never ignore high or critical severity vulnerabilities without a
  documented reason and a remediation timeline
- Check the license of every dependency — GPL dependencies in a
  commercial product can create legal obligations
- Prefer well-maintained packages with recent commits and active
  maintainers over abandoned ones with more stars

---

## 7. AI-Specific Security (LLM-powered apps)

### MUST FOLLOW
- NEVER inject raw user input directly into LLM prompts —
  sanitise and validate first to prevent prompt injection attacks
- NEVER include sensitive data (PII, secrets, payment info)
  in prompts sent to third-party LLM APIs
- Treat LLM output as untrusted user input —
  validate and sanitise before rendering or acting on it
- Implement guardrails to prevent the model from being instructed
  to ignore your system prompt
- Log AI requests and responses for audit purposes but strip
  any PII before storing logs
- Apply rate limiting to all AI inference endpoints —
  LLM APIs are expensive and a common target for abuse
