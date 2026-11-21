// ============ TradeVault Boot Overlay v5 — sits on top, changes nothing ============
(function () {
    if (window.__tvBootLoaded) return;
    window.__tvBootLoaded = 1;

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN = REDUCED ? 400 : 2300;   // word gets its full breath
    const born = Date.now();

    const ov = document.createElement('div');
    ov.id = 'tvBoot';
    ov.innerHTML = '<div class="tvBoot-word">TRADEVAULT</div>';
    (document.body || document.documentElement).appendChild(ov);

    let done = false;
    function finish() {
        if (done) return; done = true;
        ov.classList.add('done');
        setTimeout(() => ov.remove(), 800);
    }
    function arm() {
        const elapsed = Date.now() - born;
        setTimeout(finish, Math.max(MIN - elapsed, 200));
    }

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm);
    setTimeout(finish, 4500);   /* failsafe — overlay can never stay */
})();
