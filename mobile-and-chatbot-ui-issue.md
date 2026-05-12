# ART de ONE — Mobile Issue Fix Prompts


## Issue 1 — Community Reviews Mobile (index.html)

```
I have a website with a "Community Reviews" section in `index.html`.
It is not working correctly on mobile devices.

Please diagnose and fix all mobile-specific issues in the
"Community Reviews" section only. Common problems to check for:

- Horizontal overflow / cards going off-screen
- Touch/swipe not working on sliders or carousels
- Text or elements overlapping on small screens
- Images not scaling correctly
- Buttons or interactive elements too small to tap (below 44px)
- Layout breaking below 768px / 480px / 375px breakpoints

Requirements:
- Fix ONLY the CSS and JS that belongs to the
  "Community Reviews" section
- Do NOT touch any other sections, components, or logic
- Use mobile-first responsive fixes (media queries if needed)
- Preserve all existing desktop styles exactly as they are
- Test mentally against 375px (iPhone SE) and 390px (iPhone 14)
  viewport widths

```

---

## Issue 2 — Chatbot Mobile UX (chatbot.js)

```
I have a chatbot UI built in `chatbot.js` (and its associated
CSS). There are two mobile-specific bugs:

BUG A — Input Zoom on Focus:
When a user taps the text input box on mobile, the browser
automatically zooms in. This is caused by the input font-size
being below 16px, which triggers iOS Safari's auto-zoom.

Fix: Ensure the chatbot text input (`#chat-input`) has a
font-size of at least 16px on mobile. Apply this only within
the chatbot's own CSS scope so it does not affect any other
inputs on the page.

BUG B — Background Page Scrolls Behind Chatbot:
When the chatbot window is open and the user scrolls inside
it on mobile, the background page (index.html content) also
scrolls simultaneously.

Fix: When the chat window is open, prevent scroll propagation
to the body. When the chat window is closed, restore normal
body scrolling. Use the existing `toggleChat()` function as
the hook — add the body scroll lock/unlock logic there.
Do NOT use any external libraries. Use only:
  document.body.style.overflow = 'hidden'  (lock)
  document.body.style.overflow = ''        (unlock)
or the `overscroll-behavior: contain` CSS approach —
whichever is cleaner given the existing code structure.

Requirements:
- Fix ONLY these two bugs
- Do NOT modify any other chatbot logic, AI call, botData,
  message rendering, or button handlers
- Do NOT modify index.html or any other file

