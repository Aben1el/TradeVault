// ============ TradeVault Mobile Perfection Pack v2 ============
(function () {
    const st = document.createElement('style');
    st.textContent = `
        /* ---------- bottom tab bar ---------- */
        #tvBottomNav { position: fixed; left: 0; right: 0; bottom: 0; z-index: 120; display: none;
          grid-template-columns: repeat(5, 1fr); background: rgba(11,13,16,.96);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid rgba(107,115,125,.3);
          padding: .25rem .2rem calc(.25rem + env(safe-area-inset-bottom)); }
        #tvBottomNav button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .12rem;
          background: none; border: none; color: #6B737D; font: 600 .6rem Inter, sans-serif; letter-spacing: .02em;
          min-height: 50px; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        #tvBottomNav button svg { width: 19px; height: 19px; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        #tvBottomNav button.active { color: #D9E0E7; }
        #tvBottomNav button.active svg { stroke-width: 2.4; }
        /* ---------- more sheet ---------- */
        #tvSheetBack { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 130; opacity: 0; pointer-events: none; transition: opacity .25s ease; }
        #tvSheetBack.open { opacity: 1; pointer-events: auto; }
        #tvSheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 131; background: rgba(11,13,16,.98);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(107,115,125,.35); border-radius: 20px 20px 0 0;
          transform: translateY(105%); transition: transform .3s cubic-bezier(.22,1,.36,1);
          padding: .5rem .9rem calc(.9rem + env(safe-area-inset-bottom)); }
        #tvSheet.open { transform: translateY(0); }
        .tv-sheet-grip { width: 40px; height: 4px; border-radius: 4px; background: rgba(107,115,125,.5); margin: .3rem auto .7rem; }
        .tv-sheet-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .55rem; }
        .tv-tile { display: flex; flex-direction: column; align-items: center; gap: .35rem; padding: .7rem .3rem;
          background: rgba(217,224,231,.05); border: 1px solid rgba(107,115,125,.22); border-radius: 14px;
          color: #A6AEB6; font: 600 .64rem Inter, sans-serif; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        .tv-tile svg { width: 19px; height: 19px; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .tv-tile:active { background: rgba(217,224,231,.1); }
        .tv-tile.gold { color: #D9E0E7; border-color: rgba(217,224,231,.4); background: rgba(217,224,231,.08); }
        @media (max-width: 768px) {
            /* ---------- sidebar OFF on phones ---------- */
            .sidebar { display: none !important; }
            #mainContent, .main-content, main { margin-left: 0 !important; width: 100% !important; padding-left: .85rem !important; padding-right: .85rem !important; }
            body.tv-app-mode { padding-bottom: calc(58px + env(safe-area-inset-bottom)); }
            body.tv-app-mode #tvBottomNav { display: grid; }
            /* ---------- smaller, crisper buttons ---------- */
            .btn { min-height: 38px; padding: .42rem .85rem; font-size: .8rem; border-radius: 10px; }
            .btn-text { min-height: 30px; padding: .25rem .55rem; font-size: .74rem; }
            .filter-btn, .month-btn { min-height: 30px; padding: .26rem .6rem; font-size: .7rem; border-radius: 8px; }
            .table-action-btn { width: 28px; height: 28px; font-size: .75rem; border-radius: 7px; }
            .modal-close { min-height: 30px; padding: .2rem .5rem; }
            input, select, textarea, .form-control { font-size: 16px !important; min-height: 38px; border-radius: 10px; }
            /* ---------- tighter, cleaner surfaces ---------- */
            .card, .stat-card, .today-card, .chart-container, .trade-card, .calculator-card { padding: .85rem !important; border-radius: 14px !important; }
            .stat-label, .today-label, .m-label { font-size: .58rem !important; letter-spacing: .06em; }
            .stat-value, .today-value { font-size: 1.02rem !important; }
            .m-value { font-size: .9rem !important; }
            h1 { font-size: 1.22rem !important; }
            .dash-header p, .section-header p { font-size: .74rem !important; }
            .section-header { margin: .7rem 0 .55rem; gap: .5rem; flex-wrap: wrap; }
            .stats-grid, .today-grid { grid-template-columns: repeat(2, 1fr) !important; gap: .55rem !important; }
            .journal-grid, .calculators-grid, .calc-grid, .analytics-full-grid { grid-template-columns: 1fr !important; gap: .6rem !important; }
            .chart-container { height: 230px !important; }
            /* ---------- tables ---------- */
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            #tradesTable { min-width: 620px; font-size: .76rem; }
            #tradesTable td, #tradesTable th { padding: .5rem .55rem; }
            /* ---------- modals + plans side by side ---------- */
            .modal { width: 94vw !important; max-height: 90vh !important; border-radius: 16px !important; }
            .modal-body { overflow-y: auto; max-height: 62vh; padding: .9rem !important; }
            .modal-footer { position: sticky; bottom: 0; background: var(--bg-secondary); flex-wrap: wrap; gap: .45rem; padding: .7rem .9rem !important; }
            .plan-cards { grid-template-columns: 1fr 1fr !important; gap: .55rem !important; margin: .7rem 0 !important; }
            .plan-card2 { padding: .75rem !important; border-radius: 14px; opacity: 1; }
            .plan-card2.pro { transform: none !important; }
            .plan-price { font-size: 1.12rem !important; }
            .plan-price small { font-size: .6rem !important; }
            .plan-feats { font-size: .66rem !important; gap: .26rem !important; margin: .5rem 0 !important; }
            .plan-tag { font-size: .52rem !important; padding: .1rem .42rem !important; top: -8px; right: 8px; }
            /* ---------- floating bits above the tab bar ---------- */
            .back-btn { bottom: calc(70px + env(safe-area-inset-bottom)) !important; right: .8rem !important; min-height: 32px !important; }
            #toasts, .toast-container, .toasts { bottom: calc(70px + env(safe-area-inset-bottom)) !important; }
            .filters-bar { flex-wrap: wrap; gap: .45rem; }
            .filters-bar select, .filters-bar input { flex: 1 1 46%; min-width: 46%; }
        }
        @media (max-width: 400px) {
            .stats-grid, .today-grid { grid-template-columns: 1fr !important; }
            .tv-sheet-grid { grid-template-columns: repeat(3, 1fr); }
        }
    `;
    document.head.appendChild(st);

    const ICONS = {
        dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        journal: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        trades: '<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        analytics: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
        reviews: '<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        strategies: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        psychology: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
        calculators: '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="10" y2="16"/><line x1="14" y1="16" x2="16" y2="16"/></svg>',
        goals: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        profile: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        upgrade: '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
    };

    const SHEET_ITEMS = ['reviews', 'strategies', 'psychology', 'calculators', 'goals', 'profile', 'settings'];

    function buildNav() {
        if (document.getElementById('tvBottomNav')) return;
        const nav = document.createElement('nav');
        nav.id = 'tvBottomNav';
        nav.innerHTML = ['dashboard', 'journal', 'trades', 'analytics', 'more'].map(k =>
            `<button data-go="${k}">${ICONS[k]}<span>${k === 'dashboard' ? 'Home' : k === 'more' ? 'More' : k[0].toUpperCase() + k.slice(1)}</span></button>`).join('');
        document.body.appendChild(nav);
        nav.addEventListener('click', e => {
            const b = e.target.closest('button[data-go]');
            if (!b) return;
            if (b.dataset.go === 'more') openSheet();
            else if (typeof app !== 'undefined') app.navigateTo(b.dataset.go);
        });
        const back = document.createElement('div');
        back.id = 'tvSheetBack';
        const sheet = document.createElement('div');
        sheet.id = 'tvSheet';
        sheet.innerHTML = '<div class="tv-sheet-grip"></div><div class="tv-sheet-grid"></div>';
        document.body.appendChild(back);
        document.body.appendChild(sheet);
        back.addEventListener('click', closeSheet);
        sheet.addEventListener('click', e => {
            const t = e.target.closest('.tv-tile');
            if (!t) return;
            closeSheet();
            if (t.dataset.go === 'profile') setTimeout(() => location.href = 'profile.html', 200);
            else if (t.dataset.go === 'upgrade') setTimeout(() => window.tvPlan && tvPlan.showUpgrade(), 250);
            else if (typeof app !== 'undefined') setTimeout(() => app.navigateTo(t.dataset.go), 200);
        });
        /* let the old hamburger open the sheet too, if it exists */
        document.querySelectorAll('#menuBtn, .menu-btn, #sidebarToggle, .sidebar-toggle, #navToggle, .nav-toggle, #hamburger, .hamburger').forEach(el => {
            el.addEventListener('click', e => { e.preventDefault(); openSheet(); });
        });
    }

    function openSheet() {
        const sheet = document.getElementById('tvSheet');
        const back = document.getElementById('tvSheetBack');
        if (!sheet) return;
        const pro = window.tvPlan && tvPlan.isPro();
        const items = SHEET_ITEMS.map(k =>
            `<div class="tv-tile" data-go="${k}">${ICONS[k]}<span>${k[0].toUpperCase() + k.slice(1)}</span></div>`).join('')
            + (pro ? '' : `<div class="tv-tile gold" data-go="upgrade">${ICONS.upgrade}<span>Go Pro</span></div>`);
        sheet.querySelector('.tv-sheet-grid').innerHTML = items;
        sheet.classList.add('open');
        back.classList.add('open');
    }
    function closeSheet() {
        const sheet = document.getElementById('tvSheet');
        const back = document.getElementById('tvSheetBack');
        if (sheet) sheet.classList.remove('open');
        if (back) back.classList.remove('open');
    }

    function syncNav() {
        const nav = document.getElementById('tvBottomNav');
        if (!nav) return;
        const active = document.querySelector('.section.active');
        const id = active ? active.id : '';
        const inSheet = SHEET_ITEMS.includes(id);
        nav.querySelectorAll('button').forEach(b => {
            const go = b.dataset.go;
            b.classList.toggle('active', go === id || (go === 'more' && inSheet));
        });
        const mc = document.getElementById('mainContent');
        const inApp = mc && getComputedStyle(mc).display !== 'none';
        document.body.classList.toggle('tv-app-mode', !!inApp);
        if (inApp === false) closeSheet();
    }

    new MutationObserver(() => syncNav()).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    if (document.readyState === 'complete') setTimeout(() => { buildNav(); syncNav(); }, 600);
    else window.addEventListener('load', () => setTimeout(() => { buildNav(); syncNav(); }, 600));
})();
