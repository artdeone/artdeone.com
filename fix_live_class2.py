import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# Fix remaining hardcoded colors
html = html.replace("background: #2a2a35;", "background: var(--border-color);")
html = html.replace("background: #111116; border: 1px solid #2a2a35;", "background: var(--input-bg); border: 1px solid var(--border-color);")
html = html.replace("background: #0a0a0d;", "background: var(--bg-color);")
html = html.replace("background: #1a1a20;", "background: var(--card-bg);")
html = html.replace("color: #e5e7eb;", "color: var(--text-color);")
html = html.replace("color: #fff;", "color: var(--text-color);")
html = html.replace("color:#fff;", "color:var(--text-color);")
html = html.replace("background: rgba(26,26,32,0.8);", "background: var(--card-bg);")

# Wait, tooltip div needs to be positioned correctly
html = html.replace("bottom-full left-1/2 -translate-x-1/2", "bottom-1/2 left-[25px] -translate-y-1/2")

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
