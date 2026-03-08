# Accessibility Standards

> These rules MUST be followed at all times.
> Applies to all UI components, pages, and user-facing features.
> Target standard: WCAG 2.2 Level AA

---

## 1. Images & Media

### MUST FOLLOW
- EVERY image must have an alt attribute — this is not optional
- Write descriptive alt text that conveys the meaning
  and purpose of the image, not just what it depicts
  - Bad: alt="image" or alt="photo"
  - Bad: alt="IMG_4823.jpg"
  - Good: alt="Screenshot of the dashboard showing monthly revenue chart"
- Use empty alt text (alt="") ONLY for purely decorative images
  that add no meaning — this tells screen readers to skip them
- For complex images (charts, graphs, diagrams):
  - Provide a text description nearby or in a caption
  - Consider a data table as an alternative to a chart
- Video content must have captions
- Audio content must have a transcript
- NEVER use images of text — use actual text styled with CSS
- Animated content (GIFs, animations) must respect the
  prefers-reduced-motion media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 2. Keyboard Navigation

### MUST FOLLOW
- EVERY interactive element must be reachable and operable
  via keyboard alone
- Test by completely unplugging your mouse and navigating
  the entire application
- Tab order must follow the visual layout —
  do not use tabindex values greater than 0
  (this breaks natural tab order)
- Use tabindex="0" to add a custom element to tab order
- Use tabindex="-1" to make an element programmatically
  focusable but not in tab order
- NEVER use outline: none on focused elements without
  providing an alternative visible focus indicator
- Focus must be managed when:
  - A modal opens (move focus to modal)
  - A modal closes (return focus to trigger element)
  - A page navigation occurs in a SPA (move focus to main content)
  - Content is dynamically added (announce to screen readers)
- Implement a "skip to main content" link as the
  first focusable element on every page
- All dropdown menus, date pickers, and custom controls
  must be fully operable with keyboard

### Skip link implementation
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<main id="main-content">
  <!-- page content -->
</main>
```

---

## 3. Colour Contrast

### MUST FOLLOW
- Meet WCAG 2.2 AA contrast requirements:

| Text Type | Minimum Contrast Ratio |
|-----------|----------------------|
| Normal text (below 18pt / 14pt bold) | 4.5:1 |
| Large text (18pt+ / 14pt+ bold) | 3:1 |
| UI components and graphical objects | 3:1 |
| Decorative elements | No requirement |
| Logos | No requirement |

- Test every colour combination using:
  - https://contrast.tools
  - https://webaim.org/resources/contrastchecker/
  - Browser DevTools accessibility inspector
- Do NOT rely on colour alone to convey information:
  - Error states: use colour + icon + text
  - Success states: use colour + icon + text
  - Required fields: use colour + label text or asterisk with legend
- Honour the OS prefers-contrast media query
- Check contrast for all interactive states:
  default, hover, focus, active, disabled

---

## 4. Semantic HTML

### MUST FOLLOW
- Use the correct HTML element for every purpose —
  never use a div or span where a native element exists

| Purpose | Correct Element |
|---------|----------------|
| Navigation | nav |
| Main content | main |
| Page header | header |
| Page footer | footer |
| Sidebar | aside |
| Article/post | article |
| Section with heading | section |
| Clickable action | button |
| Link to a URL | a href="..." |
| Data table | table with thead, tbody, th |
| List of items | ul or ol with li |
| Form | form |
| Heading hierarchy | h1 through h6 in order |

- NEVER use div onclick or span onclick as clickable elements — use button
- Use ARIA attributes only when native HTML cannot convey
  the required semantic — prefer native HTML always
- Ensure every page has exactly one h1
- Do not skip heading levels (e.g. jumping from h2 to h4)
- Landmark regions must cover all page content —
  no content should be outside a landmark

---

## 5. Forms & Labels

### MUST FOLLOW
- EVERY form input must have an associated visible label
- NEVER use placeholder text as a substitute for a label —
  placeholder disappears when the user starts typing
- Associate labels with inputs using for + id:

```html
<!-- Correct -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" />

<!-- Wrong — no label -->
<input type="email" placeholder="Email address" />
```

- For required fields:
  - Mark them visually (asterisk is conventional)
  - Add required attribute to the input
  - Explain what the asterisk means above the form
- Error messages must be:
  - Associated with the specific field using aria-describedby
  - Visible and clearly worded
  - Not relying on colour alone
- Use autocomplete attributes to help users fill forms faster:
  - autocomplete="email" for email fields
  - autocomplete="new-password" for new password fields
  - autocomplete="current-password" for login password fields
  - autocomplete="name" for full name fields
- Group related form controls with fieldset and legend
- Ensure touch targets are at minimum 44x44 CSS pixels
  (WCAG 2.2 requirement for pointer target size)
