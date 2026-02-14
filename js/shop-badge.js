// Shop "New!" badge — auto-inject on all pages
(function() {
    if (localStorage.getItem('shop_visited')) return;

    var style = document.createElement('style');
    style.textContent = '.shop-new-badge{position:absolute;top:-8px;right:-14px;background:#ed2939;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;line-height:1.4;pointer-events:none;animation:badgePop .4s cubic-bezier(.34,1.56,.64,1) both}@keyframes badgePop{from{transform:scale(0)}to{transform:scale(1)}}';
    document.head.appendChild(style);

    document.querySelectorAll('a[href*="shop.html"]').forEach(function(link) {
        // Skip if it's the active shop page link (bold/current page)
        if (link.classList.contains('font-bold') || window.location.pathname.includes('shop.html')) return;
        // Only nav links
        if (!link.classList.contains('nav-link') && !link.classList.contains('mobile-nav-link')) return;

        link.style.position = 'relative';
        var badge = document.createElement('span');
        badge.className = 'shop-new-badge';
        badge.textContent = 'New!';
        link.appendChild(badge);

        link.addEventListener('click', function() {
            localStorage.setItem('shop_visited', '1');
        });
    });
})();
