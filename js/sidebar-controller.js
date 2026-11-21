// ============ TradeVault Sidebar Controller — definitive fix ============
(function () {
    if (window.__tvSidebarController) return;
    window.__tvSidebarController = 1;

    const st = document.createElement('style');
    st.textContent = `
        #tvSidebarControls {
            position: fixed;
            left: 8px;
            top: 12px;
            z-index: 9999;
            display: flex;
            gap: 6px;
            opacity: 0;
            pointer-events: none;
            transition: opacity .3s ease;
        }
        #tvSidebarControls.visible {
            opacity: 1;
            pointer-events: auto;
        }
        #tvSidebarControls button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1px solid var(--border-color, rgba(107,115,125,.3));
            background: var(--bg-secondary, rgba(21,24,28,.8));
            color: var(--text-secondary, #A6AEB6);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            backdrop-filter: blur(12px);
            transition: all .2s ease;
        }
        #tvSidebarControls button:hover {
            color: var(--text-primary, #D9E0E7);
            border-color: var(--border-hover, #6B737D);
            transform: scale(1.05);
        }
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

    // Detect sidebar state
    function isSidebarCollapsed() {
        const sb = document.querySelector('.sidebar');
        if (!sb) return false;
        const width = sb.offsetWidth;
        return width > 0 && width < 100;
    }

    function updateControls() {
        const collapsed = isSidebarCollapsed();
        controls.classList.toggle('visible', collapsed);
    }

    // Expand handler
    expandBtn.addEventListener('click', () => {
        const sb = document.querySelector('.sidebar');
        if (!sb) return;
        // Try native collapse button first
        const nativeBtn = sb.querySelector('button[title*="collapse"], button[title*="expand"], .collapse-btn, #collapseBtn');
        if (nativeBtn) {
            nativeBtn.click();
        } else {
            // Force expand by removing collapse classes
            document.body.classList.remove('sidebar-collapsed', 'tv-sb-min', 'collapsed');
            sb.classList.remove('collapsed', 'mini');
            sb.style.width = '';
            localStorage.removeItem('tv_sb_min');
            localStorage.removeItem('sidebar_state');
            window.dispatchEvent(new Event('resize'));
        }
        setTimeout(updateControls, 300);
    });

    // Theme handler
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('tv_theme', next);
        themeBtn.textContent = next === 'light' ? '☀️' : '🌙';
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('tv_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeBtn.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }

    // Monitor sidebar state
    const observer = new MutationObserver(updateControls);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    // Initial check
    setTimeout(updateControls, 500);
    window.addEventListener('resize', updateControls);
})();
