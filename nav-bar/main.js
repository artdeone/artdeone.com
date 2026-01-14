// /nav-bar/main.js

async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
        // 1. Fetch the external HTML
        const response = await fetch('/nav-bar/navbar.html');
        if (!response.ok) throw new Error('Navbar file not found');
        const data = await response.text();
        
        // 2. Inject the HTML into your page
        placeholder.innerHTML = data;

        // 3. Initialize Feather Icons (Draws the Hamburger)
        if (window.feather) {
            feather.replace();
        }

        // 4. Attach Mobile Menu Logic
        setupMobileMenu();

        // 5. Highlight the Active Page link
        highlightCurrentPage();

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        // We use onclick to ensure only one function handles the click
        btn.onclick = function(e) {
            e.preventDefault();
            
            // Toggle the 'hidden' class on the menu div
            const isMenuHidden = menu.classList.toggle('hidden');
            
            // Change the icon from "menu" to "x"
            const icon = btn.querySelector('i');
            if (icon && window.feather) {
                icon.setAttribute('data-feather', isMenuHidden ? 'menu' : 'x');
                feather.replace();
            }
        };
    } else {
        // If the navbar loaded but JS can't find the IDs, log an error
        console.error('Mobile menu IDs not found in navbar.html');
    }
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    // Select both desktop and mobile links
    const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Match the href with the current URL path
        if (href === currentPath || (currentPath === '/' && href === '/index.html')) {
            link.classList.add('font-bold', 'text-black');
            link.style.color = '#000'; // Extra safety
        }
    });
}

// Start the whole process when the browser is ready
document.addEventListener('DOMContentLoaded', loadNavbar);