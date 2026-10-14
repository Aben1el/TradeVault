// ============ TradeVault Moonstone Runtime Patch v3 ============
(function () {
    // ---- 0. Load plans + upgrade pack ----
    (function () { var s = document.createElement('script'); s.src = 'js/plans.js'; document.head.appendChild(s); })();
    (function () { var s = document.createElement('script'); s.src = 'js/upgrade.js'; document.head.appendChild(s); })();

    // ---- 1. Favicon fix (relative path) ----
    (function fixFavicon() {
        var link = document.querySelector('link[rel~="icon"]');
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.type = 'image/png';
        link.href = 'Images/favicon.png?v=6';
    })();

    // ---- 2. Hard overrides + Daylight light theme + mobile polish ----
    var ov = document.createElement('style');
    ov.textContent = [
        '.btn-primary, .btn-primary:hover { color: #0B0D10 !important; }',
        '::selection { background: rgba(217,224,231,.25); color: #0B0D10; }',
        'html[data-theme="light"] { --bg-primary:#EEF1F4; --bg-secondary:#F7F9FA; --bg-tertiary:#DDE3E8; --bg-card:rgba(255,255,255,0.8); --bg-glass:rgba(247,249,250,0.7); --text-primary:#2A3138; --text-secondary:#5A636B; --text-tertiary:#6B737D; --border-color:rgba(107,115,125,0.28); --border-hover:#6B737D; --accent-primary:#4A5259; --accent-secondary:#6B737D; --accent-gradient:linear-gradient(135deg,#7D858C 0%,#5A536B 100%); }',
        'html[data-theme="light"] .btn-primary, html[data-theme="light"] .btn-primary:hover { color: #F7F9FA !important; }',
        'html[data-theme="light"] ::selection { background: rgba(107,115,125,.25); color: #2A3138; }',
        '@media (max-width:640px){ .table-container{overflow-x:auto;-webkit-overflow-scrolling:touch;} #tradesTable{min-width:680px;} .modal{width:96vw;max-height:92vh;} .filters-bar{flex-wrap:wrap;} .filters-bar select,.filters-bar input[type="date"]{flex:1;min-width:46%;} }'
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
