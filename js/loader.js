// ============ TradeVault Boot Controller v3 (CSS performs; this ends the show) ============
(function () {
    if (window.__tvLoaderLoaded) return;
    window.__tvLoaderLoaded = 1;

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN_SHOW = REDUCED ? 300 : 1400;   // the word always gets its moment
    const born = Date.now();
    let done = false;

    function finish() {
        if (done) return; done = true;
        document.documentElement.classList.add('tv-ready');
        document.body.classList.add('tv-booted');
    }
    function arm() {
        const elapsed = Date.now() - born;
        setTimeout(finish, Math.max(MIN_SHOW - elapsed, 250));
    }

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm);
    setTimeout(finish, 4500);   /* failsafe — never trap anyone */
})();
