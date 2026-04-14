import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. FIX Z-INDEX OF UI ELEMENTS
html = html.replace(
    '.call-header {\n  position: absolute; top: 0; left: 0; right: 0; z-index: 100;',
    '.call-header {\n  position: absolute; top: 0; left: 0; right: 0; z-index: 99999 !important; pointer-events: none;'
)
# Ensure children of header can be clicked
html = html.replace('.room-info { display: flex; align-items: center; gap: 10px; }', '.room-info { display: flex; align-items: center; gap: 10px; pointer-events: auto; }')
html = html.replace('.header-actions { display: flex; gap: 8px; }', '.header-actions { display: flex; gap: 8px; pointer-events: auto; }')

html = html.replace(
    '.toolbar {\n  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);\n  display: flex; align-items: center; gap: 10px;\n  background: rgba(17,17,22,0.92); backdrop-filter: blur(16px);\n  border: 1px solid var(--border-color); border-radius: 100px;\n  padding: 10px 16px; z-index: 100;',
    '.toolbar {\n  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);\n  display: flex; align-items: center; gap: 10px;\n  background: rgba(17,17,22,0.92); backdrop-filter: blur(16px);\n  border: 1px solid var(--border-color); border-radius: 100px;\n  padding: 10px 16px; z-index: 99999 !important; pointer-events: auto;'
)

html = html.replace('z-index: 9999; cursor: grab;', 'z-index: 99999; cursor: grab;')
html = html.replace('#mini-popup {\n  position: fixed; bottom: 24px; right: 24px; z-index: 9999;', '#mini-popup {\n  position: fixed; bottom: 24px; right: 24px; z-index: 100000 !important;')

# 2. ADD FULLSCREEN BUTTON & LOGIC
fullscreen_btn = """
    <!-- Fullscreen -->
    <button class="ctrl-btn" onclick="toggleFullscreen()" title="Fullscreen">
      <i class="fa-solid fa-expand" id="fullscreen-icon"></i>
      <span class="ctrl-label" id="fullscreen-label">Expand</span>
    </button>
    <div class="ctrl-sep"></div>
"""

# Insert before end call button
end_call_str = "    <!-- Minimize -->"
html = html.replace(end_call_str, fullscreen_btn + "\n" + end_call_str)

fs_script = """
function toggleFullscreen() {
  const elem = document.getElementById('callscreen');
  const icon = document.getElementById('fullscreen-icon');
  const label = document.getElementById('fullscreen-label');
  
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        showToast("Error enabling fullscreen", 'fa-exclamation');
      });
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

document.addEventListener('fullscreenchange', (event) => {
  const icon = document.getElementById('fullscreen-icon');
  const label = document.getElementById('fullscreen-label');
  if (document.fullscreenElement) {
    icon.className = 'fa-solid fa-compress';
    label.textContent = 'Exit';
  } else {
    icon.className = 'fa-solid fa-expand';
    label.textContent = 'Expand';
  }
});
"""

# Inject before JS controls block
js_controls_str = "// ─────────────────────── Controls ───────────────────────"
html = html.replace(js_controls_str, fs_script + "\n" + js_controls_str)

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
