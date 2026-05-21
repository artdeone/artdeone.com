/* ═══ THEME TOGGLE (Light → Dark → System cycle) ═══ */
/* Safe re-apply: outer try/catch, event delegation for dynamic navs,
   localStorage failures swallowed. No MutationObserver. No dynamic script
   injection. No modification of nav/auth/page-load code. */
(function(){
try {
    var MODES = ['light', 'dark', 'system'];
    var icons = {
        light: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
        dark: '<svg viewBox="0 0 24 24"><path d="M20.4 14.5A7.8 7.8 0 0 1 9.5 3.6 8.8 8.8 0 1 0 20.4 14.5Z"></path></svg>',
        system: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8"></path><path d="M12 16v4"></path></svg>'
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
        var saved = safeGetItem('ado-theme-mode');
        if (MODES.indexOf(saved) !== -1) return saved;
        return 'light';
    }

    function updateToggleUI() {
        try {
            var mode = getCurrentMode();
            var toggles = document.querySelectorAll('.ado-theme-toggle');
            toggles.forEach(function(toggle) {
                toggle.dataset.mode = mode;
                var iconEl = toggle.querySelector('.ado-theme-toggle-icon');
                if (iconEl) iconEl.innerHTML = icons[mode] || icons.light;
            });
        } catch (e) { /* never break other scripts */ }
    }

    function cycleMode() {
        try {
            var current = getCurrentMode();
            var idx = MODES.indexOf(current);
            var next = MODES[(idx + 1) % MODES.length];
            if (window.ADOThemeMode && window.ADOThemeMode.setMode) {
                window.ADOThemeMode.setMode(next);
            } else {
                safeSetItem('ado-theme-mode', next);
            }
            updateToggleUI();
        } catch (e) { /* swallow */ }
    }

    /* Event delegation: handles toggles that exist at load AND any added
       later (e.g. by a dynamic nav-bar). No per-element binding, no
       observer needed. */
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

    /* Re-sync when theme-mode.js changes the mode */
    var origSetMode = null;
    function patchSetMode() {
        try {
            if (window.ADOThemeMode && window.ADOThemeMode.setMode && !origSetMode) {
                origSetMode = window.ADOThemeMode.setMode;
                window.ADOThemeMode.setMode = function(m) {
                    try { origSetMode(m); } catch (e) {}
                    updateToggleUI();
                };
            }
        } catch (e) { /* swallow */ }
    }
    setInterval(function() { patchSetMode(); updateToggleUI(); }, 1000);
    setTimeout(patchSetMode, 500);
} catch (e) { /* outer guard: never let theme toggle break the page */ }
})();
