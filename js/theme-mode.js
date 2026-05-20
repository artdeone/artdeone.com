(function () {
    'use strict';

    if (window.ADOThemeMode) return;

    var STORAGE_KEY = 'ado-theme-mode';
    var LEGACY_THEME_KEY = 'theme';
    var DASHBOARD_THEME_KEY = 'ado-theme';
    var MODES = ['light', 'dark', 'system'];
    var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var currentMode = null;

    /* Time-based default: 6 PM (18:00) – 4 AM → dark, 4 AM – 6 PM → light */
    function isTimeDark() {
        var h = new Date().getHours();
        return h >= 18 || h < 4;
    }

    var icons = {
        light: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2"></path><path d="M12 19.5v2"></path><path d="M4.6 4.6 6 6"></path><path d="m18 18 1.4 1.4"></path><path d="M2.5 12h2"></path><path d="M19.5 12h2"></path><path d="M4.6 19.4 6 18"></path><path d="m18 6 1.4-1.4"></path></svg>',
        dark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.2 14.8A7.2 7.2 0 0 1 9.2 4.8 8 8 0 1 0 19.2 14.8Z"></path></svg>',
        system: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="2"></rect><path d="M8.5 20h7"></path><path d="M12 16v4"></path><path d="M12 8.2v4.6"></path><path d="M9.7 10.5h4.6"></path></svg>'
    };

    var labels = {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
    };

    function hasMode(value) {
        return MODES.indexOf(value) !== -1;
    }

    function getInitialMode() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (hasMode(saved)) return saved;

        /* No explicit choice in STORAGE_KEY → use time-based default.
           Ignore DASHBOARD_THEME_KEY / LEGACY_THEME_KEY because they are
           written by applyMode() and would make the time-based default
           sticky across visits (e.g. dark set at night still showing at 9 AM). */
        return isTimeDark() ? 'dark' : 'light';
    }

    function resolveMode(mode) {
        if (mode === 'system') {
            return darkQuery && darkQuery.matches ? 'dark' : 'light';
        }
        return mode === 'dark' ? 'dark' : 'light';
    }

    function ensureStylesheet() {
        if (document.getElementById('ado-dark-mode-css')) return;

        var link = document.createElement('link');
        link.id = 'ado-dark-mode-css';
        link.rel = 'stylesheet';
        link.href = '/css-and-js/dark-mode.css';
        document.head.appendChild(link);
    }

    function makeSwitcher(location) {
        var wrap = document.createElement('div');
        wrap.className = 'ado-theme-switcher ado-theme-switcher-' + location;
        wrap.setAttribute('role', 'group');
        wrap.setAttribute('aria-label', 'Theme mode');

        MODES.forEach(function (mode, index) {
            if (location === 'mobile' && index > 0) {
                var divider = document.createElement('span');
                divider.className = 'ado-theme-divider';
                divider.setAttribute('aria-hidden', 'true');
                wrap.appendChild(divider);
            }

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'ado-theme-option';
            button.dataset.themeMode = mode;
            button.setAttribute('aria-label', labels[mode] + ' mode');
            button.setAttribute('title', labels[mode]);
            button.innerHTML = icons[mode] + (location === 'mobile' ? '' : '<span class="ado-theme-label">' + labels[mode] + '</span>');
            button.addEventListener('click', function () {
                setMode(mode);
            });
            wrap.appendChild(button);
        });

        return wrap;
    }

    function installThemeSwitchers() {
        var nav = document.querySelector('nav');

        if (!document.querySelector('.ado-theme-switcher-desktop')) {
            document.body.appendChild(makeSwitcher('desktop'));
        }

        if (!nav) {
            updateSwitcherState();
            return;
        }

        if (!nav.querySelector('.ado-theme-switcher-mobile')) {
            var mobileMenu = nav.querySelector('#mobile-menu');
            var mobileInner = mobileMenu && (mobileMenu.querySelector('.py-2.px-4') || mobileMenu.firstElementChild || mobileMenu);
            if (mobileInner) {
                var mobile = makeSwitcher('mobile');
                var mobileAuth = mobileInner.querySelector('#mobileAuth');
                if (mobileAuth && mobileAuth.parentNode) {
                    mobileAuth.parentNode.insertBefore(mobile, mobileAuth.nextSibling);
                } else {
                    mobileInner.appendChild(mobile);
                }
            }
        }

        updateSwitcherState();
    }

    function updateSwitcherState() {
        var mode = currentMode || getInitialMode();
        document.querySelectorAll('.ado-theme-option').forEach(function (button) {
            button.setAttribute('aria-pressed', button.dataset.themeMode === mode ? 'true' : 'false');
        });
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

    function syncActiveNavContrast(resolvedTheme) {
        document.querySelectorAll('nav .nav-link, nav .mobile-nav-link').forEach(function (link) {
            if (resolvedTheme === 'dark' && linkLooksActive(link)) {
                cacheInlineStyle(link);
                link.style.setProperty('color', '#f3f6ee', 'important');
            } else if (resolvedTheme !== 'dark') {
                restoreInlineStyle(link);
            }
        });
    }

    function applyMode(mode) {
        if (!hasMode(mode)) mode = 'system';
        currentMode = mode;

        var resolved = resolveMode(mode);
        var html = document.documentElement;

        html.setAttribute('data-theme-mode', mode);
        html.setAttribute('data-theme', resolved);
        html.style.colorScheme = resolved;

        if (document.body) {
            document.body.classList.toggle('dark-mode', resolved === 'dark');
        }

        localStorage.setItem(LEGACY_THEME_KEY, resolved);
        localStorage.setItem(DASHBOARD_THEME_KEY, resolved);
        syncActiveNavContrast(resolved);
        updateSwitcherState();
    }

    function setMode(mode) {
        if (!hasMode(mode)) mode = 'system';
        localStorage.setItem(STORAGE_KEY, mode);
        applyMode(mode);
    }

    function init() {
        ensureStylesheet();
        applyMode(getInitialMode());
        installThemeSwitchers();

        var observer = new MutationObserver(function () {
            installThemeSwitchers();
            syncActiveNavContrast(resolveMode(getInitialMode()));
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.setTimeout(function () { observer.disconnect(); }, 5000);

        /* Listen for OS theme changes when in 'system' mode */
        if (darkQuery) {
            var systemListener = function () {
                if ((currentMode || getInitialMode()) === 'system') applyMode('system');
            };
            if (darkQuery.addEventListener) {
                darkQuery.addEventListener('change', systemListener);
            } else if (darkQuery.addListener) {
                darkQuery.addListener(systemListener);
            }
        }
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
