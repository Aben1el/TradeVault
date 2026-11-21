// ============ TradeVault Sidebar Controller — final ============
(function () {
    if (window.__tvSidebarController) return;
    window.__tvSidebarController = 1;

    const st = document.createElement('style');
    st.textContent = `
        #tvSidebarControls {
            position: fixed;
            left: 12px;
            top: 12px;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }
        #tvSidebarControls button {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 1px solid var(--border-color, rgba(107,115,125,.3));
            background: var(--bg-secondary, rgba(21,24,28,.85));
            color: var(--text-secondary, #A6AEB6);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.05rem;
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            box-shadow: 0 4px 16px rgba(0,0,0,.3);
            transition: opacity .25s ease, transform .25s ease, color .2s ease, border-color .2s ease;
            opacity: 0;
            transform: scale(.9);
            pointer-events: none;
        }
        #tvSidebarControls button.show {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
        }
        #tvSidebarControls button:hover {
            color: var(--text-primary, #D9E0E7);
            border-color: var(--border-hover, #6B737D);
            transform: scale(1.06);
        }
        #tvSidebarControls button:active { transform: scale(.95); }
        @media (max-width: 768px) {
            #tvSidebarControls { display: none !important; }
        }
    `;
    document.head.appendChild(st);

    const controls = document.createElement('div');
    controls.id = 'tvSidebarControls';
    controls.innerHTML = `
        <button id="tvExpandBtn" title="Expand sidebar">»</button>
        <button id="tvThemeBtn" title="Toggle theme">🌙</button>
    `;
    document.body.appendChild(controls);

    const expandBtn = document.getElementById('tvExpandBtn');
    const themeBtn = document.getElementById('tvThemeBtn');

    function isSidebarCollapsed() {
        const sb = document.querySelector('.sidebar');
        if (!sb) return false;
        const w = sb.offsetWidth;
        return w > 0 && w < 120;
    }

    function updateControls() {
        const collapsed = isSidebarCollapsed();
        expandBtn.classList.toggle('show', collapsed);
        themeBtn.classList.toggle('show', !collapsed);
    }

    // Expand handler
    expandBtn.addEventListener('click', () => {
        const sb = document.querySelector('.sidebar');
        if (!sb) return;
        // Try native collapse button
        const nativeBtn = sb.querySelector('button[title*="collapse"], button[title*="expand"], .collapse-btn, #collapseBtn, #sidebarToggle');
        if (nativeBtn) { nativeBtn.click(); }
        else {
            document.body.classList.remove('sidebar-collapsed', 'tv-sb-min', 'collapsed');
            sb.classList.remove('collapsed', 'mini');
            sb.style.width = '';
            localStorage.removeItem('tv_sb_min');
            window.dispatchEvent(new Event('resize'));
        }
        setTimeout(updateControls, 350);
    });

    // Theme handler
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('tv_theme', theme);
        themeBtn.textContent = theme === 'light' ? '☀️' : '🌙';
        // Also notify the app if it has a theme handler
        if (window.app && typeof app.toggleTheme === 'function') app.toggleTheme();
    }
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'light' ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('tv_theme');
    if (savedTheme) applyTheme(savedTheme);
    else themeBtn.textContent = '🌙';

    // Monitor
    const observer = new MutationObserver(updateControls);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    setTimeout(updateControls, 400);
    window.addEventListener('resize', updateControls);
})();
