/* ═══ THEME TOGGLE (Light ↔ Dark) ═══
   Click handler for #ado-theme-toggle / .ado-theme-toggle. Uses event
   delegation so it works for toggles that exist at load AND any added later
   (dynamic nav-bar). Cycles between 'light' and 'dark' only. Updates the
   button icon and saves to localStorage via ADOThemeMode if present. */
(function () {
try {
    var MODES = ['light', 'dark'];
    var icons = {
        light: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
        dark:  '<svg viewBox="0 0 24 24"><path d="M20.4 14.5A7.8 7.8 0 0 1 9.5 3.6 8.8 8.8 0 1 0 20.4 14.5Z"></path></svg>'
    };

    function safeGetItem(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSetItem(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
    }

    function getCurrentMode() {
        if (window.ADOThemeMode && window.ADOThemeMode.getMode) {
            return window.ADOThemeMode.getMode();
        }
        var saved = safeGetItem('ado-theme');
        return MODES.indexOf(saved) !== -1 ? saved : 'dark';
    }

    function updateToggleUI() {
        try {
            var mode = getCurrentMode();
            document.querySelectorAll('.ado-theme-toggle').forEach(function (toggle) {
                toggle.dataset.mode = mode;
                var iconEl = toggle.querySelector('.ado-theme-toggle-icon');
                if (iconEl) iconEl.innerHTML = icons[mode] || icons.dark;
            });
        } catch (e) { /* never break other scripts */ }
    }

    function cycleMode() {
        try {
            var current = getCurrentMode();
            var next = current === 'dark' ? 'light' : 'dark';
            if (window.ADOThemeMode && window.ADOThemeMode.setMode) {
                window.ADOThemeMode.setMode(next);
            } else {
                safeSetItem('ado-theme', next);
                document.documentElement.classList.toggle('dark', next === 'dark');
                document.documentElement.setAttribute('data-theme', next);
                if (document.body) document.body.classList.toggle('dark-mode', next === 'dark');
            }
            updateToggleUI();
        } catch (e) { /* swallow */ }
    }

    function onDocumentClick(evt) {
        try {
            var target = evt.target;
            if (!target || !target.closest) return;
            var toggle = target.closest('.ado-theme-toggle, #ado-theme-toggle');
            if (toggle) cycleMode();
        } catch (e) { /* swallow */ }
    }

    function initToggles() {
        document.addEventListener('click', onDocumentClick);
        updateToggleUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggles);
    } else {
        initToggles();
    }

    /* Keep icon in sync if ADOThemeMode.setMode is called elsewhere */
    var origSetMode = null;
    function patchSetMode() {
        try {
            if (window.ADOThemeMode && window.ADOThemeMode.setMode && !origSetMode) {
                origSetMode = window.ADOThemeMode.setMode;
                window.ADOThemeMode.setMode = function (m) {
                    try { origSetMode(m); } catch (e) {}
                    updateToggleUI();
                };
            }
        } catch (e) { /* swallow */ }
    }
    setTimeout(patchSetMode, 500);
    setInterval(function () { patchSetMode(); updateToggleUI(); }, 1000);
} catch (e) { /* outer guard: never let theme toggle break the page */ }
})();
