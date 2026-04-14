import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. FIX HOVER COLORS FOR LIGHT MODE
css_vars = """
:root { 
  --accent: #a7e169; --accent-dim: rgba(167,225,105,0.12); --glass: rgba(26,26,32,0.85); 
  --bg-color: #eef0f3; --card-bg: #ffffff; --border-color: #e5e7eb; --text-color: #111116; --text-muted: #6b7280;
  --input-bg: #f9fafb; --input-border: #e5e7eb; --placeholder-color: #9ca3af;
  --hover-bg: #f3f4f6; /* Modern light contrast for hover */
}
.dark {
  --bg-color: #111116; --card-bg: #1a1a20; --border-color: #2a2a35; --text-color: #ffffff; --text-muted: #9ca3af;
  --input-bg: #111116; --input-border: #2a2a35; --glass: rgba(26,26,32,0.85); --placeholder-color: #4b5563;
  --hover-bg: #252530; /* Dark mode hover */
}
"""
html = re.sub(r':root\s*\{[^\}]+\}\s*\.dark\s*\{[^\}]+\}', css_vars.strip(), html, 1)

html = html.replace('.ctrl-btn:hover { background: #252530; border-color: var(--accent); }', '.ctrl-btn:hover { background: var(--hover-bg); border-color: var(--accent); }')
html = html.replace('.hdr-btn:hover { background: var(--card-bg); color: var(--text-color); border-color: var(--accent); }', '.hdr-btn:hover { background: var(--hover-bg); color: var(--text-color); border-color: var(--accent); }')
html = html.replace('.mini-btn:hover { color: var(--text-color); background: var(--card-bg); }', '.mini-btn:hover { color: var(--text-color); background: var(--hover-bg); }')

# 2. AUTO-MINIMIZE ON TAB SWITCH / BROWSER MINIMIZE
# We inject a visibilitychange event listener.
auto_minimize_logic = """
// ─────────────────────── Auto Minimize on Tab Switch ───────────────────────
let wasAutoMinimized = false;
document.addEventListener("visibilitychange", () => {
  if (!jitsiApi) return;
  if (document.hidden) {
    if (!isMinimized) {
      minimizeCall();
      wasAutoMinimized = true;
    }
  } else {
    // If the user returns to the tab, optionally restore it if it was auto-minimzed.
    // However, Zoom PiP behavior typically requires the user to click the video to restore.
    // The prompt requested: "Clicking the popup should restore the original full view".
  }
});
"""

html = html.replace('// ─────────────────────── Keyboard Shortcuts ───────────────────────', auto_minimize_logic + '\n// ─────────────────────── Keyboard Shortcuts ───────────────────────')

# 3. SINGLE CLICK TO RESTORE
# Change the double-click event to a single click, taking care not to trigger restore if the user was just dragging.
click_restore = """
  // Single-click mini popup to restore (only if not dragging)
  let initialClickX, initialClickY;
  popup.addEventListener('mousedown', (e) => {
    initialClickX = e.clientX;
    initialClickY = e.clientY;
  });
  popup.addEventListener('mouseup', (e) => {
    const moveThreshold = 5;
    if (Math.abs(e.clientX - initialClickX) < moveThreshold && Math.abs(e.clientY - initialClickY) < moveThreshold) {
      // It was a click, not a drag
      if (!e.target.closest('.mini-btn, .mini-ctrl')) {
        restoreCall();
        wasAutoMinimized = false;
      }
    }
  });

"""

# Overwrite the old "dblclick" logic
html = html.replace('// Double-click mini popup to restore\n  popup.addEventListener(\'dblclick\', restoreCall);', click_restore.strip())

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
