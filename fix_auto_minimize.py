import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# Remove the confusing visibilitychange logic that minimizes the DOM when the tab is hidden
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

html = html.replace(auto_minimize_logic.strip(), "")

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
