import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# Fix remaining hardcoded dark mode borders to use vars
html = html.replace("border-color: #3a3a48;", "border-color: var(--accent);")
html = html.replace("border: 1px solid #2a2a35;", "border: 1px solid var(--border-color);")

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
