// ============ TradeVault Boot Controller v4 — true per-letter typing ============
(function () {
    if (window.__tvLoaderLoaded) return;
    window.__tvLoaderLoaded = 1;

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const WORD = 'TRADEVAULT';
    const STEP = REDUCED ? 0 : 90;        // ms between letters
    const MIN_SHOW = REDUCED ? 300 : 1600;
    const born = Date.now();
    let done = false;

    function build() {
        if (document.getElementById('tvBootWord')) return;
        const w = document.createElement('div');
        w.id = 'tvBootWord';
        w.innerHTML = WORD.split('').map(ch => `<span>${ch}</span>`).join('');
        (document.body || document.documentElement).appendChild(w);
        const spans = w.querySelectorAll('span');
        if (REDUCED) { spans.forEach(s => s.classList.add('on')); return; }
        let i = 0;
        const tick = setInterval(() => {
            if (i < spans.length) {
                if (i > 0) spans[i - 1].classList.remove('cur');
                spans[i].classList.add('on', 'cur');
                i++;
            } else {
                clearInterval(tick);   // caret keeps blinking on the last letter
            }
        }, STEP);
    }

    function finish() {
        if (done) return; done = true;
        document.documentElement.classList.add('tv-ready');
        document.body.classList.add('tv-booted');
        setTimeout(() => { const w = document.getElementById('tvBootWord'); if (w) w.remove(); }, 700);
    }
    function arm() {
        const elapsed = Date.now() - born;
        setTimeout(finish, Math.max(MIN_SHOW - elapsed, 250));
    }

    if (document.body) build();
    else document.addEventListener('DOMContentLoaded', build, { once: true });

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm);
    setTimeout(finish, 4500);   /* failsafe — never trap anyone */
})();
