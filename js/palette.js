// ============ TradeVault Moonstone + Liquid Glass Runtime Patch v5 ============
(function () {
    if (window.__tvPaletteLoaded) return;   // never run twice
    window.__tvPaletteLoaded = 1;

    // ---- 0. Load plans + upgrade + mobile packs ----
    ['js/plans.js', 'js/upgrade.js', 'js/mobile.js'].forEach(function (src) {
        var s = document.createElement('script'); s.src = src; document.head.appendChild(s);
    });

    // ---- 1. Favicon fix (relative path) ----
    (function fixFavicon() {
        var link = document.querySelector('link[rel~="icon"]');
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.type = 'image/png';
        link.href = 'Images/favicon.png?v=6';
    })();

    // ---- 2. LIQUID GLASS LAYER ----
    var gl = document.createElement('style');
    gl.textContent = `
        /* ambient liquid glow drifting behind everything */
        body::before { content: ''; position: fixed; inset: -25%; z-index: -1; pointer-events: none;
          background:
            radial-gradient(38% 34% at 22% 18%, rgba(217,224,231,.10), transparent 60%),
            radial-gradient(30% 30% at 78% 32%, rgba(107,115,125,.13), transparent 60%),
            radial-gradient(36% 38% at 50% 84%, rgba(217,224,231,.07), transparent 60%);
          filter: blur(34px);
          animation: tvDrift 26s ease-in-out infinite alternate; }
        @keyframes tvDrift {
          0%   { transform: translate3d(-2%, -1%, 0) scale(1); }
          50%  { transform: translate3d(2%, 2%, 0) scale(1.07); }
          100% { transform: translate3d(-1%, 2%, 0) scale(1.02); } }
        @keyframes tvFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .section { animation: tvFadeUp .45s cubic-bezier(.22,1,.36,1); }

        /* frosted glass surfaces */
        .card, .stat-card, .today-card, .trade-card, .chart-container, .calculator-card,
        .monthly-item, .recent-row, .smart-insight, .plan-card2, .review-card, .goal-card, .strategy-card {
          background: rgba(217, 224, 231, 0.055) !important;
          backdrop-filter: blur(14px) saturate(130%);
          -webkit-backdrop-filter: blur(14px) saturate(130%);
          border: 1px solid rgba(217, 224, 231, 0.10) !important;
          box-shadow: 0 8px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.07);
          border-radius: 16px;
          transition: transform .35s cubic-bezier(.22,1,.36,1), border-color .35s ease, box-shadow .35s ease, background .35s ease; }
        .card:hover, .stat-card:hover, .today-card:hover, .trade-card:hover, .chart-container:hover {
          transform: translateY(-3px);
          border-color: rgba(217,224,231,.22) !important;
          background: rgba(217,224,231,.08) !important;
          box-shadow: 0 14px 40px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.10); }

        /* glass shell: sidebar, modals, navs */
        .sidebar { background: rgba(11,13,16,.55) !important; backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%); border-right: 1px solid rgba(217,224,231,.08) !important; }
        .nav-item.active { background: rgba(217,224,231,.10) !important; border: 1px solid rgba(217,224,231,.16); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
        .modal { background: rgba(17,20,24,.72) !important; backdrop-filter: blur(24px) saturate(140%); -webkit-backdrop-filter: blur(24px) saturate(140%);
          border: 1px solid rgba(217,224,231,.14) !important; box-shadow: 0 30px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08); }
        .modal-overlay { background: rgba(6,8,10,.55) !important; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        #tvBottomNav { background: rgba(11,13,16,.62) !important; backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); border-top: 1px solid rgba(217,224,231,.10) !important; }
        #tvSheet { background: rgba(11,13,16,.78) !important; backdrop-filter: blur(24px) saturate(150%); -webkit-backdrop-filter: blur(24px) saturate(150%); }
        .navbar, .landing-nav { background: rgba(11,13,16,.45) !important; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(217,224,231,.08); }

        /* liquid buttons: glass body + light sweep on hover */
        .btn { position: relative; overflow: hidden; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .btn::after { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.28), transparent);
          transform: skewX(-18deg); transition: left .55s ease; pointer-events: none; }
        .btn:hover::after { left: 120%; }
        .btn-secondary { background: rgba(217,224,231,.08) !important; border: 1px solid rgba(217,224,231,.14) !important; }
        .btn-primary { box-shadow: 0 6px 20px rgba(217,224,231,.18), inset 0 1px 0 rgba(255,255,255,.35); }
        .filter-btn, .month-btn { background: rgba(217,224,231,.06) !important; border: 1px solid rgba(217,224,231,.10) !important; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .filter-btn.active, .month-btn.active { background: rgba(217,224,231,.16) !important; border-color: rgba(217,224,231,.28) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.12); }

        /* glass inputs */
        input, select, textarea, .form-control {
          background: rgba(217,224,231,.06) !important; border: 1px solid rgba(217,224,231,.12) !important;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        input:focus, select:focus, textarea:focus, .form-control:focus {
          background: rgba(217,224,231,.10) !important; border-color: rgba(217,224,231,.30) !important;
          box-shadow: 0 0 0 3px rgba(217,224,231,.10), inset 0 1px 0 rgba(255,255,255,.06); }

        /* glass scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(217,224,231,.18); border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(217,224,231,.30); }

        /* phone: lighter blur = smooth scrolling */
        @media (max-width: 768px) {
          .card, .stat-card, .today-card, .trade-card, .chart-container, .calculator-card,
          .monthly-item, .recent-row, .smart-insight, .plan-card2 { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          body::before { animation: none; }
          .btn::after { display: none; }
        }

        /* Daylight = frosted white glass */
        html[data-theme="light"] body::before { opacity: .55; }
        html[data-theme="light"] .card, html[data-theme="light"] .stat-card, html[data-theme="light"] .today-card,
        html[data-theme="light"] .trade-card, html[data-theme="light"] .chart-container, html[data-theme="light"] .calculator-card,
        html[data-theme="light"] .monthly-item, html[data-theme="light"] .recent-row, html[data-theme="light"] .smart-insight,
        html[data-theme="light"] .plan-card2 {
          background: rgba(255,255,255,.55) !important; border-color: rgba(107,115,125,.18) !important;
          box-shadow: 0 8px 28px rgba(34,40,46,.10), inset 0 1px 0 rgba(255,255,255,.7); }
        html[data-theme="light"] .modal { background: rgba(251,252,252,.80) !important; }
        html[data-theme="light"] .sidebar, html[data-theme="light"] #tvBottomNav, html[data-theme="light"] #tvSheet { background: rgba(251,252,252,.66) !important; }
        html[data-theme="light"] .btn-secondary, html[data-theme="light"] .filter-btn, html[data-theme="light"] .month-btn { background: rgba(255,255,255,.60) !important; }
        html[data-theme="light"] input, html[data-theme="light"] select, html[data-theme="light"] textarea, html[data-theme="light"] .form-control { background: rgba(255,255,255,.65) !important; }
    `;
    document.head.appendChild(gl);

    // ---- 3. Overrides + Daylight base ----
    var ov = document.createElement('style');
    ov.textContent = [
        '.btn-primary, .btn-primary:hover { color: #0B0D10 !important; }',
        '::selection { background: rgba(217,224,231,.25); color: #0B0D10; }',
        'html[data-theme="light"] { --bg-primary:#EDF0F2; --bg-secondary:#FBFCFC; --bg-tertiary:#E1E6E9; --bg-card:rgba(255,255,255,.86); --bg-glass:rgba(251,252,252,.7); --text-primary:#22282E; --text-secondary:#57616A; --text-tertiary:#6B737D; --border-color:rgba(107,115,125,.22); --border-hover:#8A9299; --accent-primary:#3E464E; --accent-secondary:#6B737D; --accent-gradient:linear-gradient(135deg,#6B737D 0%,#4A5259 100%); --shadow-md:0 4px 16px rgba(34,40,46,.12); }',
        'html[data-theme="light"] .btn-primary, html[data-theme="light"] .btn-primary:hover { color: #FBFCFC !important; }',
        'html[data-theme="light"] ::selection { background: rgba(107,115,125,.25); color: #22282E; }'
    ].join('\n');
    document.head.appendChild(ov);

    // ---- 4. Color mapping -> Moonstone ----
    var PAIRS = [
        [/rgba\(\s*99\s*,\s*102\s*,\s*241/gi, 'rgba(217, 224, 231'],
        [/rgba\(\s*139\s*,\s*92\s*,\s*246/gi, 'rgba(107, 115, 125'],
        [/rgba\(\s*95\s*,\s*180\s*,\s*196/gi, 'rgba(217, 224, 231'],
        [/rgba\(\s*74\s*,\s*159\s*,\s*176/gi, 'rgba(107, 115, 125'],
        [/rgba\(\s*124\s*,\s*127\s*,\s*242/gi, 'rgba(217, 224, 231'],
        [/rgba\(\s*17\s*,\s*33\s*,\s*45/gi, 'rgba(21, 24, 28'],
        [/rgba\(\s*37\s*,\s*55\s*,\s*69/gi, 'rgba(34, 38, 43'],
        [/#7c7ff2/gi, '#D9E0E7'], [/#6366f1/gi, '#D9E0E7'],
        [/#8b5cf6/gi, '#AEB6BF'], [/#9aa0f5/gi, '#C3CBD4'],
        [/#6f74e8/gi, '#99A1AA'], [/#a78bfa/gi, '#C3CBD4'],
        [/#5f64d6/gi, '#848C95'], [/#5FB4C4/gi, '#D9E0E7'],
        [/#4A9FB0/gi, '#AEB6BF'], [/#7FC8D4/gi, '#C3CBD4'],
        [/#3A8A9A/gi, '#848C95'], [/#6BA4C4/gi, '#99A1AA'],
        [/#8BB8C8/gi, '#C3CBD4'],
        [/#06141B/gi, '#0B0D10'], [/#11212D/gi, '#15181C'],
        [/#253745/gi, '#22262B'], [/#4A5C6A/gi, '#6B737D'],
        [/#5A6E7E/gi, '#6B737D'], [/#6B7A84/gi, '#6B737D'],
        [/#9BA8AB/gi, '#A6AEB6'], [/#CCD0CF/gi, '#D9E0E7']
    ];
    function fix(s) { return PAIRS.reduce(function (out, p) { return out.replace(p[0], p[1]); }, s); }
    function walk(rules) {
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            if (r.style && r.style.cssText) {
                var nt = fix(r.style.cssText);
                if (nt !== r.style.cssText) { try { r.style.cssText = nt; } catch (e) {} }
            }
            if (r.cssRules && r.cssRules.length) { try { walk(r.cssRules); } catch (e) {} }
        }
    }
    function patchSheet(sh) { try { walk(sh.cssRules); } catch (e) {} }
    function patchAll() { for (var i = 0; i < document.styleSheets.length; i++) patchSheet(document.styleSheets[i]); }
    function patchInline() {
        document.querySelectorAll('[style]').forEach(function (el) {
            var cur = el.getAttribute('style'); var nt = fix(cur);
            if (nt !== cur) el.setAttribute('style', nt);
        });
        document.querySelectorAll('stop').forEach(function (s) {
            var v = s.getAttribute('stop-color');
            if (v) { var nt = fix(v); if (nt !== v) s.setAttribute('stop-color', nt); }
        });
    }
    function run() { patchAll(); patchInline(); }
    if (document.readyState === 'complete') { setTimeout(run, 200); setTimeout(run, 1200); }
    else window.addEventListener('load', function () { setTimeout(run, 200); setTimeout(run, 1200); });
    new MutationObserver(function (muts) {
        muts.forEach(function (m) {
            m.addedNodes.forEach(function (n) {
                if (n.tagName === 'STYLE') setTimeout(function () {
                    for (var i = 0; i < document.styleSheets.length; i++)
                        if (document.styleSheets[i].ownerNode === n) patchSheet(document.styleSheets[i]);
                }, 50);
            });
        });
    }).observe(document.head, { childList: true });

    // ---- 5. Chart defaults ----
    if (window.Chart) {
        Chart.defaults.color = '#A6AEB6';
        Chart.defaults.borderColor = 'rgba(107,115,125,0.25)';
    }
})();
