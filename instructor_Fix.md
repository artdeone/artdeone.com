# Bug Fix Prompt — Portfolio Website

Please review the following **4 issues** found in the current portfolio website and provide the corrected code for each.

---

## Issue 1 — Excessive Vertical Spacing in "Featured Work" Section

**Problem:**
In the **Featured Work** section, there is too much empty vertical space between the subtitle paragraph ("Here's a handpicked mix of professional projects…") and the project cards grid below it. The gap is far too large and creates an awkward visual break.

**Expected Fix:**
Reduce the vertical spacing (padding/margin/gap) between the section header block and the portfolio card grid so the layout feels compact and visually balanced.

---

## Issue 2 — Excessive Vertical Spacing Between Portfolio Cards and "Services" Section

**Problem:**
Between the last row of portfolio/work cards and the **Services** section heading below, there is an excessive amount of empty dark space. This makes the page feel broken or unfinished during scroll.

**Expected Fix:**
Reduce the top/bottom padding or margin between the end of the Featured Work cards and the start of the Services section so the two sections transition naturally without large empty gaps.

---

## Issue 3 — "For Your Brand" Heading Displays Incorrectly in Dark Mode

**Problem:**
In **Dark Mode**, the large heading text above "For Your Brand" (the decorative/outline heading) is nearly invisible because it renders in a very light or low-contrast color against the light-colored CTA section background. The text is not adapting properly to the dark theme — it appears washed out or ghosted.

**Expected Fix:**
Update the dark mode styles for this heading so it renders with appropriate contrast. The decorative/outline text should use a visible color (e.g., a muted dark-mode-friendly tone or a stroke color) that remains legible when the system is in dark mode. Ensure the `dark:` Tailwind variant (or equivalent CSS) is applied correctly to this element.

---

## Issue 4 — Light / Dark / System Theme Toggle in Navigation Bar

**Context:**
The navbar contains a **three-option theme switcher** styled as a pill/capsule toggle with three icons:
- ☀️ Light
- 🌙 Dark
- 🖥️ System

The active option is highlighted with a green circular background.

**Request:**
Please review and share the **latest updated code** for this Light / Dark / System theme toggle component as it currently exists in the Navigation Bar. I want to confirm the most recent version of this component's logic and styling — including how it detects system preference, stores the selected mode, and applies the active state styling — before making any further changes.

---

> **Note:** Please address all four issues together and provide clean, updated code snippets or file diffs for each fix.