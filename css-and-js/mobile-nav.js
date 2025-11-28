
    // Initialize Icons (Still needed for mobile menu burger icon)
    if(typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Mobile Menu Toggle Logic
    const btn = document.getElementById("mobile-menu-button");
    const menu = document.getElementById("mobile-menu");
    
    if(btn && menu) {
        btn.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    }

