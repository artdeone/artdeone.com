// =====================================================
// NAV AUTH — Shared navbar auth UI for all pages
// =====================================================
import { supabaseShop } from './config-shop.js';

// Skip if already set up (shop.html, index.html)
if (document.getElementById('desktopAuth')) {
    // Already has auth-aware navbar — do nothing
} else {
    init();
}

function init() {
    injectCSS();
    setupDesktopNav();
    setupMobileNav();
    checkSession();
}

// ── Inject CSS ──
function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .shop-nav-avatar {
            width: 30px; height: 30px; border-radius: 50%;
            background: #323232; color: #a7e169;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.65rem; font-weight: 700;
            font-family: 'Space Grotesk', sans-serif;
            overflow: hidden; border: 2px solid #a7e169;
            flex-shrink: 0; transition: all 0.3s ease;
        }
        .shop-nav-avatar:hover { border-color: #ed2939; transform: scale(1.08); }
        .shop-nav-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .nav-btn-signout {
            background: #ed2939; color: #fff; font-weight: 600;
            border-radius: 2rem; padding: 0.4rem 1.25rem; font-size: 0.8rem;
            transition: all 0.3s ease; display: inline-flex;
            align-items: center; justify-content: center;
            border: 1px solid #ed2939; cursor: pointer;
            font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.02em;
            position: relative; overflow: hidden; isolation: isolate;
            box-shadow: inset 0 0 12px 3px rgba(255,255,255,0.35),
                        inset 0 0 28px 6px rgba(255,255,255,0.10),
                        0 0 18px 4px rgba(237,41,57,0.10);
        }
        .nav-btn-signout:hover {
            background: #a7e169; border-color: #a7e169; color: #000;
            transform: translateY(-1px);
            box-shadow: inset 0 0 14px 4px rgba(255,255,255,0.45),
                        inset 0 0 32px 8px rgba(255,255,255,0.15),
                        0 0 25px 6px rgba(167,225,105,0.18);
        }
        .nav-btn-signout::after {
            content: ''; position: absolute; inset: 0; z-index: 1;
            pointer-events: none; border-radius: inherit; opacity: 0.07;
            mix-blend-mode: overlay;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
            background-size: 128px 128px;
        }
        .nav-btn-signout:hover::after { opacity: 0.10; }

        .mobile-profile-row {
            display: flex; align-items: center; gap: 10px; padding: 10px 0;
        }
        .mobile-profile-row .shop-nav-avatar {
            width: 32px; height: 32px; font-size: 0.7rem;
        }
    `;
    document.head.appendChild(style);
}

// ── Desktop Nav ──
function setupDesktopNav() {
    const desktopBlock = document.querySelector('nav .hidden.md\\:block');
    if (!desktopBlock) return;
    const signInLink = desktopBlock.querySelector('a.nav-btn[href*="customer-dashboard"]');
    if (!signInLink) return;

    desktopBlock.className = 'hidden md:flex items-center gap-3';
    desktopBlock.id = 'desktopAuth';
    signInLink.id = 'btnLoginDesktop';

    const userInfo = document.createElement('div');
    userInfo.id = 'userInfoDesktop';
    userInfo.style.display = 'none';
    userInfo.className = 'flex items-center gap-3';
    userInfo.innerHTML =
        '<a href="/customer-dashboard.html" title="Dashboard" style="text-decoration:none;display:flex;align-items:center;">' +
            '<span class="shop-nav-avatar" id="avatarDesktop"></span>' +
        '</a>' +
        '<button class="nav-btn-signout" id="navSignoutDesktop">Sign out</button>';
    desktopBlock.appendChild(userInfo);

    userInfo.querySelector('#navSignoutDesktop').addEventListener('click', logout);
}

// ── Mobile Nav ──
function setupMobileNav() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    const mobileSignIn = mobileMenu.querySelector('a[href*="customer-dashboard"]');
    if (!mobileSignIn) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'mobileAuth';

    const newSignIn = mobileSignIn.cloneNode(true);
    newSignIn.id = 'btnLoginMobile';
    newSignIn.className = 'nav-btn-signout';
    newSignIn.style.cssText = 'padding:0.3rem 0.75rem;font-size:0.75rem;gap:0.35rem;display:inline-flex;align-items:center;text-decoration:none;';

    const userInfoMobile = document.createElement('div');
    userInfoMobile.id = 'userInfoMobile';
    userInfoMobile.style.display = 'none';
    userInfoMobile.innerHTML =
        '<a href="/customer-dashboard.html" class="mobile-profile-row" style="text-decoration:none;">' +
            '<span class="shop-nav-avatar" id="avatarMobile"></span>' +
            '<span class="mobile-nav-link text-black font-medium" style="padding:0;">Dashboard</span>' +
        '</a>' +
        '<button class="nav-btn-signout" id="navSignoutMobile" style="width:100%;margin-top:4px;margin-bottom:8px;font-size:0.8rem;padding:0.5rem 1rem;">Sign out</button>';

    wrapper.appendChild(newSignIn);
    wrapper.appendChild(userInfoMobile);
    mobileSignIn.parentNode.replaceChild(wrapper, mobileSignIn);

    userInfoMobile.querySelector('#navSignoutMobile').addEventListener('click', logout);
}

// ── Auth UI Update ──
function updateAuthUI(session) {
    const btnLoginDesktop = document.getElementById('btnLoginDesktop');
    const userInfoDesktop = document.getElementById('userInfoDesktop');
    const btnLoginMobile  = document.getElementById('btnLoginMobile');
    const userInfoMobile  = document.getElementById('userInfoMobile');

    if (!btnLoginDesktop) return;

    if (session && session.user) {
        const name = session.user.user_metadata?.full_name
                  || session.user.email.split('@')[0];
        const avatarUrl = session.user.user_metadata?.avatar_url || null;
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

        btnLoginDesktop.style.display = 'none';
        userInfoDesktop.style.display = 'flex';

        const avatarDesktop = document.getElementById('avatarDesktop');
        if (avatarDesktop) {
            avatarDesktop.innerHTML = avatarUrl
                ? '<img src="' + avatarUrl + '" alt="' + name + '">'
                : '';
            if (!avatarUrl) avatarDesktop.textContent = initials;
        }

        if (btnLoginMobile) btnLoginMobile.style.display = 'none';
        if (userInfoMobile) userInfoMobile.style.display = 'block';

        const avatarMobile = document.getElementById('avatarMobile');
        if (avatarMobile) {
            avatarMobile.innerHTML = avatarUrl
                ? '<img src="' + avatarUrl + '" alt="' + name + '">'
                : '';
            if (!avatarUrl) avatarMobile.textContent = initials;
        }
    } else {
        btnLoginDesktop.style.display = 'inline-flex';
        userInfoDesktop.style.display = 'none';
        if (btnLoginMobile) btnLoginMobile.style.display = 'inline-flex';
        if (userInfoMobile) userInfoMobile.style.display = 'none';
    }
}

// ── Logout ──
async function logout() {
    await supabaseShop.auth.signOut();
    localStorage.removeItem('customer');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    updateAuthUI(null);
}

// ── Session Check ──
async function checkSession() {
    const { data: { session } } = await supabaseShop.auth.getSession();
    updateAuthUI(session);

    supabaseShop.auth.onAuthStateChange((_event, session) => {
        updateAuthUI(session);
    });
}
