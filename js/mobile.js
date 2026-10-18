// ============ TradeVault Mobile Perfection Pack ============
(function () {
    const st = document.createElement('style');
    st.textContent = `
        #tvBottomNav { position: fixed; left: 0; right: 0; bottom: 0; z-index: 120; display: none;
          grid-template-columns: repeat(5, 1fr); background: rgba(11,13,16,.94);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(107,115,125,.35);
          padding: .3rem .2rem calc(.3rem + env(safe-area-inset-bottom)); }
        #tvBottomNav button { display: flex; flex-direction: column; align-items: center; gap: .15rem;
          background: none; border: none; color: #6B737D; font: 600 .62rem Inter, sans-serif; letter-spacing: .02em;
          padding: .3rem 0; min-height: 46px; cursor: pointer; touch-action: manipulation; }
        #tvBottomNav button svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        #tvBottomNav button.active { color: #D9E0E7; }
        #tvBottomNav button.active svg { stroke-width: 2.4; }
        @media (max-width: 768px) {
            body.tv-app-mode { padding-bottom: calc(70px + env(safe-area-inset-bottom)); }
            body.tv-app-mode #tvBottomNav { display: grid; }
            h1 { font-size: 1.3rem; }
            .dash-header { flex-wrap: wrap; gap: .6rem; }
            .stats-grid, .today-grid { grid-template-columns: repeat(2, 1fr) !important; gap: .6rem !important; }
            .journal-grid, .calculators-grid, .calc-grid, .analytics-full-grid { grid-template-columns: 1fr !important; }
            .chart-container { height: 250px !important; padding: .8rem !important; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            #tradesTable { min-width: 640px; font-size: .78rem; }
            #tradesTable td, #tradesTable th { padding: .55rem .6rem; }
            .modal { width: 94vw !important; max-height: 90vh !important; }
            .modal-body { overflow-y: auto; max-height: 60vh; }
            .modal-footer { position: sticky; bottom: 0; background: var(--bg-secondary); flex-wrap: wrap; }
            .btn { min-height: 44px; touch-action: manipulation; }
            .filters-bar { flex-wrap: wrap; gap: .5rem; }
            .filters-bar select, .filters-bar input { flex: 1 1 46%; min-width: 46%; }
            .back-btn { bottom: calc(82px + env(safe-area-inset-bottom)) !important; right: .9rem !important; }
            #toasts, .toast-container, .toasts { bottom: calc(82px + env(safe-area-inset-bottom)) !important; }
        }
        @media (max-width: 400px) {
            .stats-grid, .today-grid { grid-template-columns: 1fr !important; }
        }
    `;
    document.head.appendChild(st);

    const ICONS = {
        dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        journal: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        trades: '<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        analytics: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    };

    function buildNav() {
        if (document.getElementById('tvBottomNav')) return;
        const nav = document.createElement('nav');
        nav.id = 'tvBottomNav';
        nav.innerHTML = ['dashboard', 'journal', 'trades', 'analytics', 'settings'].map(k =>
            `<button data-go="${k}">${ICONS[k]}<span>${k === 'dashboard' ? 'Home' : k[0].toUpperCase() + k.slice(1)}</span></button>`).join('');
        document.body.appendChild(nav);
        nav.addEventListener('click', e => {
            const b = e.target.closest('button[data-go]');
            if (b && typeof app !== 'undefined') app.navigateTo(b.dataset.go);
        });
    }

    function syncNav() {
        const nav = document.getElementById('tvBottomNav');
        if (!nav) return;
        const active = document.querySelector('.section.active');
        const id = active ? active.id : '';
        nav.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.go === id));
        const mc = document.getElementById('mainContent');
        const inApp = mc && getComputedStyle(mc).display !== 'none';
        document.body.classList.toggle('tv-app-mode', !!inApp);
    }

    new MutationObserver(() => syncNav()).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    if (document.readyState === 'complete') setTimeout(() => { buildNav(); syncNav(); }, 600);
    else window.addEventListener('load', () => setTimeout(() => { buildNav(); syncNav(); }, 600));
})();
