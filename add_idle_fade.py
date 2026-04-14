import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. Add CSS for smooth fade/slide
css_transition = """
/* ── Inactivity / Idle UI Fade ── */
#callscreen .toolbar, #callscreen .call-header {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
#callscreen.idle .toolbar {
  opacity: 0;
  transform: translate(-50%, 20px);
  pointer-events: none;
}
#callscreen.idle .call-header {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}
"""

html = html.replace('/* ── Header Bar ── */', css_transition + '\n/* ── Header Bar ── */')

# 2. Add JavaScript logic for mouse inactivity
js_idle_logic = """
// ─────────────────────── Idle UI Fade ───────────────────────
let idleTimer;
function resetIdleTimer() {
  const callscreen = document.getElementById('callscreen');
  if (callscreen.classList.contains('minimized')) return; // Don't fade if minimized
  
  // Show UI
  callscreen.classList.remove('idle');
  
  // Clear existing timer
  clearTimeout(idleTimer);
  
  // Set new timer for 3.5 seconds
  idleTimer = setTimeout(() => {
    // Hide UI
    callscreen.classList.add('idle');
  }, 3500);
}

// Bind mouse and touch events to reset the timer
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('mousedown', resetIdleTimer);
document.addEventListener('touchstart', resetIdleTimer);
document.addEventListener('keydown', resetIdleTimer);

// Start timer initially
resetIdleTimer();
"""

html = html.replace('// ─────────────────────── End Call ───────────────────────', js_idle_logic + '\n// ─────────────────────── End Call ───────────────────────')

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
