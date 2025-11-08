// Component loader
document.addEventListener('DOMContentLoaded', function() {
    // Load all components
    const components = document.querySelectorAll('[data-include]');
    
    components.forEach(component => {
        const file = component.getAttribute('data-include');
        
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                component.innerHTML = data;
                
                // Re-initialize Feather Icons for loaded components
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
                
                // Initialize mobile menu functionality
                initializeMobileMenu();
            })
            .catch(error => {
                console.error('Error loading component:', error);
                component.innerHTML = '<p>Component failed to load</p>';
            });
    });
    
    // Mobile menu functionality
    function initializeMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuButton && mobileMenu) {
            // Remove any existing event listeners
            menuButton.replaceWith(menuButton.cloneNode(true));
            const newMenuButton = document.getElementById('mobile-menu-button');
            
            newMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                
                // Update icon
                const icon = newMenuButton.querySelector('i');
                if (icon) {
                    if (mobileMenu.classList.contains('hidden')) {
                        icon.setAttribute('data-feather', 'menu');
                    } else {
                        icon.setAttribute('data-feather', 'x');
                    }
                    feather.replace();
                }
            });
        }
    }
    
    // Initialize mobile menu on first load
    initializeMobileMenu();
});