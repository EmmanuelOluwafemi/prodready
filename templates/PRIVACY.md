# Privacy Policy Standards

> These rules MUST be followed at all times.
> Applies to all features that collect, process, or store user data.

---

## 1. Data Minimisation

### MUST FOLLOW
- ONLY collect data you have a clear, immediate use for
- If you cannot answer "why do we need this?" for every data point,
  do not collect it
- Delete data at the point of collection if it turns out not to be needed
- Do not collect data "just in case it's useful later"
- Review collected data every 6 months and delete what is no longer used
- Avoid collecting:
  - Date of birth unless age verification is legally required
  - Phone numbers unless SMS is a core feature
  - Gender, race, religion, or other sensitive attributes
    unless explicitly required for your product
  - Precise location unless the feature requires it
    (prefer city-level over GPS coordinates)

---

## 2. User Data Deletion

### MUST FOLLOW
- ALWAYS provide a way for users to delete their account and
  all associated data
- Data deletion must be accessible from within the product —
  not hidden, not requiring an email to support
- On deletion request:
  - Delete or anonymise all PII within 30 days
    (GDPR requires this — match this standard globally)
  - Delete data from backups within your documented retention window
  - Revoke all active sessions immediately
  - Cancel any active subscriptions
  - Confirm deletion to the user via email
- Document exceptions where data must be retained for legal reasons
  (e.g. financial records for 7 years) and communicate this to users
- NEVER delete only the frontend account while retaining all data
  in the database — this is deceptive and non-compliant

---

## 3. Logging & PII

### MUST FOLLOW
- NEVER log the following in application logs:
  - Email addresses
  - Full names
  - IP addresses (or hash/truncate them)
  - Device identifiers
  - Passwords (even failed login attempts)
  - Payment information
  - Health or medical information
  - Location data
  - LLM prompt contents that contain user data
- Use user IDs or anonymised identifiers in logs instead of
  identifiable information
- Implement log scrubbing middleware that strips PII before
  logs are written
- Set log retention policies — do not keep logs forever
- Apply access controls to logs —
  not everyone on the team needs access to production logs

---

## 4. Cookie Consent & Analytics

### MUST FOLLOW
- NEVER set non-essential cookies before obtaining explicit consent
- Non-essential cookies include:
  - Analytics cookies (Google Analytics, Mixpanel, Hotjar)
  - Advertising and retargeting cookies
  - A/B testing cookies
  - Session recording cookies
- Essential cookies (authentication, security, shopping cart)
  do not require consent but must be documented
- Preferred approach: use cookieless analytics to avoid
  consent requirements entirely:
  - Plausible Analytics
  - Fathom Analytics
  - Umami (self-hosted, open source)
  - Cloudflare Web Analytics
- If using Google Analytics 4, enable IP anonymisation and
  disable data sharing with Google
- Consent must be:
  - Freely given (no pre-ticked boxes)
  - Specific (separate consent for each category)
  - Informed (clear plain-language explanation)
  - Reversible (user can withdraw consent easily)
- Store consent records — you must be able to prove consent
  was given if challenged

---

## 5. Data Documentation & Transparency

### MUST FOLLOW
- Maintain an internal data map that documents:
  - Every category of data collected
  - Why it is collected (legal basis under GDPR)
  - Where it is stored (country and provider)
  - Who has access to it (internal teams and third parties)
  - How long it is retained
  - How it is deleted
- This document must be kept up to date as the product evolves
- Your public privacy policy must accurately reflect this data map
- Never use vague language in your privacy policy
  ("we may share data with partners") without specifying who and why
- Disclose every third-party tool that receives user data, including:
  - Analytics tools
  - Error monitoring tools
  - Email providers
  - Payment processors
  - AI/LLM API providers (e.g. if you send user data to OpenAI)
  - Customer support tools
  - CRMs

---

## 6. Regulatory Compliance Baseline

### MUST FOLLOW
- Meet GDPR requirements as a minimum standard regardless
  of where your users are located — it is the most comprehensive
  and sets a good baseline for all other regulations
- If you have users in California, also comply with CCPA/CPRA
- If you handle health data, comply with HIPAA before accepting
  any health-related information
- If you have users under 13 (US) or under 16 (EU),
  COPPA and GDPR-K apply — implement age verification
- Document your legal basis for processing data under GDPR:
  - Consent
  - Contract (processing necessary to deliver the service)
  - Legal obligation
  - Legitimate interests (requires a balancing test)
