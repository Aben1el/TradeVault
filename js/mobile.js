// TradeVault Mobile — sidebar hidden on phones only
(function () {
    if (window.innerWidth <= 768) {
        const st = document.createElement('style');
        st.textContent = `
            .sidebar { display: none !important; }
            #mainContent, .main-content, main { margin-left: 0 !important; width: 100% !important; }
        `;
        document.head.appendChild(st);
    }
})();
