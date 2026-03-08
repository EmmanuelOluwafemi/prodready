export const TEMPLATES = [
  {
    id: 'SECURITY',
    filename: 'SECURITY.md',
    title: 'Security',
    description: 'Secrets management, input validation, rate limiting, security headers, AI-specific security',
    checks: [
      { id: 'no-hardcoded-secrets', label: 'No hardcoded secrets', weight: 15 },
      { id: 'input-validation', label: 'Input validation library present', weight: 10 },
      { id: 'rate-limiting', label: 'Rate limiting configured', weight: 10 },
      { id: 'security-headers', label: 'Security headers configured', weight: 5 },
      { id: 'env-gitignore', label: '.env in .gitignore', weight: 10 },
    ],
  },
  {
    id: 'PRIVACY',
    filename: 'PRIVACY.md',
    title: 'Privacy & Compliance',
    description: 'Data minimisation, user deletion, PII in logs, cookie consent, GDPR compliance',
    checks: [
      { id: 'privacy-policy', label: 'Privacy policy exists', weight: 5 },
      { id: 'no-pii-logs', label: 'No PII in log statements', weight: 10 },
      { id: 'data-deletion', label: 'Data deletion mechanism documented', weight: 5 },
    ],
  },
  {
    id: 'AUTHENTICATION',
    filename: 'AUTHENTICATION.md',
    title: 'Authentication',
    description: 'Password hashing, token expiry, email verification, passkeys, RBAC',
    checks: [
      { id: 'password-hashing', label: 'Secure password hashing (bcrypt/argon2)', weight: 15 },
      { id: 'no-plain-passwords', label: 'No plain text passwords in code', weight: 15 },
      { id: 'jwt-secret', label: 'JWT secret from environment variable', weight: 10 },
    ],
  },
  {
    id: 'PAYMENTS',
    filename: 'PAYMENTS.md',
    title: 'Payments & Billing',
    description: 'Payment data security, webhook verification, dunning, receipts, cancellation',
    checks: [
      { id: 'no-card-storage', label: 'No card numbers in codebase', weight: 15 },
      { id: 'webhook-verification', label: 'Webhook signature verification present', weight: 10 },
    ],
  },
  {
    id: 'RELIABILITY',
    filename: 'RELIABILITY.md',
    title: 'Reliability & Monitoring',
    description: 'Error monitoring, database backups, uptime monitoring, deployment, logging',
    checks: [
      { id: 'error-monitoring', label: 'Error monitoring configured (Sentry/etc)', weight: 10 },
      { id: 'health-endpoint', label: 'Health check endpoint exists', weight: 5 },
      { id: 'env-example', label: '.env.example file exists', weight: 5 },
    ],
  },
  {
    id: 'ACCESSIBILITY',
    filename: 'ACCESSIBILITY.md',
    title: 'Accessibility',
    description: 'WCAG 2.2 AA — images, keyboard nav, colour contrast, semantic HTML, forms',
    checks: [
      { id: 'no-outline-none', label: 'No outline: none without replacement', weight: 5 },
      { id: 'semantic-html', label: 'Semantic HTML elements used', weight: 5 },
    ],
  },
  {
    id: 'UX-STATES',
    filename: 'UX-STATES.md',
    title: 'UX States',
    description: 'Empty states, loading states, error states, confirmation dialogs, success feedback',
    checks: [
      { id: 'loading-states', label: 'Loading state patterns present', weight: 5 },
      { id: 'error-boundaries', label: 'Error boundaries implemented (React)', weight: 5 },
    ],
  },
  {
    id: 'API-DESIGN',
    filename: 'API-DESIGN.md',
    title: 'API Design',
    description: 'Versioning, pagination, consistent responses, idempotency, data exposure',
    checks: [
      { id: 'api-versioning', label: 'API routes include version prefix', weight: 5 },
      { id: 'pagination', label: 'List endpoints use pagination', weight: 5 },
    ],
  },
  {
    id: 'EMAIL',
    filename: 'EMAIL.md',
    title: 'Email & Communications',
    description: 'SPF/DKIM/DMARC, unsubscribe links, sending infrastructure, link expiry',
    checks: [
      { id: 'no-passwords-in-email', label: 'No passwords sent in email body', weight: 5 },
      { id: 'email-provider', label: 'Email sending service configured', weight: 5 },
    ],
  },
  {
    id: 'DOCUMENTATION',
    filename: 'DOCUMENTATION.md',
    title: 'Documentation',
    description: 'README, code comments, changelog, environment variables, architecture records',
    checks: [
      { id: 'readme', label: 'README.md exists', weight: 5 },
      { id: 'env-example-docs', label: '.env.example exists with documented variables', weight: 5 },
      { id: 'changelog', label: 'CHANGELOG.md exists', weight: 5 },
    ],
  },
];

export const TOTAL_WEIGHT = TEMPLATES.reduce(
  (sum, t) => sum + t.checks.reduce((s, c) => s + c.weight, 0),
  0
);
