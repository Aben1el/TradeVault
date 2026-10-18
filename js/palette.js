// ============ TradeVault Moonstone Runtime Patch v4 ============
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

    // ---- 2. Overrides + Daylight light theme (refined) ----
    var ov = document.createElement('style');
    ov.textContent = [
        '.btn-primary, .btn-primary:hover { color: #0B0D10 !important; }',
        '::selection { background: rgba(217,224,231,.25); color: #0B0D10; }',
        /* Daylight — Moonstone light theme, complete */
        'html[data-theme="light"] { --bg-primary:#EDF0F2; --bg-secondary:#FBFCFC; --bg-tertiary:#E1E6E9; --bg-card:rgba(255,255,255,.86); --bg-glass:rgba(251,252,252,.7); --text-primary:#22282E; --text-secondary:#57616A; --text-tertiary:#6B737D; --border-color:rgba(107,115,125,.22); --border-hover:#8A9299; --accent-primary:#3E464E; --accent-secondary:#6B737D; --accent-gradient:linear-gradient(135deg,#6B737D 0%,#4A5259 100%); --shadow-md:0 4px 16px rgba(34,40,46,.12); }',
        'html[data-theme="light"] .btn-primary, html[data-theme="light"] .btn-primary:hover { color: #FBFCFC !important; }',
        'html[data-theme="light"] .card, html[data-theme="light"] .stat-card, html[data-theme="light"] .today-card, html[data-theme="light"] .chart-container { background: rgba(255,255,255,.92); border-color: rgba(107,115,125,.18); box-shadow: 0 2px 10px rgba(34,40,46,.06); }',
        'html[data-theme="light"] input, html[data-theme="light"] select, html[data-theme="light"] textarea, html[data-theme="light"] .form-control { background: #F1F4F6; color: #22282E; border-color: rgba(107,115,125,.25); }',
        'html[data-theme="light"] .sidebar, html[data-theme="light"] .modal { background: #FBFCFC; }',
        'html[data-theme="light"] ::selection { background: rgba(107,115,125,.25); color: #22282E; }'
    ].join('\n');
    document.head.appendChild(ov);

    // ---- 3. Color mapping -> Moonstone ----
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

    // ---- 4. Chart defaults ----
    if (window.Chart) {
        Chart.defaults.color = '#A6AEB6';
        Chart.defaults.borderColor = 'rgba(107,115,125,0.25)';
    }
})();
