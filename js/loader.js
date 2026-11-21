// ============ TradeVault Cinematic Loader v2 ============
(function () {
    if (window.__tvLoaderLoaded) return;
    window.__tvLoaderLoaded = 1;

    /* ---- font knobs ---- */
    const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const WEIGHT = 300;
    const TRACKING = '0.42em';
    const WORD = 'TRADEVAULT';
    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN_SHOW = REDUCED ? 200 : 1600;   // the wordmark always gets its moment

    const st = document.createElement('style');
    st.textContent = `
        #tvLoader { position: fixed; inset: 0; z-index: 2147483000; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1.3rem;
          background: radial-gradient(120% 90% at 50% 10%, #10161c 0%, #0B0D10 55%, #07090c 100%);
          opacity: 1; transition: opacity .5s ease; }
        #tvLoader.tvL-exit { opacity: 0; pointer-events: none; }
        .tvL-word { display: flex; font-family: ${FONT}; font-weight: ${WEIGHT}; letter-spacing: ${TRACKING};
          text-transform: uppercase; font-size: clamp(1.5rem, 6vw, 3.1rem); color: #D9E0E7; padding-left: ${TRACKING};
          transition: transform .5s cubic-bezier(.22,1,.36,1), filter .5s ease; }
        #tvLoader.tvL-exit .tvL-word { transform: scale(1.07); filter: blur(8px); }
        .tvL-word span { display: inline-block; opacity: 0; transform: translateY(16px); filter: blur(7px);
          animation: tvLetter .6s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes tvLetter { to { opacity: 1; transform: none; filter: blur(0); } }
        @supports ((-webkit-background-clip: text) or (background-clip: text)) {
          .tvL-word.tvL-shine span {
            background: linear-gradient(100deg, #8f979e 0%, #D9E0E7 40%, #ffffff 50%, #D9E0E7 60%, #8f979e 100%);
            background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
            animation: tvLetter .6s cubic-bezier(.22,1,.36,1) forwards, tvShine 2.2s ease-in-out .7s infinite; }
        }
        @keyframes tvShine { 0% { background-position: 120% 0; } 60%,100% { background-position: -120% 0; } }
        .tvL-line { height: 1px; width: 0; background: linear-gradient(90deg, transparent, #D9E0E7, transparent);
          animation: tvLine 1s cubic-bezier(.22,1,.36,1) .35s forwards; opacity: .85; }
        @keyframes tvLine { to { width: min(340px, 62vw); } }
        .tvL-cap { font-family: ${FONT}; font-size: .55rem; font-weight: 600; letter-spacing: .6em; padding-left: .6em;
          color: #6B737D; text-transform: uppercase; opacity: 0; animation: tvCap .7s ease .8s forwards; }
        @keyframes tvCap { to { opacity: 1; } }
        body.tv-booted #mainContent, body.tv-booted .navbar, body.tv-booted .hero { animation: tvPop .55s cubic-bezier(.22,1,.36,1); }
        @keyframes tvPop { from { opacity: 0; transform: scale(.985) translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .tvL-word span, .tvL-line, .tvL-cap { animation-duration: .01s !important; animation-delay: 0s !important; }
        }
    `;
    document.head.appendChild(st);

    function killOriginal() {
        document.querySelectorAll('#loadingScreen, #loader, .loading-screen, #loadingOverlay, .loader-overlay, #splash, #loading, .loader').forEach(el => {
            if (el.id !== 'tvLoader') el.style.display = 'none';
        });
        document.querySelectorAll('body > div, body > section').forEach(el => {
            if (el.id === 'tvLoader') return;
            const cs = getComputedStyle(el);
            if (cs.position === 'fixed' && el.offsetWidth >= innerWidth - 2 && el.offsetHeight >= innerHeight - 2 && parseInt(cs.zIndex || '0', 10) >= 40 && cs.display !== 'none') el.style.display = 'none';
        });
    }

    function build() {
        if (document.getElementById('tvLoader')) return;
        killOriginal();
        const ov = document.createElement('div');
        ov.id = 'tvLoader';
        const letters = WORD.split('').map((ch, i) =>
            `<span style="animation-delay:${(REDUCED ? 0 : 60 + i * 45)}ms">${ch}</span>`).join('');
        ov.innerHTML = `<div class="tvL-word" id="tvLWord">${letters}</div>
          <div class="tvL-line"></div>
          <div class="tvL-cap">Professional Trading Journal</div>`;
        (document.body || document.documentElement).appendChild(ov);
        setTimeout(() => { const w = document.getElementById('tvLWord'); if (w) w.classList.add('tvL-shine'); }, REDUCED ? 0 : 620);
    }

    const born = Date.now();
    let exited = false;
    function exit() {
        if (exited) return; exited = true;
        const ov = document.getElementById('tvLoader');
        if (!ov) return;
        ov.classList.add('tvL-exit');
        document.body.classList.add('tv-booted');
        setTimeout(() => ov.remove(), 700);
    }
    function armExit() {
        const elapsed = Date.now() - born;
        const delay = Math.max(MIN_SHOW - elapsed, 350);
        setTimeout(exit, delay);
    }

    if (document.body) build();
    else document.addEventListener('DOMContentLoaded', build, { once: true });

    if (document.readyState === 'complete') armExit();
    else window.addEventListener('load', armExit);
    setTimeout(exit, 4500);   /* failsafe — never trap anyone */
})();
