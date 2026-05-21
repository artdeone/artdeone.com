// Mobile Menu with Smooth Animation
(function () {
    var ASSET_VERSION = '20260521';

    (function loadThemeMode() {
        if (window.ADOThemeMode || document.getElementById('ado-theme-mode-script')) return;

        var script = document.createElement('script');
        script.id = 'ado-theme-mode-script';
        script.src = '/js/theme-mode.js?v=' + ASSET_VERSION;
        script.defer = true;
        document.head.appendChild(script);
    })();

    var mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            const btn = document.getElementById('mobile-menu-button');

            if (!menu || !btn) return;
            menu.classList.toggle('open');
            btn.classList.toggle('open');
        });
    }
})();
