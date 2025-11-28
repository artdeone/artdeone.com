// Mobile Menu with Smooth Animation
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    
    menu.classList.toggle('open');
    btn.classList.toggle('open');
});