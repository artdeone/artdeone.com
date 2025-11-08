
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
        
        feather.replace();
        
        // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                feather.replace();
            } else {
                menu.classList.add('hidden');
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        function toggleOutline(outlineId) {
        const outline = document.getElementById(outlineId);
        const chevron = document.getElementById(outlineId.replace('-outline', '-chevron'));
        
        outline.classList.toggle('hidden');
        chevron.classList.toggle('rotate-180');
    }
       
   
    // Portfolio Filter Functionality - Only "All Work" remains
    document.addEventListener('DOMContentLoaded', function() {
        const filterButton = document.querySelector('.portfolio-filter');
        
        // Keep only All Work button active
        filterButton.classList.add('active');
        filterButton.style.backgroundColor = '#9dae11';
        filterButton.style.color = 'white';
        filterButton.style.borderColor = '#9dae11';
    });

    // Wait for everything to load
    window.addEventListener('load', function() {
        // Simple fade-up animation that always works
        gsap.to("#hero-text-1", {
            duration: 1.5,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            delay: 0.3
        });
        
        gsap.to("#hero-text-2", {
            duration: 1.5,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            delay: 0.8
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Check if GSAP is loaded
        if (typeof gsap !== 'undefined') {
            // Animate when hero section is in view
            gsap.to("#hero-text-1", {
                scrollTrigger: {
                    trigger: "#hero-text-1",
                    start: "top 80%"
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power2.out"
            });
            
            gsap.to("#hero-text-2", {
                scrollTrigger: {
                    trigger: "#hero-text-2", 
                    start: "top 80%"
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.4
            });
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const serviceTabs = document.querySelectorAll('.service-tab');
        const servicePanels = document.querySelectorAll('.service-panel');
        
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and panels
                serviceTabs.forEach(t => t.classList.remove('active'));
                servicePanels.forEach(p => p.classList.add('hidden'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding panel
                const serviceType = this.getAttribute('data-service');
                const targetPanel = document.getElementById(`${serviceType}-panel`);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');
                }
            });
        });
    });

    // Text reveal animation on scroll
    document.addEventListener('DOMContentLoaded', function() {
        const textElements = document.querySelectorAll('.text-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });
        
        textElements.forEach(el => {
            observer.observe(el);
        });
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (target === 5.0 ? '.0' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (target === 5.0 ? '.0' : '+');
            }
        }, 16);
    }

    // Animate stats when they come into view
    function animateStats() {
        const statItems = document.querySelectorAll('.stat-item');
        const counters = document.querySelectorAll('.counter');
        
        // Fade in stats one by one
        statItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, index * 200);
        });

        // Start counter animations
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            animateCounter(counter, target);
        });
    }

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Animate stats immediately for home section
        animateStats();
    });

    // Simple click interaction
    document.addEventListener('DOMContentLoaded', function() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            item.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.05)';
                }, 150);
            });
            
            // Reset transform when mouse leaves
            item.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    });

    // Dropdown toggle function for client information
    function toggleClientInfo(id) {
        const content = document.getElementById(id);
        const toggle = content.previousElementSibling;
        
        content.classList.toggle('show');
        toggle.classList.toggle('active');
    }

    // Service tab functionality (make sure this is working)
    document.addEventListener('DOMContentLoaded', function() {
        const serviceTabs = document.querySelectorAll('.service-tab');
        const servicePanels = document.querySelectorAll('.service-panel');
        
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and panels
                serviceTabs.forEach(t => t.classList.remove('active'));
                servicePanels.forEach(p => p.classList.add('hidden'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding panel
                const serviceType = this.getAttribute('data-service');
                const targetPanel = document.getElementById(`${serviceType}-panel`);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');
                }
            });
        });
    });

// Disable zooming on mobile
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
});

document.addEventListener('gesturechange', function(event) {
    event.preventDefault();
});

document.addEventListener('gestureend', function(event) {
    event.preventDefault();
}); 

