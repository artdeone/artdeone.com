# ART de ONE Chatbot — Bug Fix Prompts

> Copy-paste သုံးနိုင်သော Prompts များ။ Bug တစ်ခုစီ သီးခြား Claude conversation မှာ fix လုပ်ရန် အကြံပြုသည်။
> `[paste ... here]` နေရာတိုင်းတွင် သက်ဆိုင်ရာ file content ကို ထည့်ပေးပါ။

---

## Bug 1 — HTML Escape (chatbot.js)

```
I have a JavaScript chatbot file called `chatbot.js`.
There is a `typeMessage()` function that renders bot messages
with a typewriter effect.

Inside the function, there are TWO places where HTML escaping
is done (once during typing, once after typing completes).
Both places currently have BROKEN entity strings that appear
to be corrupted — the `&amp;`, `&lt;`, `&gt;` entities are
not being applied correctly.

Please find both occurrences of these three replace calls:
  .replace(/&/g, ...)   ← should produce &amp;
  .replace(/</g, ...)   ← should produce &lt;
  .replace(/>/g, ...)   ← should produce &gt;

And fix them so that HTML special characters in bot messages
are properly escaped to prevent XSS and rendering bugs.

Do NOT change any other logic. Only fix the escape strings
in both locations inside `typeMessage()`.

```

---

## Bug 2 — Typewriter Visual Jump (chatbot.js)

```
I have a JavaScript chatbot with a `typeMessage()` function
in `chatbot.js`. It types out characters one by one, then
at the very end applies full formatting (bold via **text**,
clickable links, line breaks).

This causes a jarring "jump" — the user sees plain text
being typed, then suddenly the layout shifts when formatting
is applied all at once.

Please fix this by applying formatting INCREMENTALLY during
the typing phase — not just at the end. Specifically:

1. During typing, `\n` should already render as `<br>`
   (not wait until the end).
2. `**bold**` markdown should render as `<strong>`
   as soon as the closing `**` is typed.
3. URLs (https://...) should become clickable `<a>` tags
   as soon as a space or end-of-string is reached after the URL.
4. The final formatting pass at the end should remain as a
   cleanup step but should produce NO visible change to the
   already-rendered content.

Keep the `onDone` callback and the `scrollToBottom()` calls
exactly where they are. Do not change any other functions.


---

## Bug 3 — Rate Limiting (ai-chatbot.js)

```
I have a Netlify serverless function at
`netlify/functions/ai-chatbot.js` that calls the Groq API.

Currently there is NO rate limiting — any user can send
unlimited requests and exhaust my Groq API quota.

Please add simple in-memory rate limiting with these rules:
- Max 10 requests per IP address per 60 seconds
- If limit is exceeded, return HTTP 429 with a JSON body:
  { "error": "Too many requests. Please wait a moment." }
- Use the request IP from the event headers
  (`x-forwarded-for` or `client-ip`)
- Clean up expired entries automatically so memory doesn't
  grow unboundedly
- Do NOT use any external packages — only plain JavaScript
- Do NOT modify any other logic in the file (Groq API call,
  KNOWLEDGE_BASE, response handling)

Important: Netlify functions are stateless per-instance,
so this is instance-level rate limiting — acknowledge this
limitation in a brief code comment.



> **အကြံပြုချက်:** Bug 1 နှင့် Bug 3 ကို အရင် fix လုပ်ပါ — အမြန်ဆုံးသက်ရောက်မှုရှိသည်။
