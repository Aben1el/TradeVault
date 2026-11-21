// ============ TradeVault Sidebar Fix — one toggle that always works ============
(function () {
    if (window.__tvSbFixLoaded) return;
    window.__tvSbFixLoaded = 1;

    const st = document.createElement('style');
    st.textContent = `
        @media (min-width: 769px) {
          body:not(.tv-sb-min) .sidebar { width: var(--sidebar-width, 260px) !important; }
          body:not(.tv-sb-min) .sidebar .nav-item { font-size: .82rem !important; }
          body:not(.tv-sb-min) .sidebar .nav-item span:not(.nav-icon),
          body:not(.tv-sb-min) .sidebar .nav-item p:not(.nav-icon) { display: inline !important; }
          body:not(.tv-sb-min) #mainContent, body:not(.tv-sb-min) .main-content, body:not(.tv-sb-min) main { margin-left: var(--sidebar-width, 260px) !important; }
          .sidebar > div:first-of-type { display: flex !important; align-items: center; gap: .45rem; padding: .9rem .8rem; }
          #tvSbBtn { margin-left: auto; width: 34px; height: 34px; min-height: 34px; padding: 0; border-radius: 50%;
            display: flex !important; align-items: center; justify-content: center; font-size: 1rem; line-height: 1;
            color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-color);
            cursor: pointer; z-index: 10; }
          #tvSbBtn:hover { color: var(--text-primary); border-color: var(--border-hover); }
          body.tv-sb-min .sidebar { width: 76px !important; }
          body.tv-sb-min .sidebar .nav-item { justify-content: center; font-size: 0 !important; }
          body.tv-sb-min .sidebar .nav-item svg { width: 20px; height: 20px; }
          body.tv-sb-min .sidebar .nav-item span:not(.nav-icon),
          body.tv-sb-min .sidebar .nav-item p:not(.nav-icon) { display: none !important; }
          body.tv-sb-min #sidebarBrand span, body.tv-sb-min #sidebarBrand strong,
          body.tv-sb-min .sidebar .brand-text { display: none !important; }
          body.tv-sb-min #mainContent, body.tv-sb-min .main-content, body.tv-sb-min main { margin-left: 76px !important; }
          body.tv-sb-min .sidebar-footer .btn, body.tv-sb-min .sidebar-footer strong,
          body.tv-sb-min .sidebar-footer small, body.tv-sb-min .sidebar-footer div div { display: none !important; }
          body.tv-sb-min .sidebar-footer { align-items: center; padding: .6rem .3rem; }
          body.tv-sb-min .sidebar-footer img { display: block; margin: 0 auto; }
        }
    `;
    document.head.appendChild(st);

    const DEAD = ['sb-collapsed', 'sidebar-collapsed', 'collapsed', 'sb-min', 'sidebar-min', 'mini'];
    const isMin = () => document.body.classList.contains('tv-sb-min');

    function cleanStuck() {
        DEAD.forEach(c => { document.body.classList.remove(c); const sb = document.querySelector('.sidebar'); if (sb) sb.classList.remove(c); });
        const sb = document.querySelector('.sidebar');
        if (sb) sb.style.width = '';
    }

    function glyph(btn) { btn.textContent = isMin() ? '»' : '«'; }

    function toggle() {
        document.body.classList.toggle('tv-sb-min');
        cleanStuck();
        localStorage.setItem('tv_sb_min', isMin() ? '1' : '0');
        const b = document.getElementById('tvSbBtn');
        if (b) glyph(b);
        window.dispatchEvent(new Event('resize'));
        if (window.showToast) showToast('Sidebar: ' + (isMin() ? 'collapsed' : 'expanded'));
    }

    function install() {
        const sb = document.querySelector('.sidebar');
        if (!sb || sb.__sbFixDone) return;
        sb.__sbFixDone = 1;

        /* apply persisted state + clear stuck classes */
        if (localStorage.getItem('tv_sb_min') === '1') document.body.classList.add('tv-sb-min');
        cleanStuck();

        const row = sb.querySelector(':scope > div:first-of-type') || sb;

        /* delete old/dead toggles in the row (keep theme button) */
        Array.from(row.children).forEach(el => {
            const t = (el.textContent || '').trim();
            if (el.id !== 'tvSbBtn' && ['«', '»', '‹', '›'].includes(t)) el.style.display = 'none';
            if (el.id && /collapse/i.test(el.id)) el.style.display = 'none';
            if (el.className && typeof el.className === 'string' && /collapse/i.test(el.className)) el.style.display = 'none';
        });
        const old = document.getElementById('tvSbBtn');
        if (old) old.remove();

        const b = document.createElement('button');
        b.id = 'tvSbBtn'; b.type = 'button'; b.title = 'Collapse / expand sidebar';
        glyph(b);
        if (row === sb) b.style.cssText += 'position:absolute;top:10px;right:8px;';
        row.appendChild(b);
    }

    /* capture-phase delegated handler — nothing can eat this click */
    document.addEventListener('click', e => {
        if (e.target.closest('#tvSbBtn')) { e.preventDefault(); e.stopPropagation(); toggle(); }
    }, true);

    if (document.readyState === 'complete') setTimeout(install, 500);
    else window.addEventListener('load', () => setTimeout(install, 500));
    new MutationObserver(() => install()).observe(document.body, { childList: true, subtree: true });
})();
