/* ═══ THEME MODE (Light / Dark, dark default on first visit) ═══
   Reads/writes localStorage key 'ado-theme'. Mirrors state onto:
     - <html class="dark">  and  data-theme="dark"|"light"
     - <body class="dark-mode">
   Exposes window.ADOThemeMode = { getMode, setMode, apply } for the toggle.
   Does NOT install any nav switcher UI — the toggle button in the navbar
   (handled by theme-toggle.js) is the single point of control. */
(function () {
    'use strict';

    if (window.ADOThemeMode) return;

    var STORAGE_KEY = 'ado-theme';
    var MODES = ['light', 'dark'];
    var currentMode = null;

    function hasMode(value) {
        return MODES.indexOf(value) !== -1;
    }

    function safeGetItem(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSetItem(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
    }

    function getInitialMode() {
        var saved = safeGetItem(STORAGE_KEY);
        if (hasMode(saved)) return saved;
        /* First visit: default to dark and persist so future loads are consistent */
        safeSetItem(STORAGE_KEY, 'dark');
        return 'dark';
    }

    function ensureStylesheet() {
        if (document.getElementById('ado-dark-mode-css')) return;
        var link = document.createElement('link');
        link.id = 'ado-dark-mode-css';
        link.rel = 'stylesheet';
        link.href = '/css-and-js/dark-mode.css';
        document.head.appendChild(link);
    }

    function cacheInlineStyle(el) {
        if (!el.hasAttribute('data-ado-light-style')) {
            el.setAttribute('data-ado-light-style', el.getAttribute('style') || '');
        }
    }

    function restoreInlineStyle(el) {
        if (!el.hasAttribute('data-ado-light-style')) return;
        var original = el.getAttribute('data-ado-light-style');
        if (original) {
            el.setAttribute('style', original);
        } else {
            el.removeAttribute('style');
        }
        el.removeAttribute('data-ado-light-style');
    }

    function linkLooksActive(link) {
        var style = link.getAttribute('style') || '';
        var href = link.getAttribute('href') || '';
        var path = window.location.pathname;
        return link.classList.contains('font-bold') ||
            link.classList.contains('active-page-link') ||
            /font-weight\s*:\s*(600|700|bold)/i.test(style) ||
            /color\s*:\s*(#000|black|rgb\(0,\s*0,\s*0\))/i.test(style) ||
            (href && (href === path || href === path.replace(/^\//, '') || (path === '/' && href.indexOf('index.html') !== -1)));
    }

    function syncActiveNavContrast(resolved) {
        document.querySelectorAll('nav .nav-link, nav .mobile-nav-link').forEach(function (link) {
            if (resolved === 'dark' && linkLooksActive(link)) {
                cacheInlineStyle(link);
                link.style.setProperty('color', '#f3f6ee', 'important');
            } else if (resolved !== 'dark') {
                restoreInlineStyle(link);
            }
        });
    }

    function applyMode(mode) {
        if (!hasMode(mode)) mode = 'dark';
        currentMode = mode;

        var html = document.documentElement;
        html.setAttribute('data-theme', mode);
        html.setAttribute('data-theme-mode', mode);
        html.style.colorScheme = mode;
        html.classList.toggle('dark', mode === 'dark');

        if (document.body) {
            document.body.classList.toggle('dark-mode', mode === 'dark');
        }

        syncActiveNavContrast(mode);
    }

    function setMode(mode) {
        if (!hasMode(mode)) mode = 'dark';
        safeSetItem(STORAGE_KEY, mode);
        applyMode(mode);
    }

    function init() {
        try {
            ensureStylesheet();
            applyMode(getInitialMode());

            /* Re-sync active-link contrast as the nav may be injected after load */
            var observer = new MutationObserver(function () {
                try { syncActiveNavContrast(currentMode || 'dark'); } catch (e) { /* swallow */ }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            window.setTimeout(function () { observer.disconnect(); }, 5000);
        } catch (e) { /* outer guard: never let theme init break the page */ }
    }

    window.ADOThemeMode = {
        setMode: setMode,
        getMode: function () { return currentMode || getInitialMode(); },
        apply: applyMode
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
