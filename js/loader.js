// ============ TradeVault Boot Overlay — minimal ============
(function () {
    if (window.__tvBootLoaded) return;
    window.__tvBootLoaded = 1;

    const ov = document.createElement('div');
    ov.id = 'tvBoot';
    ov.innerHTML = '<div class="tvBoot-word">TRADEVAULT</div>';
    document.body.appendChild(ov);

    setTimeout(() => {
        ov.style.opacity = '0';
        document.body.classList.add('tv-booted');
        setTimeout(() => ov.remove(), 500);
    }, 1200);
})();
