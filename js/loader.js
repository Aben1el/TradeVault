// ============ TradeVault Boot Overlay ============
(function () {
    if (window.__tvBootLoaded) return;
    window.__tvBootLoaded = 1;

    (function () { var s = document.createElement('script'); s.src = 'js/themes.js?v=3'; document.head.appendChild(s); })();

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN = REDUCED ? 300 : 1100;   // faster boot
    const born = Date.now();

    const ov = document.createElement('div');
    ov.id = 'tvBoot';
    ov.innerHTML = '<div class="tvBoot-word">TRADEVAULT</div>';
    (document.body || document.documentElement).appendChild(ov);

    let done = false;
    function finish() {
        if (done) return; done = true;
        document.body.classList.add('tv-booted');
        ov.classList.add('done');
        setTimeout(() => ov.remove(), 600);
    }
    function arm() {
        const elapsed = Date.now() - born;
        setTimeout(finish, Math.max(MIN - elapsed, 150));
    }

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm);
    setTimeout(finish, 4000);
})();
