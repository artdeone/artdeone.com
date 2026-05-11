---
name: art-de-one-website-style
description: >
  Design style guide for the ART de ONE website. Use this skill whenever
  building, styling, or modifying any UI component, page, section, or layout
  for this website — including buttons, cards, navbars, icons, typography,
  spacing, and dark/light mode theming. Always consult this skill before
  writing any CSS, Tailwind, or component code, even if the user does not
  explicitly ask for it. This skill overrides any generic "modern" or
  "beautiful" design assumptions that conflict with these rules.
---

# ART de ONE — Website Design System

## Core Philosophy

Clean and minimal. Both dark and light modes must feel intentional, calm, and
uncluttered. No decorative noise. Every element earns its place.

---

## Color Palette

### Brand Colors
| Role      | Hex       | Usage                              |
|-----------|-----------|------------------------------------|
| Primary   | `#a7e169` | Buttons, active states, highlights |
| Secondary | `#ed2939` | Button hover, accents, alerts      |

### Light Mode
| Role                | Hex       | Notes                                      |
|---------------------|-----------|--------------------------------------------|
| Background (main)   | `#ffffff`  | Primary page background                   |
| Background (alt)    | `#e8e8e8` | Alternate sections — used to visually separate sections |
| Text                | Dark neutrals | Sufficient contrast on both backgrounds |

> Sections **must** alternate or clearly differ in background to create visual
> separation. Do not let two adjacent sections share the same background without
> a clear structural break.

### Dark Mode
| Role                | Hex       | Notes                                          |
|---------------------|-----------|------------------------------------------------|
| Background (main)   | `#11130f` | Primary dark background                        |
| Accent / highlight  | `#f3f633` | Use sparingly for emphasis in dark mode        |
| Pure black          | `#000000` | ❌ **Never use.** Not part of this design system |

---

## Buttons

- **Default background:** `#a7e169` (Primary)
- **Hover background:** `#ed2939` (Secondary)
- **Shape:** Fully rounded corners (`border-radius: 9999px`) — pill shape
- **No gradients** on buttons under any circumstances
- Transition hover state smoothly (`transition: background-color 0.2s ease`)

---

## Gradients

> ❌ **Gradients are strictly forbidden — no exceptions.**

This applies even when:
- The user prompt contains the word "modern"
- The user asks for a "beautiful" or "premium" design
- A gradient might seem subtle or tasteful

Use flat colors only. Always.

---

## Borders & Strokes

- **Maximum border width:** `1px`
- **Border opacity:** `90%` (e.g. `rgba(r, g, b, 0.9)` or `opacity-90`)
- No thick outlines, no heavy card borders, no layered strokes
- Dividers (`<hr>` or decorative lines) should be used sparingly — only when
  genuinely needed for structure

---

## Spacing & Layout

- Spacing must be **responsive** — designed for both mobile and desktop
- Use consistent spacing scales (e.g. 8pt grid)
- **Bento Box layout is not allowed** — do not use asymmetric grid mosaic
  layouts with varying tile sizes
- Prefer simple, structured grids and stacked layouts
- Adequate whitespace between sections — breathable, not cramped

---

## Logo

- The **ART de ONE logo mark** and the **text "ART de ONE"** must **never**
  appear side by side as a combined lockup
- Do not place the logo image and the brand name text together in the same
  component
- Use one or the other, never both simultaneously

---

## Icons

- ❌ **No emoji** — ever, for any purpose (UI, decoration, labels, bullets)
- ✅ Use **real SVG icons only** (e.g. Lucide, Heroicons, Phosphor, or custom SVG)
- Icons must be **clean and minimalist** — no filled chunky icons, no
  illustrated-style icons unless explicitly requested

---

## Typography

- **No unnecessary underlines** on text
- Underlines are only acceptable on interactive links where they serve a
  functional accessibility purpose
- Do not underline headings, labels, decorative text, or body copy

---

## Quick Rules Reference

| Rule                        | Allowed |
|-----------------------------|---------|
| Gradients                   | ❌ Never |
| `#000000` in dark mode      | ❌ Never |
| Borders thicker than `1px`  | ❌ Never |
| Emoji as icons              | ❌ Never |
| Logo + text name together   | ❌ Never |
| Bento Box layouts           | ❌ Never |
| Unnecessary underlines      | ❌ Never |
| Flat `#a7e169` primary btn  | ✅ Always |
| Rounded pill buttons        | ✅ Always |
| SVG icons only              | ✅ Always |
| Responsive spacing          | ✅ Always |
| Section background contrast | ✅ Always |
