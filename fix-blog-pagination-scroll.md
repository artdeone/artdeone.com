# Fix: Blog Pagination Scroll Behavior

## Problem

On `blog.html`, the **Top Articles** section displays a grid of post cards
with pagination controls (1, 2, 3, 4, 5, 6, with prev/back and next arrows)
below it.

Currently, when a user clicks a page number (or the prev/next arrows), the
post grid content updates correctly, but the page does **not** scroll at
all. The user's scroll position stays exactly where it was — which is often
scrolled down near the pagination controls themselves, below the newly
loaded cards. This means after clicking page 2, 3, etc., the user does not
see the new articles unless they manually scroll back up.

This happens identically on both **desktop** and **mobile** views.

## Required Fix

When any pagination control is clicked (page number buttons, prev arrow,
or next arrow):

1. The new set of post cards for that page must render as it does now (no change here)
2. Immediately after rendering, scroll the page so that the **"Top Articles" heading** becomes visible at the top of the viewport
   - Do **not** scroll all the way up to the navbar / hero section
   - Scroll specifically to the "Top Articles" section heading element — this should become the topmost visible content after the scroll completes
3. Use a smooth scroll animation (`behavior: "smooth"`), not an instant jump
4. This must work identically on both desktop and mobile breakpoints

## Implementation Notes

1. Find the pagination click handler(s) in the relevant JS file (likely in
   `js/` — check `blog.html`'s linked scripts for whichever file handles
   pagination state and re-rendering of the post grid)

2. Locate the "Top Articles" heading element in `blog.html`. Give it an
   `id` if it doesn't already have one, e.g.:
   ```html
   <h2 id="top-articles-heading">Top Articles</h2>
   ```

3. Inside the pagination click handler, after the new page's cards have
   been rendered into the DOM, add a scroll call:
   ```javascript
   document.getElementById('top-articles-heading').scrollIntoView({
     behavior: 'smooth',
     block: 'start'
   });
   ```

4. Apply this to **every** pagination control: number buttons (1-6, etc.),
   the previous arrow, and the next arrow — all of them must trigger the
   same scroll behavior after switching pages

5. Test on both desktop and mobile:
   - Click page 1 → page 3 → page 1 again — confirm scroll lands at the
     "Top Articles" heading every time, not at the navbar and not staying
     at the pagination controls
   - Click the next/prev arrows repeatedly — confirm same behavior
   - Confirm the scroll happens smoothly, not as an instant jump
   - Confirm no horizontal scroll or layout shift occurs during this scroll

## Constraints

- Do not modify the visual design of the pagination controls or post cards
- Do not change the Top Articles section's existing layout, only add the
  `id` attribute needed for the scroll target if missing
- Do not scroll to the navbar/hero — scroll target is specifically the
  "Top Articles" heading
- Keep all other blog.html functionality (filtering, card click-through to
  posts, etc.) completely untouched
