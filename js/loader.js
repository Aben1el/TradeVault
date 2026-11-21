// ============ TradeVault Boot Overlay v7 ============
(function () {
    if (window.__tvBootLoaded) return;
    window.__tvBootLoaded = 1;

    ['js/themes.js', 'js/sbfix.js'].forEach(function (src) {
        var s = document.createElement('script'); s.src = src; document.head.appendChild(s);
    });

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN = REDUCED ? 400 : 2300;
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
        setTimeout(() => ov.remove(), 800);
    }
    function arm() {
        const elapsed = Date.now() - born;
        setTimeout(finish, Math.max(MIN - elapsed, 200));
    }

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm);
    setTimeout(finish, 4500);
})();
