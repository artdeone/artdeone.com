(function () {
    'use strict';

    var API_KEY = 'efd74ef6d434bad28eef7b0bdb17cec2';
    var CUSTOMER_DASHBOARD_PATH = '/customer-dashboard.html';

    if (window.__adoAmplitudeInitialized) return;
    window.__adoAmplitudeInitialized = true;

    function hasAmplitude() {
        return window.amplitude && typeof window.amplitude.init === 'function';
    }

    function track(eventName, eventProperties) {
        if (!window.amplitude || typeof window.amplitude.track !== 'function') return;

        try {
            window.amplitude.track(eventName, Object.assign({
                page_title: document.title,
                page_path: window.location.pathname,
                page_url: window.location.href
            }, eventProperties || {}));
        } catch (error) {
            if (window.console && typeof window.console.warn === 'function') {
                window.console.warn('Amplitude tracking failed:', error);
            }
        }
    }

    function normalizePath(href) {
        try {
            var url = new URL(href, window.location.href);
            return url.pathname.replace(/\/+$/, '') || '/';
        } catch (error) {
            return '';
        }
    }

    function getReadableText(element) {
        var label = element.getAttribute('aria-label') ||
            element.getAttribute('title') ||
            element.textContent ||
            '';

        return label.replace(/\s+/g, ' ').trim().slice(0, 120);
    }

    function initializeAmplitude() {
        if (!hasAmplitude()) return;

        try {
            if (window.sessionReplay && typeof window.sessionReplay.plugin === 'function') {
                window.amplitude.add(window.sessionReplay.plugin({
                    sampleRate: 1,
                    forceSessionTracking: true
                }));
            }

            window.amplitude.init(API_KEY, undefined, {
                fetchRemoteConfig: true,
                transport: 'beacon',
                autocapture: {
                    attribution: true,
                    pageViews: true,
                    sessions: true,
                    formInteractions: true,
                    fileDownloads: true,
                    elementInteractions: true,
                    webVitals: true,
                    frustrationInteractions: true,
                    networkTracking: false
                }
            });
        } catch (error) {
            if (window.console && typeof window.console.warn === 'function') {
                window.console.warn('Amplitude initialization failed:', error);
            }
        }
    }

    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (!link) return;

        if (normalizePath(link.getAttribute('href')) === CUSTOMER_DASHBOARD_PATH) {
            track('Customer Dashboard Button Clicked', {
                link_text: getReadableText(link),
                link_href: link.href,
                source_page_path: window.location.pathname
            });
        }
    }, true);

    initializeAmplitude();
})();
