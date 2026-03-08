# Email & Communications Standards

> These rules MUST be followed at all times.
> Applies to all transactional and marketing email.

---

## 1. DNS Email Authentication

### MUST FOLLOW
- Configure ALL THREE records before sending any email from your domain:
  - SPF (Sender Policy Framework) — authorises which servers
    can send email on behalf of your domain
  - DKIM (DomainKeys Identified Mail) — digitally signs emails
    to prove they have not been tampered with
  - DMARC (Domain-based Message Authentication) —
    tells receiving servers what to do when SPF/DKIM fail
- Without these records:
  - Email will land in spam
  - Gmail and Yahoo will reject bulk email outright
    (enforced since 2024)
  - Your domain is vulnerable to spoofing
- Verify your setup using:
  - https://mxtoolbox.com/SuperTool.aspx
  - https://www.mail-tester.com
- Start DMARC in monitoring mode (p=none)
  then move to p=quarantine then p=reject
  once you have confirmed all legitimate sending sources are covered
- Set up DMARC reporting to receive weekly reports
  on authentication pass/fail rates

### Minimum DNS record setup
```
SPF:   v=spf1 include:youremailprovider.com ~all
DKIM:  [provided by your email sending service]
DMARC: v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com
```

---

## 2. Unsubscribe & Consent

### MUST FOLLOW
- EVERY marketing, newsletter, and promotional email MUST include
  a one-click unsubscribe link — this is legally required under:
  - CAN-SPAM (US)
  - GDPR (EU)
  - CASL (Canada)
  - Most other email regulations globally
- One-click means a single click unsubscribes the user —
  do not redirect to a page asking them to confirm again
  or re-enter their email
- Implement List-Unsubscribe headers for bulk sending:
  ```
  List-Unsubscribe: <https://yourdomain.com/unsubscribe?token=xxx>
  List-Unsubscribe-Post: List-Unsubscribe=One-Click
  ```
- Process unsubscribe requests immediately — not after a delay
- NEVER send marketing email to someone who has unsubscribed
- Transactional email (receipts, password resets, security alerts)
  does not require an unsubscribe option —
  but do not send marketing content through transactional emails
- Keep records of consent — when, how, and what the user consented to

---

## 3. Sending Infrastructure

### MUST FOLLOW
- Use a dedicated email sending service —
  never send email directly from your application server
- Recommended sending services:
  - Resend (developer-friendly, modern)
  - Postmark (excellent deliverability for transactional)
  - SendGrid (high volume)
  - Amazon SES (cost-effective at scale)
- Separate your transactional and marketing sending infrastructure:

| Type | Examples | Should Use |
|------|---------|------------|
| Transactional | Receipts, password resets, alerts | Dedicated transactional service |
| Marketing | Newsletters, promotions | Separate marketing tool or subdomain |

- Use a subdomain for marketing email —
  keep your root domain for transactional:
  - Transactional: mail.yourdomain.com
  - Marketing: news.yourdomain.com
- Monitor your sender reputation:
  - Google Postmaster Tools (for Gmail deliverability)
- Bounce handling:
  - Hard bounces: remove from list immediately
  - Soft bounces: retry 3 times then remove

---

## 4. Link Security & Expiry

### MUST FOLLOW
- ALL security-sensitive email links MUST expire:

| Link Type | Maximum Expiry |
|-----------|---------------|
| Password reset | 1 hour |
| Magic link / passwordless login | 15 minutes |
| Email verification | 24 hours |
| Team invitation | 7 days |
| Account deletion confirmation | 24 hours |

- All security links must be single-use —
  invalidate the token immediately after it is used
- Generate tokens using a cryptographically secure random generator —
  never use sequential IDs, timestamps, or predictable values
- Minimum token length: 32 bytes (256-bit entropy)
- Store tokens hashed in the database —
  not in plain text (treat them like passwords)
- Include context in password reset emails:
  - Time of request
  - Device/browser if available
  - "If you didn't request this, you can safely ignore this email"

---

## 5. Email Content Security

### MUST FOLLOW
- NEVER include sensitive data in email body content:
  - Passwords (even temporary ones)
  - Full API keys or secret tokens
  - Full credit card numbers
  - Social security numbers or government ID numbers
  - Full bank account details
- If credentials must be communicated:
  - Send a secure link that expires, not the credential itself
- Use HTML email templates with a plain text fallback —
  always include a plain text version
- Do not use URL shorteners in transactional email —
  they trigger spam filters and obscure the destination
- All links in emails must use HTTPS
- Test emails in multiple clients before launch:
  - Gmail, Outlook, Apple Mail
  - Mobile (iOS Mail, Gmail app)

---

## 6. Required Email Templates

### MUST FOLLOW
- Every product must send these transactional emails at minimum:

| Email | Trigger |
|-------|---------|
| Welcome | User registers |
| Email verification | User registers or changes email |
| Password reset | User requests reset |
| Password changed | User changes password (security alert) |
| Payment receipt | Successful charge |
| Payment failed | Failed charge |
| Subscription cancelled | User cancels |
| Invitation | User invited to team |

- Every email must include:
  - Your company name and logo
  - A clear subject line that describes the email's purpose
  - Your physical mailing address (legally required by CAN-SPAM)
  - A link to your website
  - Contact or support link
- Subject lines must be honest and descriptive —
  never use deceptive subject lines to increase open rates
