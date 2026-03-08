# UX States Standards

> These rules MUST be followed at all times.
> Every feature must handle all four states: empty, loading, error, success.

---

## 1. Empty States

### MUST FOLLOW
- EVERY list, table, dashboard widget, and data view must have
  an explicitly designed empty state
- NEVER show a blank screen, blank table, or blank list —
  this leaves users confused about whether something broke
- A good empty state must include:
  - A clear, friendly message explaining why there is no content
  - Context about what will appear here when there is content
  - A primary call-to-action that helps the user populate the content
  - (Optional) An illustration or icon to make it feel intentional

### Empty state copy patterns
- First use: "You haven't created any projects yet. Create your first project to get started."
- After filtering: "No results match your filters. Try adjusting or clearing your filters."
- After search: "No results for 'search term'. Check for typos or try a different search."
- Permission restricted: "You don't have access to view this. Contact your admin."

### NEVER write
- "No data"
- "Nothing here"
- "N/A"
- Leaving it completely blank

---

## 2. Loading States

### MUST FOLLOW
- EVERY async operation must have a visible loading state —
  never leave users wondering if their action registered
- Show a loading indicator within 200ms of an action being triggered
- Types of loading states:

| Situation | Recommended Pattern |
|-----------|-------------------|
| Initial page/data load | Skeleton screen (preferred) or spinner |
| Button action in progress | Inline loading indicator + disable button |
| Background data refresh | Subtle indicator, don't block the UI |
| File upload | Progress bar with percentage |
| Long-running process (>3s) | Progress indicator + estimated time if possible |

- Use skeleton screens instead of spinners for content loading —
  they reduce perceived load time and prevent layout shift
- ALWAYS disable submit buttons while an action is in progress —
  this prevents double submissions
- NEVER show a spinner indefinitely without a timeout —
  implement a timeout (30 seconds maximum) and show an error state
  if the operation does not complete
- Show optimistic UI for simple, high-confidence operations
  (e.g. liking a post) — update the UI immediately and
  roll back if the request fails
- Preserve user input during loading —
  never clear a form while submitting

---

## 3. Error States

### MUST FOLLOW
- EVERY feature must handle failure gracefully —
  assume the network will fail, APIs will return errors,
  and users will do unexpected things
- Error messages MUST be:
  - Human readable — no raw error codes, no technical jargon
  - Specific — tell the user what went wrong
  - Actionable — tell the user what to do next
  - Honest — do not blame the user unless they actually made an error

### Error message patterns

| Situation | Message Pattern |
|-----------|----------------|
| Network failure | "Connection lost. Check your internet and try again." |
| Server error | "Something went wrong on our end. We've been notified. Try again in a moment." |
| Not found | "We couldn't find what you were looking for. It may have been moved or deleted." |
| Permission denied | "You don't have permission to do this. Contact your admin if you think this is a mistake." |
| Validation error | "Please check the highlighted fields and try again." |
| Session expired | "Your session has expired. Please sign in again." |

- NEVER show users:
  - HTTP status codes (404, 500, 403)
  - Stack traces
  - Database error messages
  - Internal service names

- For form validation errors:
  - Show errors inline next to the relevant field
  - Show a summary at the top of the form if there are multiple errors
  - Preserve all user input — do not reset the form on error
  - Move focus to the first error field

- Implement error boundaries in React to catch component-level errors
  and show a fallback UI instead of a white screen

- Provide a retry mechanism wherever possible —
  a "Try again" button is almost always appropriate

---

## 4. Destructive Action Confirmation

### MUST FOLLOW
- ALWAYS require explicit confirmation before any destructive action
- Destructive actions include:
  - Deleting any data (accounts, records, files, messages)
  - Cancelling a subscription
  - Removing a team member
  - Disconnecting an integration
  - Clearing or resetting data
  - Overwriting existing data
- Confirmation patterns by severity:

| Severity | Pattern |
|----------|---------|
| Low (easily reversible) | Undo snackbar (5–10 second window) |
| Medium | Confirmation dialog with cancel and confirm buttons |
| High (permanent, significant) | Confirmation dialog requiring user to type a specific phrase |

- Confirmation dialogs must:
  - Clearly describe what will be deleted or affected
  - State whether the action is reversible
  - Use a destructive-style confirm button (red colour convention)
  - Have the cancel action as the default/prominent option
  - NEVER auto-confirm after a timer

- Type-to-confirm patterns (for high-severity actions):
  - Ask user to type the resource name (e.g. project name)
  - Or ask user to type "delete" or "confirm"
  - Disable the confirm button until the exact text is entered

---

## 5. Success States & Feedback

### MUST FOLLOW
- EVERY action must give clear feedback when it succeeds —
  never silently complete an operation
- Users should never have to wonder "did that work?"
- Success feedback patterns:

| Situation | Pattern |
|-----------|---------|
| Form submission | Toast notification + redirect OR inline success message |
| Item created | Optimistic add to list + toast |
| Item saved | "Saved" indicator near save button |
| File uploaded | Confirmation with file name and size |
| Email sent | "Email sent to [address]" confirmation |
| Settings updated | "Changes saved" toast or inline indicator |
| Payment processed | Full confirmation screen + email receipt |

- Toast notifications must:
  - Appear consistently in the same position (top-right is convention)
  - Auto-dismiss after 3–5 seconds
  - Be dismissible manually
  - Not block key UI elements
  - Be announced to screen readers via aria-live region

- For critical success states (payment, account creation,
  destructive action reversal):
  - Show a full confirmation screen or modal
  - Send a confirmation email
  - Provide a clear next step

- NEVER reuse the same UI for both success and error —
  differentiate visually with colour, icon, and message
