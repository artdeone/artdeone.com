import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. Logos
if 'logo-green_wzaqzh.png' not in html:
    html = html.replace(
        '<div id="prejoin">',
        '<div id="prejoin">\n  <img src="https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768125759/logo-green_wzaqzh.png" style="position:absolute; top:28px; left:32px; height:32px; z-index:100;">'
    )

# 2. Fonts
html = html.replace("Outfit:wght@200;300;400;500;600&family=Space+Grotesk:wght@300;400;500;600&display", "DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display")
html = html.replace("'Outfit'", "'DM Sans'")
html = html.replace("'Space Grotesk'", "'Poppins'")

# 3. CSS Colors & Variables
css_vars = """
:root { 
  --accent: #a7e169; --accent-dim: rgba(167,225,105,0.12); --glass: rgba(26,26,32,0.85); 
  --bg-color: #eef0f3; --card-bg: #ffffff; --border-color: #e5e7eb; --text-color: #111116; --text-muted: #6b7280;
  --input-bg: #f9fafb; --input-border: #e5e7eb;
}
.dark {
  --bg-color: #111116; --card-bg: #1a1a20; --border-color: #2a2a35; --text-color: #ffffff; --text-muted: #9ca3af;
  --input-bg: #111116; --input-border: #2a2a35; --glass: rgba(26,26,32,0.85);
}
"""
html = re.sub(r':root\s*\{[^\}]+\}', css_vars, html, 1)

# Basic styles updates
html = html.replace("background: #111116; color: #fff;", "background: var(--bg-color); color: var(--text-color);")
html = html.replace("background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(167,225,105,0.07) 0%, transparent 70%), #111116;",
                    "background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(167,225,105,0.07) 0%, transparent 70%), var(--bg-color);")
html = html.replace("background: #1a1a20; border: 1px solid #2a2a35;", "background: var(--card-bg); border: 1px solid var(--border-color);")
html = html.replace("background: #111116; border: 1px solid #2a2a35;", "background: var(--input-bg); border: 1px solid var(--input-border);")
html = html.replace("color: #fff;", "color: var(--text-color);")

# 4. Button hover
btn_hover = ".btn-join:hover { opacity: 0.88; transform: translateY(-1px); }"
new_btn_hover = ".btn-join:hover { background: #ed2939 !important; color: #fff !important; transform: translateY(-1px); }"
html = html.replace(btn_hover, new_btn_hover)

# 5. Icons and Tooltip
html = html.replace(
    '<label class="field-label"><i class="fa-regular fa-door-open" style="margin-right:6px; font-size:12px;"></i>Room / Class Code</label>',
    '''<label class="field-label flex items-center gap-1 group">
        <i class="fa-solid fa-hashtag text-[12px] opacity-70"></i> 
        Room / Class Code
        <div class="relative ml-1 flex items-center justify-center">
            <i class="fa-solid fa-circle-question text-[13px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition"></i>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-[#2a2a35] text-[#111116] dark:text-[#fff] text-[12px] leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-[#3a3a48] z-50 pointer-events-none">
                Room Code ဆိုတာ သင့်ဆရာ/ဆရာမထံမှ ရယူရမည့် အတန်းချိတ်ဆက်ကုဒ်ဖြစ်ပါသည်။ Announcements ကဏ္ဍတွင် ကြည့်ရှုနိုင်ပါသည်။
            </div>
        </div>
      </label>'''
)

html = html.replace('<i class="fa-regular fa-link"></i> Copy Invite Link', '<i class="fa-regular fa-copy"></i> Copy Invite Link')

# 6. Checkbox styling -> Switches
switch_css = """
/* Switch Toggle */
.switch-wrap { position:relative; display:inline-block; width:34px; height:20px; }
.switch-wrap input { opacity:0; width:0; height:0; }
.switch-slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#d1d5db; transition:.3s; border-radius:34px; }
.dark .switch-slider { background-color:#374151; }
.switch-slider:before { position:absolute; content:""; height:14px; width:14px; left:3px; bottom:3px; background-color:white; transition:.3s; border-radius:50%; }
.switch-wrap input:checked + .switch-slider { background-color:var(--accent); }
.switch-wrap input:checked + .switch-slider:before { transform:translateX(14px); }
"""
html = html.replace('/* ── Prejoin Screen ── */', switch_css + '\n/* ── Prejoin Screen ── */')

html = html.replace(
    '<input type="checkbox" id="start-mic" checked style="accent-color:var(--accent); width:15px; height:15px;">',
    '<label class="switch-wrap"><input type="checkbox" id="start-mic" checked><span class="switch-slider"></span></label>'
)
html = html.replace(
    '<input type="checkbox" id="start-cam" checked style="accent-color:var(--accent); width:15px; height:15px;">',
    '<label class="switch-wrap"><input type="checkbox" id="start-cam" checked><span class="switch-slider"></span></label>'
)

# 7. Default wrapper background borders for light/dark
html = html.replace(
    'label style="flex:1; display:flex; align-items:center; gap:8px; background:#111116; border:1px solid #2a2a35;',
    'label style="flex:1; display:flex; align-items:center; gap:8px; background:var(--input-bg); border:1px solid var(--input-border);'
)

# Fix heading color for light mode
html = html.replace('color:#fff;">Join Your Class', 'color:var(--text-color);">Join Your Class')

# 8. Footer Translation
html = html.replace(
    'Encrypted · No account needed · Works on slow internet',
    'လုံခြုံစိတ်ချရသော ချိတ်ဆက်မှု · အကောင့်မလိုအပ်ပါ · အင်တာနက်နှေးသည့်တိုင် အဆင်ပြေစွာ အသုံးပြုနိုင်သည်'
)

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
