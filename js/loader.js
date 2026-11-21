// ============ TradeVault Cinematic Loader ============
(function () {
    if (window.__tvLoaderLoaded) return;
    window.__tvLoaderLoaded = 1;

    /* ---- font knobs: swap these three if your reference font differs ---- */
    const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const WEIGHT = 300;          // thin = premium
    const TRACKING = '0.42em';   // wide letter-spacing

    const WORD = 'TRADEVAULT';
    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const st = document.createElement('style');
    st.textContent = `
        #tvLoader { position: fixed; inset: 0; z-index: 2147483000; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1.4rem;
          background: radial-gradient(120% 90% at 50% 10%, #10161c 0%, #0B0D10 55%, #07090c 100%);
          transition: opacity .5s ease .15s; }
        #tvLoader.tvL-exit { opacity: 0; pointer-events: none; }
        .tvL-word { display: flex; font-family: ${FONT}; font-weight: ${WEIGHT}; letter-spacing: ${TRACKING};
          text-transform: uppercase; font-size: clamp(1.4rem, 6vw, 3rem); color: #D9E0E7; padding-left: ${TRACKING}; }
        .tvL-word span { display: inline-block; opacity: 0; transform: translateY(18px); filter: blur(8px);
          animation: tvLetter .8s cubic-bezier(.22,1,.36,1) forwards; }
        .tvL-word.tvL-shine span { background: linear-gradient(100deg, #8f979e 0%, #D9E0E7 40%, #ffffff 50%, #D9E0E7 60%, #8f979e 100%);
          background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: tvLetter .8s cubic-bezier(.22,1,.36,1) forwards, tvShine 2.4s ease-in-out 1s infinite; }
        @keyframes tvLetter { to { opacity: 1; transform: none; filter: blur(0); } }
        @keyframes tvShine { 0% { background-position: 120% 0; } 60%,100% { background-position: -120% 0; } }
        .tvL-line { height: 1px; width: 0; background: linear-gradient(90deg, transparent, #D9E0E7, transparent);
          animation: tvLine 1.3s cubic-bezier(.22,1,.36,1) .55s forwards; opacity: .85; }
        @keyframes tvLine { to { width: min(340px, 62vw); } }
        .tvL-cap { font-family: ${FONT}; font-size: .55rem; font-weight: 600; letter-spacing: .6em; padding-left: .6em;
          color: #6B737D; text-transform: uppercase; opacity: 0; animation: tvCap .8s ease 1.05s forwards; }
        @keyframes tvCap { to { opacity: 1; } }
        #tvLoader.tvL-exit .tvL-word span { animation: tvLetterOut .45s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes tvLetterOut { to { opacity: 0; transform: translateY(-16px); filter: blur(6px); } }
        #tvLoader.tvL-exit .tvL-line, #tvLoader.tvL-exit .tvL-cap { animation: tvFade .3s ease forwards; }
        @keyframes tvFade { to { opacity: 0; } }
        body.tv-booted #mainContent, body.tv-booted .navbar, body.tv-booted .hero { animation: tvPop .55s cubic-bezier(.22,1,.36,1); }
        @keyframes tvPop { from { opacity: 0; transform: scale(.985) translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .tvL-word span, .tvL-line, .tvL-cap { animation-duration: .01s !important; animation-delay: 0s !important; }
          .tvL-word.tvL-shine span { animation: none; color: #D9E0E7; background: none; }
        }
    `;
    document.head.appendChild(st);

    /* hide whatever old loader exists */
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
            `<span style="animation-delay:${(REDUCED ? 0 : 120 + i * 65)}ms">${ch}</span>`).join('');
        ov.innerHTML = `<div class="tvL-word" id="tvLWord">${letters}</div>
          <div class="tvL-line"></div>
          <div class="tvL-cap">Professional Trading Journal</div>`;
        (document.body || document.documentElement).appendChild(ov);
        setTimeout(() => { const w = document.getElementById('tvLWord'); if (w) w.classList.add('tvL-shine'); }, REDUCED ? 0 : 950);
    }

    function exit() {
        const ov = document.getElementById('tvLoader');
        if (!ov || ov.dataset.done) return;
        ov.dataset.done = '1';
        ov.classList.add('tvL-exit');
        document.body.classList.add('tv-booted');
        setTimeout(() => { ov.remove(); }, 900);
    }

    if (document.body) build();
    else document.addEventListener('DOMContentLoaded', build, { once: true });

    let loaded = false;
    function armExit() { if (loaded) return; loaded = true; setTimeout(exit, REDUCED ? 100 : 750); }
    if (document.readyState === 'complete') armExit();
    else window.addEventListener('load', armExit);
    setTimeout(exit, 4500);   /* failsafe — the loader can NEVER trap anyone */
})();
