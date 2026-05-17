# ART de ONE — Bug Fix Instructions

## Overview

Three issues need to be resolved across the website. Follow the ART de ONE design system rules strictly: no gradients, flat colors only, 1px max border width, pill-shaped buttons, SVG icons only, responsive layout, and no `#000000` in dark mode.

---

## Issue 1 — `instructor.html` : Mobile Layout Horizontal Overflow

**Problem:**
On mobile view, there is a visible white strip/gap on the right side of the page. The user is able to scroll horizontally, which indicates content or an element is overflowing outside the viewport width.

**Fix Instructions:**
- Audit all elements inside `instructor.html` for anything causing horizontal overflow (e.g. fixed widths, negative margins, elements with `width` wider than `100vw`, `translateX` values, or absolutely positioned elements that bleed off-screen).
- Add `overflow-x: hidden` to the `<html>` and `<body>` tags as a safeguard.
- Ensure all sections, containers, and grid/flex children use `max-width: 100%` or `width: 100%` correctly.
- Test at 375px, 390px, and 414px viewport widths to confirm no horizontal scroll exists.
- Do **not** mask the issue with `overflow: hidden` on a wrapper without fixing the actual overflowing element.

---

## Issue 2 — `privacy-policy.html` & `terms-of-service.html` : Dark Mode Body Text Contrast + Footer

**Problem A — Body text contrast in dark mode:**
In dark mode, the body/paragraph text on both pages is too low in contrast against the dark background (`#11130f`), making it hard to read.

**Fix Instructions (Contrast):**
- Increase the contrast of body text in dark mode. Use a light neutral color — e.g. `#cccccc` or `#d4d4d4` — instead of a dark grey that blends into the background.
- Headings should remain at full white or near-white (e.g. `#ffffff` or `#f5f5f5`).
- Do **not** use pure `#000000` anywhere in dark mode (per design system rules).
- Ensure the fix applies only in dark mode (via `.dark` class or `prefers-color-scheme: dark` media query) so light mode is unaffected.

**Problem B — Footer is incorrect:**
The footer on both `privacy-policy.html` and `terms-of-service.html` does not match the site's standard footer used on `index.html` and other main pages.

**Fix Instructions (Footer):**
- Replace the existing footer on both pages with the **exact same footer component** used on `index.html`.
- The footer markup, styles, links, and structure must be identical to the original site footer.
- Ensure the footer renders correctly in both light mode and dark mode on these pages.

---

## Issue 3 — Mobile Navigation : Remove Divider Line Above "Sign In" Button

**Problem:**
In the mobile navigation menu, there is a visible horizontal divider line (`<hr>` or `border-top`) sitting directly above the "Sign In" button. This contradicts the clean, minimalist style of the site.

**Fix Instructions:**
- Remove the horizontal rule or border/divider line that appears above the "Sign In" button in the mobile nav drawer.
- Do **not** add any replacement spacing element or decorative separator — simply remove it and let natural padding/margin provide the breathing room.
- This change must be applied to **all pages** that share the navigation component (i.e. it must be a global fix, not page-specific). If the nav is a shared partial/include, fix it there. If it is duplicated across HTML files, fix every instance.
- After the fix, the Sign In button should sit cleanly at the bottom of the nav list with no visual divider above it.

---

## Design System Reminders

Refer to the ART de ONE design system for all decisions:

| Rule | Status |
|---|---|
| No gradients | Never |
| No `#000000` in dark mode | Never |
| Borders max `1px` | Always |
| No emoji — SVG icons only | Always |
| Pill-shaped buttons (`border-radius: 9999px`) | Always |
| Responsive layout (no horizontal overflow) | Always |
| Section background contrast | Always |
