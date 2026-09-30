// ============ TradeVault Palette Patch: purple → slate/teal everywhere ============
(function () {
    const PAIRS = [
        [/rgba\(\s*99\s*,\s*102\s*,\s*241/gi, 'rgba(95, 180, 196'],
        [/rgba\(\s*139\s*,\s*92\s*,\s*246/gi, 'rgba(74, 159, 176'],
        [/#7c7ff2/gi, '#5FB4C4'],
        [/#6366f1/gi, '#5FB4C4'],
        [/#8b5cf6/gi, '#4A9FB0'],
        [/#9aa0f5/gi, '#7FC8D4'],
        [/#6f74e8/gi, '#4A9FB0'],
        [/#a78bfa/gi, '#8BB8C8'],
        [/#5f64d6/gi, '#3A8A9A']
    ];
    const fix = s => PAIRS.reduce((out, p) => out.replace(p[0], p[1]), s);

    function walk(rules) {
        for (let i = 0; i < rules.length; i++) {
            const r = rules[i];
            if (r.style && r.style.cssText) {
                const nt = fix(r.style.cssText);
                if (nt !== r.style.cssText) { try { r.style.cssText = nt; } catch (e) {} }
            }
            if (r.cssRules && r.cssRules.length) { try { walk(r.cssRules); } catch (e) {} }
        }
    }
    function patchSheet(sheet) { try { walk(sheet.cssRules); } catch (e) {} }
    function patchAll() { for (const sh of document.styleSheets) patchSheet(sh); }

    function patchInline() {
        document.querySelectorAll('[style]').forEach(el => {
            const cur = el.getAttribute('style');
            const nt = fix(cur);
            if (nt !== cur) el.setAttribute('style', nt);
        });
    }

    function run() { patchAll(); patchInline(); }

    if (document.readyState === 'complete') setTimeout(run, 200);
    else window.addEventListener('load', () => setTimeout(run, 200));

    // Patch <style> tags injected later by other modules
    new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(n => {
            if (n.tagName === 'STYLE') setTimeout(() => {
                for (const sh of document.styleSheets) if (sh.ownerNode === n) patchSheet(sh);
            }, 50);
        }));
    }).observe(document.head, { childList: true });

    // Chart text/grid colors
    if (window.Chart) {
        Chart.defaults.color = '#9BA8AB';
        Chart.defaults.borderColor = 'rgba(74,92,106,0.25)';
    }
})();
