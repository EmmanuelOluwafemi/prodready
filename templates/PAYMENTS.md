# Payments & Billing Standards

> These rules MUST be followed at all times.
> Applies to all payment processing, subscription, and billing code.

---

## 1. Payment Data Security

### MUST FOLLOW
- NEVER store card numbers, CVV codes, or full PANs
  in your database under any circumstances
- NEVER log card numbers, even partially, in application logs
- ALWAYS delegate card data handling to a PCI-compliant provider:
  - Stripe (recommended)
  - Paddle (handles tax and merchant of record)
  - Lemon Squeezy (handles tax and merchant of record)
- Use the provider's hosted fields or SDKs so card data
  never touches your server
- If you ever find card data in your database or logs,
  treat it as a security incident immediately
- Store only the safe, provider-issued identifiers:
  - Stripe customer ID (cus_xxx)
  - Stripe payment method ID (pm_xxx)
  - Last 4 digits (for display only)
  - Card brand (for display only)
  - Expiry month/year (for display only)

---

## 2. Webhook Security

### MUST FOLLOW
- ALWAYS verify webhook signatures before processing any event
- For Stripe, use stripe.webhooks.constructEvent() with your
  webhook signing secret — never skip this step
- Return HTTP 200 immediately after signature verification —
  process the event asynchronously to avoid timeouts
- Implement idempotency in webhook handlers —
  payment providers will retry failed webhooks,
  so processing the same event twice must be safe
- Store processed webhook event IDs to detect and skip duplicates
- Handle at minimum these Stripe events:

| Event | Action Required |
|-------|----------------|
| checkout.session.completed | Activate subscription/order |
| invoice.payment_succeeded | Renew subscription, send receipt |
| invoice.payment_failed | Start dunning sequence |
| customer.subscription.deleted | Revoke access immediately |
| customer.subscription.updated | Update plan/limits |
| charge.dispute.created | Alert team for review |

---

## 3. Failed Payments & Dunning

### MUST FOLLOW
- NEVER silently fail or silently churn a paying user
  when a payment fails
- Implement a dunning sequence for failed payments:
  1. Day 0: Payment fails — send email notification to user
  2. Day 3: Retry payment — send reminder if still failing
  3. Day 7: Retry payment — send urgent reminder
  4. Day 14: Retry payment — final warning before access revoked
  5. Day 21: Revoke access — send cancellation confirmation
- Keep the user's data intact during the dunning period
  in case they recover the account
- Provide a direct link to update payment method
  in every dunning email
- Send a notification 7 days before a card expires
  to proactively prevent payment failures
- Use Stripe's built-in Smart Retries —
  it uses ML to retry at the optimal time

---

## 4. Receipts & Invoices

### MUST FOLLOW
- Send a receipt or invoice email on EVERY successful charge —
  this is legally required in most countries
- Receipts must include:
  - Invoice number (for accounting)
  - Date of charge
  - Description of what was purchased
  - Amount charged
  - Currency
  - Last 4 digits of card used
  - Your company name and address
  - VAT/tax amount if applicable
- Provide a way for users to download PDF invoices
  from within the product
- For subscriptions, send a reminder 3–7 days before renewal
  for annual plans
- If using Stripe, consider enabling Stripe's hosted invoices
  and customer portal to handle this automatically

---

## 5. Cancellation & Subscriptions

### MUST FOLLOW
- NEVER continue charging users after they cancel
- Provide access until the end of the current paid period —
  do not revoke access immediately on cancellation
- Never make cancellation deliberately difficult
  (dark patterns are increasingly illegal under consumer protection laws)
- Cancellation must be possible from within the product —
  not requiring a phone call or email to support
- On cancellation:
  - Confirm cancellation immediately via email
  - State clearly when access will end
  - Offer a pause option as an alternative to cancellation
    if your platform supports it
- Prorate correctly when users upgrade or downgrade mid-cycle
- For metered/usage-based billing:
  - Show users their current usage in real time
  - Alert users when approaching usage limits
  - Never charge overages without prior disclosure and consent

---

## 6. Tax Compliance

### MUST FOLLOW
- Collect and remit sales tax / VAT if you are legally required to
- Use a merchant of record (Paddle, Lemon Squeezy) to fully
  delegate tax responsibility if you do not want to handle this yourself
- If using Stripe Tax, enable it before your first sale —
  retroactive compliance is far harder
- Always display tax-inclusive or tax-exclusive pricing clearly
  to avoid customer confusion
- Store the tax amount on every transaction record
