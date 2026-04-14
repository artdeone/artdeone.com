import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. Minimized State Icon Visibility Fix
html = html.replace(
    '.mini-btn {\n  width: 26px; height: 26px; border-radius: 6px;\n  background: rgba(26,26,32,0.9); border: 1px solid var(--border-color);\n  color: #9ca3af; font-size: 10px; cursor: pointer;',
    '.mini-btn {\n  width: 26px; height: 26px; border-radius: 6px;\n  background: var(--card-bg); border: 1px solid var(--border-color);\n  color: var(--text-color); font-size: 10px; cursor: pointer;'
)
html = html.replace(
    '.mini-ctrl {\n  width: 30px; height: 30px; border-radius: 50%;\n  background: rgba(26,26,32,0.9); border: 1px solid var(--border-color);\n  color: var(--text-color); font-size: 12px; cursor: pointer;',
    '.mini-ctrl {\n  width: 30px; height: 30px; border-radius: 50%;\n  background: var(--card-bg); border: 1px solid var(--border-color);\n  color: var(--text-color); font-size: 12px; cursor: pointer;'
)


# 2. Text Visibility Issue Fix (Mic, Camera, Chat, etc.)
html = html.replace(
    '.ctrl-label { font-size: 11px; color: #6b7280; position: absolute; top: calc(100% + 6px); left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.2s; }',
    '.ctrl-label { font-size: 12px; font-weight: 500; color: var(--text-color); background: var(--card-bg); padding: 4px 10px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.2s, transform 0.2s; z-index: 1000; }'
)
html = html.replace('.ctrl-btn:hover .ctrl-label { opacity: 1; }', '.ctrl-btn:hover .ctrl-label { opacity: 1; transform: translateX(-50%) translateY(-2px); }')


# 3. Add Custom Pre-Share & Participants Modals HTML & CSS
modals_html = """
<!-- Custom Modals -->
<div id="custom-modals-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index: 999999; display:none; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s;" onclick="closeCustomModals(event)">
  
  <!-- Screen Share Modal -->
  <div id="share-modal" class="modal-card" style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:20px; padding:32px; width:100%; max-width:480px; display:none; transform:scale(0.95); transition:transform 0.3s; box-shadow:0 24px 60px rgba(0,0,0,0.4);">
    <h3 style="font-family:'Poppins',sans-serif; font-size:20px; font-weight:600; color:var(--text-color); margin-bottom:8px;">Share Content</h3>
    <p style="font-size:14px; color:var(--text-muted); margin-bottom:24px;">Select how you want to share your screen with the class.</p>
    
    <div style="display:flex; flex-direction:column; gap:12px;">
      <button class="share-opt-btn" onclick="executeShare()" style="display:flex; align-items:center; gap:16px; padding:16px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:14px; cursor:pointer; text-align:left; transition:all 0.2s;">
        <div style="width:40px; height:40px; border-radius:10px; background:rgba(167,225,105,0.15); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:16px;"><i class="fa-solid fa-desktop"></i></div>
        <div style="flex:1;">
          <div style="font-family:'Poppins',sans-serif; font-weight:500; font-size:15px; color:var(--text-color);">Entire Screen</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Share your whole desktop view</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
      </button>

      <button class="share-opt-btn" onclick="executeShare()" style="display:flex; align-items:center; gap:16px; padding:16px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:14px; cursor:pointer; text-align:left; transition:all 0.2s;">
        <div style="width:40px; height:40px; border-radius:10px; background:rgba(59,130,246,0.15); color:#3b82f6; display:flex; align-items:center; justify-content:center; font-size:16px;"><i class="fa-regular fa-window-maximize"></i></div>
        <div style="flex:1;">
          <div style="font-family:'Poppins',sans-serif; font-weight:500; font-size:15px; color:var(--text-color);">Application Window</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Share a specific app or program</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
      </button>

      <button class="share-opt-btn" onclick="executeShare()" style="display:flex; align-items:center; gap:16px; padding:16px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:14px; cursor:pointer; text-align:left; transition:all 0.2s;">
        <div style="width:40px; height:40px; border-radius:10px; background:rgba(245,158,11,0.15); color:#f59e0b; display:flex; align-items:center; justify-content:center; font-size:16px;"><i class="fa-brands fa-chrome"></i></div>
        <div style="flex:1;">
          <div style="font-family:'Poppins',sans-serif; font-weight:500; font-size:15px; color:var(--text-color);">Browser Tab</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Best for video and audio sharing</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
      </button>
    </div>
  </div>

  <!-- Participants Modal -->
  <div id="participants-modal" class="modal-card" style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:20px; padding:0; width:100%; max-width:400px; display:none; transform:scale(0.95); transition:transform 0.3s; box-shadow:0 24px 60px rgba(0,0,0,0.4); max-height:80vh; overflow:hidden; display:none; flex-direction:column;">
    <div style="padding:20px 24px; border-bottom:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
      <h3 style="font-family:'Poppins',sans-serif; font-size:18px; font-weight:600; color:var(--text-color); margin:0;">People in Class</h3>
      <button onclick="closeCustomModals(event)" style="background:var(--input-bg); border:none; width:32px; height:32px; border-radius:50%; color:var(--text-muted); cursor:pointer; transition:all 0.2s;"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div id="participants-list" style="padding:16px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:12px;">
      <!-- Populated via JS -->
    </div>
  </div>

</div>
<style>
.share-opt-btn:hover { border-color:var(--accent) !important; background:var(--hover-bg) !important; transform:translateY(-1px); }
</style>
"""

# Insert modals right before </body>
html = html.replace('</body>', modals_html + '\n</body>')

# 4. JavaScript Logic to intercept the Screen Share & Participants clicks and use the modals
js_intercepts = """
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

function openShareUI() {
  if (!jitsiApi) return;
  // If already sharing, just toggle it off normally
  if (shareActive) {
    jitsiApi.executeCommand('toggleShareScreen');
    return;
  }
  const overlay = document.getElementById('custom-modals-overlay');
  const modal = document.getElementById('share-modal');
  overlay.style.display = 'flex';
  modal.style.display = 'block';
  setTimeout(() => {
    overlay.style.opacity = '1';
    modal.style.transform = 'scale(1)';
  }, 10);
}

function executeShare() {
  hideModals();
  setTimeout(() => {
    if (jitsiApi) jitsiApi.executeCommand('toggleShareScreen');
  }, 300);
}

function openParticipantsUI() {
  if (!jitsiApi) return;
  const overlay = document.getElementById('custom-modals-overlay');
  const modal = document.getElementById('participants-modal');
  
  // Fetch participants
  const list = document.getElementById('participants-list');
  list.innerHTML = '';
  
  // Local user
  const me = jitsiApi.getParticipantsInfo().find(p => p.formattedDisplayName.includes(' (me)')) || { formattedDisplayName: currentName + ' (You)'};
  let pHTML = `
    <div style="display:flex; align-items:center; gap:12px; padding:8px 0;">
      <div style="width:36px; height:36px; border-radius:50%; background:var(--accent); color:#111116; display:flex; align-items:center; justify-content:center; font-family:'Poppins',sans-serif; font-weight:600; font-size:14px;">${me.formattedDisplayName.charAt(0).toUpperCase()}</div>
      <div style="flex:1;">
        <div style="font-size:14px; font-weight:500; color:var(--text-color);">${me.formattedDisplayName}</div>
      </div>
      <i class="fa-solid fa-microphone${micMuted ? '-slash' : ''}" style="color:${micMuted ? '#f87171' : 'var(--accent)'}; font-size:12px;"></i>
    </div>
  `;
  
  // Remote users
  const others = jitsiApi.getParticipantsInfo().filter(p => !p.formattedDisplayName.includes(' (me)'));
  others.forEach(p => {
    pHTML += `
      <div style="display:flex; align-items:center; gap:12px; padding:8px 0;">
        <div style="width:36px; height:36px; border-radius:50%; background:var(--input-bg); color:var(--text-color); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; font-family:'Poppins',sans-serif; font-weight:600; font-size:14px;">${p.formattedDisplayName.charAt(0).toUpperCase()}</div>
        <div style="flex:1;">
          <div style="font-size:14px; font-weight:500; color:var(--text-color);">${p.formattedDisplayName}</div>
        </div>
      </div>
    `;
  });
  
  if(others.length === 0) {
    pHTML += `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">No other participants yet.</div>`;
  }
  
  list.innerHTML = pHTML;
  
  overlay.style.display = 'flex';
  modal.style.display = 'flex';
  setTimeout(() => {
    overlay.style.opacity = '1';
    modal.style.transform = 'scale(1)';
  }, 10);
}
"""

# Insert JS intercepts
html = html.replace('// ─────────────────────── Controls ───────────────────────', '// ─────────────────────── Controls ───────────────────────\n' + js_intercepts)

# Modify the original buttons to call our new openShareUI and openParticipantsUI
html = html.replace('id="btn-share" onclick="toggleShare()"', 'id="btn-share" onclick="openShareUI()"')
html = html.replace('id="btn-participants" onclick="toggleParticipants()"', 'id="btn-participants" onclick="openParticipantsUI()"')

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
