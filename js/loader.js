// ============ TradeVault Luxury Boot Controller ============
(function() {
    // 1. Inject the loader immediately
    const loader = document.createElement('div');
    loader.id = 'tv-lux-loader';
    loader.innerHTML = '<div class="tv-lux-word">TRADEVAULT</div>';
    document.body.prepend(loader);
    
    // 2. Hide the site content initially
    document.body.classList.add('tv-loading');

    // 3. Wait for window load + animation time (2.4s)
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Reveal site
            document.body.classList.remove('tv-loading');
            document.body.classList.add('tv-ready');
            
            // Fade out loader
            loader.classList.add('done');
            
            // Remove from DOM completely
            setTimeout(() => loader.remove(), 1000);
        }, 2400); 
    });
})();
