import re

with open('Private/admin-panel.html', 'r') as f:
    html = f.read()

js_html = """
    // ─── RECORDED VIDEOS LOGIC ───

    function extractYouTubeID(url) {
        const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|\\\u0026v=)([^#\\\u0026\\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    async function fetchYoutubeMeta() {
        const url = document.getElementById('rv-youtube-url').value.trim();
        if (!url) return;
        
        const videoId = extractYouTubeID(url);
        if(!videoId) {
            alert("Invalid YouTube URL");
            return;
        }
        
        const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        document.getElementById('rv-thumbnail').src = thumbUrl;
        document.getElementById('rv-thumbnail-url').value = thumbUrl;
        
        // Attempt to fetch title via noembed
        try {
            const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if(data && data.title) {
                document.getElementById('rv-title').value = data.title;
            }
        } catch(e) {
            console.log("Could not auto-fetch title");
        }
        
        document.getElementById('rv-preview-area').style.display = 'flex';
    }

    function toggleRvAssignType() {
        const type = document.getElementById('rv-assign-type').value;
        if(type === 'batch') {
            document.getElementById('rv-assign-batch-section').style.display = 'block';
            document.getElementById('rv-assign-individual-section').style.display = 'none';
        } else {
            document.getElementById('rv-assign-batch-section').style.display = 'none';
            document.getElementById('rv-assign-individual-section').style.display = 'block';
        }
    }

    async function loadRvDependencyLists() {
        // Load batches
        const batchesCont = document.getElementById('rv-batch-checkboxes');
        try {
            const { data: batches } = await supabase.from('batches').select('id, name').order('created_at');
            if(batches) {
                batchesCont.innerHTML = batches.map(b => `
                    <label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" value="${b.id}" class="rv-batch-checkbox"> ${b.name}
                    </label>
                `).join('');
            }
        } catch(e) {}
        
        // Load students
        const stdSelect = document.getElementById('rv-student-multi');
        try {
            const { data: students } = await supabase.from('students').select('id, full_name, email').order('full_name');
            if(students) {
                stdSelect.innerHTML = students.map(s => `
                    <option value="${s.id}">${s.full_name} (${s.email})</option>
                `).join('');
            }
        } catch(e) {}
    }

    async function loadRecordedVideos() {
        const tbody = document.getElementById('recorded-videos-table-body');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:32px;"><i class="fa-solid fa-circle-notch fa-spin"></i></td></tr>';
        
        try {
            const { data, error } = await supabase.from('recorded_videos').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            
            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:32px; color:#6b7280;">No recorded videos found.</td></tr>';
                return;
            }
            
            // fetch batch/student names for display
            const { data: batData } = await supabase.from('batches').select('id, name');
            const batMap = {};
            if(batData) batData.forEach(b => batMap[b.id] = b.name);
            
            const { data: stdData } = await supabase.from('students').select('id, full_name');
            const stdMap = {};
            if(stdData) stdData.forEach(s => stdMap[s.id] = s.full_name);

            tbody.innerHTML = data.map(v => {
                let assignedStr = '';
                if(v.assignment_type === 'batch') {
                    assignedStr = '<span style="font-weight:600; color:#4f46e5;">Batches:</span> ' + 
                        (v.assigned_batches || []).map(bid => batMap[bid] || bid).join(', ');
                } else {
                    assignedStr = '<span style="font-weight:600; color:#d97706;">Students:</span> ' + 
                        (v.assigned_students || []).map(sid => stdMap[sid] || sid).join(', ');
                }
                
                return `
                    <tr>
                        <td>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <img src="${v.thumbnail_url || ''}" style="width:60px; height:34px; object-fit:cover; border-radius:4px; border:1px solid #e5e7eb;">
                                <div>
                                    <div style="font-weight:600; font-size:14px; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${v.title}</div>
                                    <a href="${v.youtube_url}" target="_blank" style="font-size:11px; color:#3b82f6; text-decoration:none;">View on YouTube <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i></a>
                                </div>
                            </div>
                        </td>
                        <td style="font-size:13px;">${assignedStr || '<span style="color:#9ca3af;">—</span>'}</td>
                        <td style="font-size:13px; color:#6b7280;">${new Date(v.created_at).toLocaleDateString()}</td>
                        <td style="text-align:right;">
                            <div class="action-buttons">
                                <button class="action-btn" onclick='editRecordedVideo(${JSON.stringify(v)})'><i class="fa-solid fa-pen"></i></button>
                                <button class="action-btn" onclick="deleteRecordedVideo('${v.id}')"><i class="fa-solid fa-trash" style="color:#ef4444;"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:32px; color:red;">${err.message}</td></tr>`;
        }
    }

    function editRecordedVideo(v) {
        document.getElementById('rv-id').value = v.id;
        document.getElementById('rv-youtube-url').value = v.youtube_url;
        document.getElementById('rv-title').value = v.title;
        document.getElementById('rv-thumbnail-url').value = v.thumbnail_url;
        document.getElementById('rv-thumbnail').src = v.thumbnail_url;
        document.getElementById('rv-preview-area').style.display = 'flex';
        
        document.getElementById('rv-assign-type').value = v.assignment_type;
        toggleRvAssignType();
        
        // Reset selections
        document.querySelectorAll('.rv-batch-checkbox').forEach(cb => cb.checked = false);
        Array.from(document.getElementById('rv-student-multi').options).forEach(opt => opt.selected = false);
        
        if(v.assignment_type === 'batch' && v.assigned_batches) {
            v.assigned_batches.forEach(b => {
                const cb = document.querySelector(`.rv-batch-checkbox[value="${b}"]`);
                if(cb) cb.checked = true;
            });
        } else if(v.assignment_type === 'individual' && v.assigned_students) {
            v.assigned_students.forEach(s => {
                const opt = document.querySelector(`#rv-student-multi option[value="${s}"]`);
                if(opt) opt.selected = true;
            });
        }
        
        document.getElementById('recorded-video-modal-title').textContent = 'Edit Recorded Video';
        openModal('add-recorded-video');
    }

    async function saveRecordedVideo() {
        const id = document.getElementById('rv-id').value;
        const youtube_url = document.getElementById('rv-youtube-url').value.trim();
        const title = document.getElementById('rv-title').value.trim();
        const thumbnail_url = document.getElementById('rv-thumbnail-url').value;
        const assignment_type = document.getElementById('rv-assign-type').value;
        
        if(!youtube_url || !title) {
            alert("URL and Title are required");
            return;
        }
        
        let assigned_batches = [];
        let assigned_students = [];
        
        if (assignment_type === 'batch') {
            document.querySelectorAll('.rv-batch-checkbox:checked').forEach(cb => assigned_batches.push(cb.value));
            if(assigned_batches.length === 0) { alert("Select at least one batch"); return; }
        } else {
            const stdOpts = document.getElementById('rv-student-multi').selectedOptions;
            for(let i=0; i<stdOpts.length; i++) {
                assigned_students.push(stdOpts[i].value);
            }
            if(assigned_students.length === 0) { alert("Select at least one student"); return; }
        }
        
        const payload = {
            title,
            youtube_url,
            thumbnail_url,
            assignment_type,
            assigned_batches,
            assigned_students
        };
        
        try {
            if(id) {
                const { error } = await supabase.from('recorded_videos').update(payload).eq('id', id);
                if(error) throw error;
            } else {
                const { error } = await supabase.from('recorded_videos').insert([payload]);
                if(error) throw error;
            }
            closeModal('add-recorded-video');
            loadRecordedVideos();
        } catch(e) {
            console.error(e);
            alert("Error saving video: " + e.message);
        }
    }

    async function deleteRecordedVideo(id) {
        if(!confirm("Are you sure you want to delete this recorded video?")) return;
        try {
            const { error } = await supabase.from('recorded_videos').delete().eq('id', id);
            if(error) throw error;
            loadRecordedVideos();
        } catch(e) {
            alert("Delete failed: " + e.message);
        }
    }

    // Hook recorded videos to sidebar
    const rvSidebarLink = document.querySelector('.sidebar-link[data-section="recorded-videos"]');
    if (rvSidebarLink) {
        rvSidebarLink.addEventListener('click', () => {
            loadRecordedVideos();
            loadRvDependencyLists(); // fresh fetch batches & students
        });
    }
"""

if 'RECORDED VIDEOS LOGIC' not in html:
    html = html.replace(
        '</script>\n</body>',
        js_html + '\n</script>\n</body>'
    )
    # Important: Modal overrides ID clearing for our form
    org_modal_func = """function openModal(id) {"""
    new_open_modal_func = """function openModal(id) {
        if(id === 'add-recorded-video' && !document.getElementById('rv-id').value) {
            document.getElementById('rv-youtube-url').value = '';
            document.getElementById('rv-title').value = '';
            document.getElementById('rv-preview-area').style.display = 'none';
            document.getElementById('recorded-video-modal-title').textContent = 'Add Recorded Video';
            document.querySelectorAll('.rv-batch-checkbox').forEach(cb => cb.checked = false);
            Array.from(document.getElementById('rv-student-multi').options).forEach(opt => opt.selected = false);
        }"""
    
    html = html.replace(org_modal_func, new_open_modal_func, 1)

with open('Private/admin-panel.html', 'w') as f:
    f.write(html)
