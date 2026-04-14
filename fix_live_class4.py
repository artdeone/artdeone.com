import re

with open('Private/artdeone-live-class.html', 'r') as f:
    html = f.read()

# 1. Dark Mode Switch
theme_toggle = """
  <button id="theme-toggle" class="absolute top-[26px] right-[32px] w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a35] text-gray-500 dark:text-gray-400 hover:text-[#a7e169] dark:hover:text-[#a7e169] shadow-sm transition-colors z-[100]" onclick="toggleTheme()">
    <i class="fa-solid fa-moon dark:hidden"></i>
    <i class="fa-solid fa-sun hidden dark:inline-block transition-opacity"></i>
  </button>
"""
if 'id="theme-toggle"' not in html:
    html = html.replace(
        '<div id="prejoin">\n  <img',
        f'<div id="prejoin">\n{theme_toggle}  <img'
    )

js_toggle = """
<script>
  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  }
</script>
</body>
"""
html = html.replace('</body>', js_toggle)


# 2. Fix placeholders
css_vars = """
:root { 
  --accent: #a7e169; --accent-dim: rgba(167,225,105,0.12); --glass: rgba(26,26,32,0.85); 
  --bg-color: #eef0f3; --card-bg: #ffffff; --border-color: #e5e7eb; --text-color: #111116; --text-muted: #6b7280;
  --input-bg: #f9fafb; --input-border: #e5e7eb; --placeholder-color: #9ca3af;
}
.dark {
  --bg-color: #111116; --card-bg: #1a1a20; --border-color: #2a2a35; --text-color: #ffffff; --text-muted: #9ca3af;
  --input-bg: #111116; --input-border: #2a2a35; --glass: rgba(26,26,32,0.85); --placeholder-color: #4b5563;
}
"""
html = re.sub(r':root\s*\{[^\}]+\}', css_vars.strip().split('.dark')[0], html, 1)
html = re.sub(r'\.dark\s*\{[^\}]+\}', '.dark {' + css_vars.strip().split('.dark {')[1], html, 1)

html = html.replace('.field-input::placeholder { color: #4b5563; }', '.field-input::placeholder { color: var(--placeholder-color); font-weight: 300; }')

# Optional: soften font weight for input text, giving the impression it's lighter
html = html.replace("font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none;", "font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; font-weight: 400;")

with open('Private/artdeone-live-class.html', 'w') as f:
    f.write(html)
