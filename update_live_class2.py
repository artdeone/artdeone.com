import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# Fix the close custom modals logic bug where clicking the button did nothing
new_close_logic = """
function closeCustomModals(e) {
  // If clicked directly on the overlay background, close it
  if (e && e.target && e.target.id === 'custom-modals-overlay') {
    hideModals();
  }
}
function hideModals() {
  const overlay = document.getElementById('custom-modals-overlay');
  overlay.style.opacity = '0';
  document.getElementById('share-modal').style.transform = 'scale(0.95)';
  document.getElementById('participants-modal').style.transform = 'scale(0.95)';
  setTimeout(() => { 
    overlay.style.display = 'none'; 
    document.getElementById('share-modal').style.display = 'none';
    document.getElementById('participants-modal').style.display = 'none';
  }, 300);
}
"""

html = html.replace("""
function closeCustomModals(e) {
  if (e && e.target && e.target.id === 'custom-modals-overlay') {
    hideModals();
  } else if (!e || !e.target) {
    hideModals();
  }
}
function hideModals() {
  const overlay = document.getElementById('custom-modals-overlay');
  overlay.style.opacity = '0';
  document.getElementById('share-modal').style.transform = 'scale(0.95)';
  document.getElementById('participants-modal').style.transform = 'scale(0.95)';
  setTimeout(() => { 
    overlay.style.display = 'none'; 
    document.getElementById('share-modal').style.display = 'none';
    document.getElementById('participants-modal').style.display = 'none';
  }, 300);
}
""".strip(), new_close_logic.strip())

# Change the close button on the Participants modal to forcefully trigger hideModals
html = html.replace('<button onclick="closeCustomModals(event)" style="background:var(--input-bg); border:none; width:32px; height:32px; border-radius:50%; color:var(--text-muted); cursor:pointer; transition:all 0.2s;"><i class="fa-solid fa-xmark"></i></button>',
                    '<button onclick="hideModals()" style="background:var(--input-bg); border:none; width:32px; height:32px; border-radius:50%; color:var(--text-muted); cursor:pointer; transition:all 0.2s;"><i class="fa-solid fa-xmark"></i></button>')


# In standard Share Modal, let's explicitly inject a Cancel button and make sure it has 'Cancel' text
cancel_btn = """
    <div style="display:flex; justify-content:flex-end; margin-top:20px;">
      <button onclick="hideModals()" style="padding:10px 20px; background:var(--input-bg); color:var(--text-color); border:1px solid var(--border-color); border-radius:8px; font-family:'Poppins',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s;">Cancel</button>
    </div>
"""

# Insert the cancel button before the end of the share modal container
html = html.replace('<!-- Participants Modal -->', cancel_btn + '\n  <!-- Participants Modal -->')

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
