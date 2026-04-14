import re

with open('Private/student-dashboard.html', 'r') as f:
    html = f.read()

js_html = """
        // ─── RECORDED VIDEOS LOGIC ───

        async function loadStudentRecordedVideos() {
            const grid = document.getElementById('student-rv-grid');
            if(!grid) return;
            
            grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl mb-3"></i><p>Loading your videos...</p></div>';

            try {
                // Ensure user loaded
                if (!window.user) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) return;
                    window.user = session.user;
                }

                // Get student's batch_id
                const { data: std } = await supabase.from('students').select('batch_id').eq('id', user.id).maybeSingle();
                
                // Construct the RLS-compatible query
                // Actually, our RLS policy handles all the filtering! We just select everything we are allowed to see.
                const { data, error } = await supabase.from('recorded_videos').select('*').order('created_at', { ascending: false });
                
                if (error) throw error;

                if (!data || data.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center py-16"><div class="w-16 h-16 mx-auto bg-gray-50 dark:bg-brand-dark rounded-full flex items-center justify-center mb-4"><i class="fa-solid fa-film text-2xl text-gray-300 dark:text-gray-600"></i></div><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos yet</h3><p class="text-gray-500 font-light">Recorded classes will appear here once assigned.</p></div>';
                    return;
                }

                grid.innerHTML = data.map(v => {
                    const dateStr = new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    // Extract youtube ID for iframe embedding
                    const match = v.youtube_url.match(/^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|\\\u0026v=)([^#\\\u0026\\?]*).*/);
                    const yid = (match && match[2].length === 11) ? match[2] : null;
                    const embedUrl = yid ? `https://www.youtube.com/embed/${yid}?autoplay=1&rel=0` : '';
                    
                    return `
                        <div class="bg-white dark:bg-brand-card rounded-2xl overflow-hidden border border-gray-100 dark:border-brand-border hover-lift card-hover-glow cursor-pointer group" onclick="openRvPlayer('${embedUrl}', '${v.title.replace(/'/g, "\\'")}')">
                            <div class="relative w-full" style="padding-top: 56.25%;">
                                <img src="${v.thumbnail_url || 'https://via.placeholder.com/640x360?text=No+Thumbnail'}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
                                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div class="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-green shadow-lg">
                                        <i class="fa-solid fa-play ml-1"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="p-5">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 dark:bg-brand-dark dark:text-gray-400 mb-3">
                                    <i class="fa-regular fa-clock"></i> ${dateStr}
                                </span>
                                <h3 class="font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">${v.title}</h3>
                            </div>
                        </div>
                    `;
                }).join('');

            } catch (e) {
                console.error("Error loading recorded videos", e);
                grid.innerHTML = '<div class="col-span-full text-center py-12 text-red-500">Failed to load recorded videos. Please try again later.</div>';
            }
        }

        function openRvPlayer(embedUrl, title) {
            if(!embedUrl) {
                alert("Invalid video link.");
                return;
            }
            document.getElementById('rv-player-title').textContent = title;
            document.getElementById('rv-player-iframe').src = embedUrl;
            
            const modal = document.getElementById('rv-player-modal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeRvPlayer() {
            const modal = document.getElementById('rv-player-modal');
            modal.classList.add('hidden');
            document.getElementById('rv-player-iframe').src = ''; // stop playback
            document.body.style.overflow = '';
        }

        // Hook recorded videos to sidebar
        const studentRvSidebarLink = document.querySelector('.sidebar-link[data-section="recorded-videos"]');
        if (studentRvSidebarLink) {
            studentRvSidebarLink.addEventListener('click', () => {
                loadStudentRecordedVideos();
            });
        }
"""

if 'RECORDED VIDEOS LOGIC' not in html:
    html = html.replace(
        '</script>\n</body>',
        js_html + '\n</script>\n</body>'
    )

with open('Private/student-dashboard.html', 'w') as f:
    f.write(html)
