import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. Fix the "white layer" bug: make mini-popup transparent
html = html.replace('background: var(--bg-color); border: 1px solid var(--border-color);', 'background: transparent; border: 1px solid var(--border-color);')

# 2. Fix the dragging logic to move BOTH the iframe container AND the drag-handler popup synchronously.
old_drag_logic = """
  function getTarget() { return callscreen.classList.contains('minimized') ? callscreen : popup; }

  popup.addEventListener('mousedown', (e) => {
    if (e.target.closest('.mini-btn, .mini-ctrl')) return;
    dragging = true;
    const target = getTarget();
    const rect = target.getBoundingClientRect();
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    target.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const target = getTarget();
    const x = Math.max(0, Math.min(window.innerWidth - target.offsetWidth, e.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - target.offsetHeight, e.clientY - oy));
    target.style.right = 'auto';
    target.style.bottom = 'auto';
    target.style.left = x + 'px';
    target.style.top = y + 'px';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    getTarget().style.cursor = 'grab';
  });

  // Touch drag
  popup.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const target = getTarget();
    const rect = target.getBoundingClientRect();
    ox = t.clientX - rect.left;
    oy = t.clientY - rect.top;
    dragging = true;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const target = getTarget();
    const x = Math.max(0, Math.min(window.innerWidth - target.offsetWidth, t.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - target.offsetHeight, t.clientY - oy));
    target.style.right = 'auto';
    target.style.bottom = 'auto';
    target.style.left = x + 'px';
    target.style.top = y + 'px';
  }, { passive: true });

  document.addEventListener('touchend', () => { dragging = false; });
"""

new_drag_logic = """
  popup.addEventListener('mousedown', (e) => {
    if (e.target.closest('.mini-btn, .mini-ctrl')) return;
    dragging = true;
    const rect = popup.getBoundingClientRect();
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    popup.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const x = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, e.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, e.clientY - oy));
    
    // Move BOTH the popup and the actual callscreen so the cursor never falls into the Jitsi iframe
    popup.style.right = 'auto'; popup.style.bottom = 'auto';
    popup.style.left = x + 'px'; popup.style.top = y + 'px';
    
    callscreen.style.right = 'auto'; callscreen.style.bottom = 'auto';
    callscreen.style.left = x + 'px'; callscreen.style.top = y + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    popup.style.cursor = 'grab';
  });

  // Touch drag
  popup.addEventListener('touchstart', (e) => {
    if (e.target.closest('.mini-btn, .mini-ctrl')) return;
    const t = e.touches[0];
    const rect = popup.getBoundingClientRect();
    ox = t.clientX - rect.left;
    oy = t.clientY - rect.top;
    dragging = true;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const x = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, t.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, t.clientY - oy));
    
    popup.style.right = 'auto'; popup.style.bottom = 'auto';
    popup.style.left = x + 'px'; popup.style.top = y + 'px';
    
    callscreen.style.right = 'auto'; callscreen.style.bottom = 'auto';
    callscreen.style.left = x + 'px'; callscreen.style.top = y + 'px';
  }, { passive: false }); // Needs false to prevent default browser scrolling if needed

  document.addEventListener('touchend', () => { dragging = false; });
"""

html = html.replace(old_drag_logic.strip(), new_drag_logic.strip())

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
