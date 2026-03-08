# Authentication Standards

> These rules MUST be followed at all times.
> Applies to all authentication and session management code.

---

## 1. Password Storage

### MUST FOLLOW
- ALWAYS hash passwords before storing them
- NEVER store passwords in plain text, encrypted text,
  or weak hashes (MD5, SHA-1, SHA-256 without salt)
- Use one of these algorithms ONLY:
  - bcrypt — work factor of 12 or higher
  - argon2id — recommended as of 2024 (OWASP recommendation)
    - Memory: 64MB minimum
    - Iterations: 3 minimum
    - Parallelism: 4
  - scrypt — acceptable if argon2 is unavailable
- NEVER roll your own password hashing — use a battle-tested library
- NEVER compare passwords with == —
  use constant-time comparison functions to prevent timing attacks
- If migrating from a weak hashing algorithm,
  rehash on next login — do not force a mass password reset

### Minimum password requirements
- Minimum 8 characters (NIST SP 800-63B — length matters more than complexity)
- No maximum length below 64 characters
- Check against a list of known compromised passwords
  (use the HaveIBeenPwned API or a local breach list)
- Do not require special characters — it does not improve security
  and leads to worse passwords (NIST guidance)
- Do not expire passwords on a schedule — only on confirmed compromise

---

## 2. Token & Session Management

### MUST FOLLOW
- ALWAYS set expiry on every token and session
- Recommended expiry windows:

| Token Type | Recommended Expiry |
|------------|-------------------|
| Access token (JWT) | 15 minutes |
| Refresh token | 7–30 days |
| Password reset link | 1 hour |
| Magic link | 15 minutes |
| Email verification link | 24 hours |
| Invite link | 7 days |
| Session cookie | 7–30 days (sliding) |

- Refresh tokens MUST rotate on use —
  issue a new refresh token every time one is used
  and invalidate the old one
- Implement refresh token reuse detection —
  if an already-used token is presented, invalidate all sessions
  for that user immediately (indicates token theft)
- NEVER store sensitive tokens in localStorage —
  use httpOnly cookies for refresh tokens
- Access tokens may be stored in memory (not localStorage)
- Provide a "sign out all devices" option that revokes
  all refresh tokens for a user
- On password change, invalidate all existing sessions
- On account deletion, invalidate all existing sessions immediately

---

## 3. Email Verification

### MUST FOLLOW
- ALWAYS verify email addresses before granting full account access
- Send a verification email immediately on registration
- The verification link must:
  - Expire after 24 hours
  - Be single-use
  - Use a cryptographically random token
    (not sequential IDs or predictable values)
- Until verified, restrict the account from:
  - Accessing paid features
  - Inviting other users
  - Making purchases
- Provide a way to resend the verification email
  with rate limiting (max 3 resends per hour)
- On email address change:
  - Send a verification email to the NEW address
  - Send a notification email to the OLD address
  - Do not update the email until the new address is verified

---

## 4. Passkeys & Multi-Factor Authentication

### MUST FOLLOW
- Offer passkeys (WebAuthn/FIDO2) as a primary
  authentication method — they are phishing-resistant and
  the modern standard supported by Apple, Google, and Microsoft
- If passkeys are not yet implemented, offer TOTP MFA
  via an authenticator app (Google Authenticator, Authy, 1Password)
- NEVER use SMS as the only MFA option —
  SMS is vulnerable to SIM swapping attacks
- If SMS OTP is offered, it must be an option alongside
  a stronger method, not the only option
- Provide backup codes when MFA is enabled:
  - Generate 8–10 single-use codes
  - Store them hashed, not in plain text
  - Allow regeneration (which invalidates old codes)
- NEVER allow MFA to be disabled without re-authentication
- Consider making MFA mandatory for admin accounts

### Passkey implementation
- Use a tested WebAuthn library:
  - @simplewebauthn/server (Node.js)
  - webauthn4j (Java)
  - py_webauthn (Python)
- Store credential public keys, not private keys
- Support multiple passkeys per account
  (users have multiple devices)

---

## 5. Role-Based Access Control (RBAC)

### MUST FOLLOW
- ALWAYS separate permissions by role —
  never give regular users access to admin functionality
- Define roles explicitly at the start of the project —
  retrofitting RBAC is expensive
- Common role structure:

| Role | Access Level |
|------|-------------|
| super_admin | Full system access |
| admin | Organisation-level management |
| member | Standard product access |
| viewer | Read-only access |
| guest | Limited/unauthenticated access |

- Enforce permissions server-side on every request —
  never rely on hiding UI elements as a security control
- Use Row Level Security (RLS) in your database where supported
  (PostgreSQL/Supabase) to enforce data access at the database layer
- Audit admin actions — log who did what and when
  for all privileged operations
- Apply the principle of least privilege —
  give users the minimum permissions they need to do their job
- Never hard-code user IDs or emails as a way of granting access

---

## 6. OAuth & Third-Party Authentication

### MUST FOLLOW
- Validate the state parameter to prevent CSRF attacks
  during OAuth flows
- Validate the aud (audience) claim in ID tokens
  before trusting them
- Never trust the email address from an OAuth provider
  without checking that it is verified by the provider
- Use PKCE (Proof Key for Code Exchange) for all OAuth flows —
  required for public clients, recommended for all
- Link social accounts to existing accounts by email
  only after re-authentication —
  never auto-merge accounts without user confirmation
