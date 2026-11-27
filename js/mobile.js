// ============ TradeVault Mobile Pack — minimal ============
(function () {
    const st = document.createElement('style');
    st.textContent = `
        @media (max-width: 768px) {
            .sidebar { display: none !important; }
            #mainContent, .main-content, main { margin-left: 0 !important; width: 100% !important; }
        }
    `;
    document.head.appendChild(st);
})();
