import re

with open('Private/student-dashboard.html', 'r') as f:
    html = f.read()

# 1. SIDEBAR
sidebar_link = """                <a href="#"
                    class="sidebar-link flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-700 dark:text-gray-300 text-sm font-medium transition hover:text-black dark:hover:text-white"
                    data-section="recorded-videos" data-tooltip="Recorded Videos">
                    <svg class="w-5 h-5 opacity-80 text-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                        <line x1="7" y1="2" x2="7" y2="22"></line>
                        <line x1="17" y1="2" x2="17" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="2" y1="7" x2="7" y2="7"></line>
                        <line x1="2" y1="17" x2="7" y2="17"></line>
                        <line x1="17" y1="17" x2="22" y2="17"></line>
                        <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                    <span>Recorded Videos</span>
                </a>
"""
if 'data-section="recorded-videos"' not in html:
    html = html.replace(
        'data-section="live-class" data-tooltip="Live Class">\n                    <svg',
        'data-section="live-class" data-tooltip="Live Class">\n                    <svg'
    )
    # The safest way is to insert right after the live-class link block
    live_class_block = """                    <span>သင်တန်း Join ရန်</span>
                </a>"""
    html = html.replace(live_class_block, live_class_block + '\n' + sidebar_link, 1)

# 2. HTML SECTION
section_html = """                <!-- ── RECORDED VIDEOS ── -->
                <div id="recorded-videos-section" class="section space-y-8 max-w-7xl mx-auto hidden fade-in-up">
                    <h2 class="text-2xl font-light border-b border-gray-100 dark:border-brand-border pb-4">Class Recordings</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="student-rv-grid">
                        <!-- Loading State -->
                        <div class="col-span-full text-center py-12 text-gray-400">
                            <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-3"></i>
                            <p>Loading your videos...</p>
                        </div>
                    </div>
                </div>
"""
if 'id="recorded-videos-section"' not in html:
    my_courses_marker = "<!-- ── MY COURSES ── -->"
    html = html.replace(my_courses_marker, section_html + '\n                ' + my_courses_marker)

# 3. YOUTUBE LIGHTBOX MODAL
modal_html = """    <!-- YOUTUBE PLAYER MODAL -->
    <div id="rv-player-modal" class="fixed inset-0 z-50 flex items-center justify-center hidden">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" onclick="closeRvPlayer()"></div>
        <div class="relative z-10 w-full max-w-5xl px-4 flex flex-col slide-up scale-up">
            <div class="flex justify-between items-center mb-4">
                <h3 id="rv-player-title" class="text-white text-xl font-medium truncate pr-4">Video Title</h3>
                <button onclick="closeRvPlayer()" class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition flex-shrink-0">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            <div class="relative w-full rounded-2xl overflow-hidden shadow-2xl" style="padding-top: 56.25%;">
                <iframe id="rv-player-iframe" class="absolute inset-0 w-full h-full border-0" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    </div>
"""
if 'id="rv-player-modal"' not in html:
    html = html.replace('<!-- Announcement Modal -->', modal_html + '\n    <!-- Announcement Modal -->')

with open('Private/student-dashboard.html', 'w') as f:
    f.write(html)
