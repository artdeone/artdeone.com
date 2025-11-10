// navigation.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('data-feather', 'menu');
            } else {
                icon.setAttribute('data-feather', 'x');
            }
            
            // Re-render feather icon
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
            
            // Reset menu icon
            const icon = mobileMenuButton.querySelector('i');
            icon.setAttribute('data-feather', 'menu');
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    });
});