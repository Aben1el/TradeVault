// ============ TradeVault Sidebar Controller — integrated layout ============
(function () {
    if (window.__tvSidebarController) return;
    window.__tvSidebarController = 1;

    const st = document.createElement('style');
    st.textContent = `
        /* Integrated control buttons inside sidebar top row */
        .tv-sidebar-control {
            width: 34px;
            height: 34px;
            min-height: 34px;
            border-radius: 50%;
            border: 1px solid var(--border-color, rgba(107,115,125,.3));
            background: var(--bg-tertiary, rgba(34,38,43,.6));
            color: var(--text-secondary, #A6AEB6);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            transition: all .2s ease;
            flex-shrink: 0;
        }
        .tv-sidebar-control:hover {
            color: var(--text-primary, #D9E0E7);
            border-color: var(--border-hover, #6B737D);
            background: var(--bg-secondary, rgba(21,24,28,.8));
        }
        .tv-sidebar-control:active { transform: scale(.95); }
        
        /* Hide controls by default, show based on state */
        #tvThemeBtn, #tvExpandBtn { display: none; }
        
        /* Expanded state: show theme button */
        body:not(.sidebar-collapsed):not(.tv-sb-min) #tvThemeBtn { display: flex; }
        
        /* Collapsed state: show expand button */
        body.sidebar-collapsed #tvExpandBtn,
        body.tv-sb-min #tvExpandBtn { display: flex; }
        
        /* Ensure top row is flex with proper spacing */
        .sidebar > div:first-of-type {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: .5rem !important;
            padding: .8rem .7rem !important;
        }
        
        /* Top row right side: controls container */
        .tv-sidebar-top-controls {
            display: flex;
            align-items: center;
            gap: .4rem;
            margin-left: auto;
        }
        
        /* Collapsed: hide brand text, center icons */
        body.sidebar-collapsed .sidebar,
        body.tv-sb-min .sidebar {
            width: 76px !important;
        }
        body.sidebar-collapsed .sidebar .nav-item,
        body.tv-sb-min .sidebar .nav-item {
            justify-content: center;
        }
        body.sidebar-collapsed .sidebar .nav-item span,
        body.tv-sb-min .sidebar .nav-item span,
        body.sidebar-collapsed .sidebar .nav-item p,
        body.tv-sb-min .sidebar .nav-item p {
            display: none !important;
        }
        body.sidebar-collapsed .sidebar #sidebarBrand span,
        body.tv-sb-min .sidebar #sidebarBrand span,
        body.sidebar-collapsed .sidebar .brand-text,
        body.tv-sb-min .sidebar .brand-text {
            display: none !important;
        }
        
        /* Main content margin */
        body:not(.sidebar-collapsed):not(.tv-sb-min) #mainContent,
        body:not(.sidebar-collapsed):not(.tv-sb-min) .main-content,
        body:not(.sidebar-collapsed):not(.tv-sb-min) main {
            margin-left: 260px !important;
        }
        body.sidebar-collapsed #mainContent,
        body.tv-sb-min #mainContent,
        body.sidebar-collapsed .main-content,
        body.tv-sb-min .main-content,
        body.sidebar-collapsed main,
        body.tv-sb-min main {
            margin-left: 76px !important;
        }
        
        @media (max-width: 768px) {
            .tv-sidebar-control { display: none !important; }
        }
    `;
    document.head.appendChild(st);

    function injectControls() {
        const sb = document.querySelector('.sidebar');
        if (!sb || sb.__controlsInjected) return;
        sb.__controlsInjected = 1;

        // Find or create top row
        let topRow = sb.querySelector(':scope > div:first-of-type');
        if (!topRow) {
            topRow = document.createElement('div');
            sb.insertBefore(topRow, sb.firstChild);
        }

        // Create controls container
        let controlsDiv = topRow.querySelector('.tv-sidebar-top-controls');
        if (!controlsDiv) {
            controlsDiv = document.createElement('div');
            controlsDiv.className = 'tv-sidebar-top-controls';
            topRow.appendChild(controlsDiv);
        }

        // Create expand button
        const expandBtn = document.createElement('button');
        expandBtn.id = 'tvExpandBtn';
        expandBtn.className = 'tv-sidebar-control';
        expandBtn.title = 'Expand sidebar';
        expandBtn.textContent = '»';
        expandBtn.addEventListener('click', () => {
            const nativeBtn = sb.querySelector('button[title*="collapse"], button[title*="expand"], .collapse-btn, #collapseBtn');
            if (nativeBtn) { nativeBtn.click(); }
            else {
                document.body.classList.remove('sidebar-collapsed', 'tv-sb-min', 'collapsed');
                sb.classList.remove('collapsed', 'mini');
                sb.style.width = '';
                localStorage.removeItem('tv_sb_min');
                window.dispatchEvent(new Event('resize'));
            }
        });

        // Create theme button
        const themeBtn = document.createElement('button');
        themeBtn.id = 'tvThemeBtn';
        themeBtn.className = 'tv-sidebar-control';
        themeBtn.title = 'Toggle theme';
        themeBtn.textContent = '🌙';
        themeBtn.addEventListener('click', () => {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme') || 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('tv_theme', next);
            themeBtn.textContent = next === 'light' ? '☀️' : '🌙';
        });

        controlsDiv.appendChild(expandBtn);
        controlsDiv.appendChild(themeBtn);

        // Load saved theme
        const savedTheme = localStorage.getItem('tv_theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeBtn.textContent = savedTheme === 'light' ? '☀️' : '🌙';
        }

        // Restore collapsed state
        if (localStorage.getItem('tv_sb_min') === '1') {
            document.body.classList.add('tv-sb-min');
        }
    }

    // Monitor and inject
    const observer = new MutationObserver(() => {
        injectControls();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(injectControls, 300);
})();
