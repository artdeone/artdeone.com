import re

with open('Private/admin-panel.html', 'r') as f:
    html = f.read()

# 1. SIDEBAR
sidebar_link = """            <div class="sidebar-link" data-section="recorded-videos">
                <i class="fa-solid fa-film"></i> Recorded Videos
            </div>
"""
if 'data-section="recorded-videos"' not in html:
    html = html.replace(
        '<div class="sidebar-link" data-section="live-class">\n                <i class="fa-solid fa-video"></i> Live Class\n            </div>',
        '<div class="sidebar-link" data-section="live-class">\n                <i class="fa-solid fa-video"></i> Live Class\n            </div>\n' + sidebar_link
    )

# 2. SECTION
section_html = """            <!-- ─── Recorded Videos ─── -->
            <section id="recorded-videos-section" class="section">
                <div class="page-header">
                    <div>
                        <h1>Recorded Videos</h1>
                        <p>Manage and assign unlisted YouTube recordings</p>
                    </div>
                    <button class="btn btn-primary" onclick="openModal('add-recorded-video')">
                        <i class="fa-solid fa-plus"></i> Add Video
                    </button>
                </div>
                <div class="card">
                    <div style="overflow-x:auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Video</th>
                                    <th>Assigned To</th>
                                    <th>Date Added</th>
                                    <th style="text-align:right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="recorded-videos-table-body">
                                <tr><td colspan="4" style="text-align:center; padding:32px; color:#6b7280;">Loading videos...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
"""
if 'id="recorded-videos-section"' not in html:
    html = html.replace(
        '<!-- ─── Dashboard ─── -->',
        section_html + '\n            <!-- ─── Dashboard ─── -->'
    )

# 3. MODAL
modal_html = """    <!-- MODAL: ADD/EDIT RECORDED VIDEO -->
    <div id="add-recorded-video-modal" class="modal">
        <div class="modal-content" style="max-width:550px;">
            <div class="modal-header">
                <h3 id="recorded-video-modal-title">Add Recorded Video</h3>
                <button class="modal-close" onclick="closeModal('add-recorded-video')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body" style="display:flex; flex-direction:column; gap:16px;">
                <input type="hidden" id="rv-id">
                
                <div>
                    <label class="form-label">YouTube URL <span class="text-red-500">*</span></label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="rv-youtube-url" class="form-input" style="flex:1; margin-bottom:0;" placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..." onblur="fetchYoutubeMeta()">
                        <button class="btn btn-secondary" onclick="fetchYoutubeMeta()"><i class="fa-solid fa-magnifying-glass"></i> Fetch</button>
                    </div>
                    <p class="form-help" style="margin-top:4px; font-size:11px; color:#6b7280;">Paste URL to auto-fetch title and thumbnail.</p>
                </div>

                <div id="rv-preview-area" style="display:none; gap:12px; align-items:flex-start; background:#f9fafb; padding:12px; border-radius:8px; border:1px solid #e5e7eb;">
                    <img id="rv-thumbnail" src="" style="width:120px; height:68px; object-fit:cover; border-radius:6px; border:1px solid #e5e7eb;">
                    <div style="flex:1;">
                        <input type="hidden" id="rv-thumbnail-url">
                        <label class="form-label" style="margin-bottom:4px; font-size:11px;">Video Title</label>
                        <input type="text" id="rv-title" class="form-input" style="margin-bottom:0;" placeholder="Title...">
                    </div>
                </div>

                <div>
                    <label class="form-label">Assignment Type <span class="text-red-500">*</span></label>
                    <select id="rv-assign-type" class="form-input" onchange="toggleRvAssignType()">
                        <option value="batch">Assign to Batches</option>
                        <option value="individual">Assign to Individuals</option>
                    </select>
                </div>

                <div id="rv-assign-batch-section">
                    <label class="form-label">Select Batches</label>
                    <div id="rv-batch-checkboxes" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; max-height:150px; overflow-y:auto; padding:8px; border:1px solid #e5e7eb; border-radius:8px; background:#fff;">
                        <!-- Batches injected via JS -->
                    </div>
                </div>

                <div id="rv-assign-individual-section" style="display:none;">
                    <label class="form-label">Select Students</label>
                    <select id="rv-student-multi" class="form-input" multiple style="height:120px;">
                        <!-- Students injected via JS -->
                    </select>
                    <p style="font-size:11px; color:#6b7280; margin-top:4px;">Hold Cmd/Ctrl to select multiple.</p>
                </div>

            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('add-recorded-video')">Cancel</button>
                <button class="btn btn-primary" onclick="saveRecordedVideo()">Save Video</button>
            </div>
        </div>
    </div>
"""
if 'id="add-recorded-video-modal"' not in html:
    html = html.replace(
        '<!-- ─── Modals ─── -->',
        '<!-- ─── Modals ─── -->\n' + modal_html
    )

with open('Private/admin-panel.html', 'w') as f:
    f.write(html)
