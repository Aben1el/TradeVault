// ============ TradeVault Theme Studio v2 — Liquid Black default, per-user images ============
(function () {
    if (window.__tvThemesLoaded) return;
    window.__tvThemesLoaded = 1;

    const st = document.createElement('style');
    st.textContent = `
        /* ambient layers live again (glow only — clouds are NOT the default anymore) */
        body:not(.tv-booted)::before, body:not(.tv-booted)::after { opacity: 1 !important; }
        /* per-user background hook: none = Liquid Black */
        body::after { background-image: var(--tv-bg, none) !important; }
        html::before { opacity: var(--tv-veil-o, 1); }
        /* Liquid Black depth: soft sheen so the glass has something to refract */
        html:not(.tv-has-bg) body {
          background-image:
            radial-gradient(70% 55% at 50% -5%, rgba(217,224,231,.06), transparent 70%),
            radial-gradient(45% 40% at 88% 112%, rgba(107,115,125,.09), transparent 70%) !important;
        }
        html:not(.tv-has-bg) body::before { opacity: 1 !important; }
        /* studio UI */
        .tv-studio { display: grid; gap: .8rem; }
        .tv-studio-row { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
        .tv-bg-prev { width: 92px; height: 56px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border-color);
          background: radial-gradient(60% 60% at 50% 0%, rgba(217,224,231,.10), #0B0D10); }
        .tv-studio input[type="range"] { flex: 1; min-width: 140px; accent-color: #D9E0E7; }
        .tv-studio-note { font-size: .7rem; color: var(--text-tertiary); }
    `;
    document.head.appendChild(st);

    const state = { url: null, veil: 70, uid: null };   // url null = Liquid Black

    function apply() {
        const r = document.documentElement;
        const has = !!state.url && state.url !== 'none';
        r.classList.toggle('tv-has-bg', has);
        r.style.setProperty('--tv-bg', has ? `url("${state.url}")` : 'none');
        r.style.setProperty('--tv-veil-o', String(Math.max(20, Math.min(100, state.veil || 70)) / 100));
    }

    async function client() {
        for (let i = 0; i < 40; i++) {
            if (window.tvClient) return window.tvClient;
            await new Promise(res => setTimeout(res, 200));
        }
        return null;
    }

    async function save(patch) {
        const c = await client(); if (!c || !state.uid) return;
        await c.from('profiles').update(patch).eq('id', state.uid);
    }

    function studioCard() {
        if (document.getElementById('tvStudioCard')) return;
        const settings = document.getElementById('settings');
        if (!settings) return;
        const about = [...settings.querySelectorAll('h3')].find(h => /about/i.test(h.textContent));
        const card = document.createElement('div');
        card.id = 'tvStudioCard'; card.className = 'card settings-card';
        card.innerHTML = `<h3>Theme Studio</h3>
          <div class="tv-studio">
            <div class="tv-studio-row">
              <img id="tvBgPrev" class="tv-bg-prev" alt="background preview">
              <button class="btn btn-secondary" id="tvBgUploadBtn">Upload my image</button>
              <button class="btn btn-text" id="tvBgResetBtn">Reset to Liquid Black</button>
            </div>
            <div class="tv-studio-row">
              <label style="font-size:.75rem;color:var(--text-secondary);">Overlay darkness (for your image)</label>
              <input type="range" id="tvVeil" min="20" max="100" step="5" value="${state.veil}">
              <span id="tvVeilVal" style="font-size:.72rem;color:var(--text-tertiary);">${state.veil}%</span>
            </div>
            <p class="tv-studio-note">Default look is Liquid Black glass. Your uploaded background is private to your account — no one else sees it.</p>
          </div>`;
        if (about) about.parentElement.before(card); else settings.appendChild(card);

        const prev = card.querySelector('#tvBgPrev');
        const syncPrev = () => {
            const has = !!state.url && state.url !== 'none';
            prev.style.visibility = has ? 'visible' : 'hidden';
            if (has) prev.src = state.url;
        };
        syncPrev();

        card.querySelector('#tvBgUploadBtn').onclick = () => {
            const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*';
            i.onchange = async () => {
                const f = i.files[0]; if (!f) return;
                if (f.size > 4 * 1024 * 1024) return showToast('Image too large (max 4MB)', 'warning');
                showToast('Uploading…');
                const c = await client(); if (!c) return;
                const ext = (f.name.split('.').pop() || 'jpg').toLowerCase();
                const path = `bg/${state.uid}/${Date.now()}.${ext}`;
                const { error } = await c.storage.from('backgrounds').upload(path, f, { cacheControl: '3600' });
                if (error) return showToast('Upload failed: ' + error.message, 'error');
                const url = c.storage.from('backgrounds').getPublicUrl(path).data.publicUrl;
                state.url = url; apply(); syncPrev();
                await save({ bg_url: url });
                showToast('Your background is live 🎨');
            };
            i.click();
        };
        card.querySelector('#tvBgResetBtn').onclick = async () => {
            state.url = null; apply(); syncPrev();
            await save({ bg_url: null });
            showToast('Liquid Black restored 🌑');
        };
        const veil = card.querySelector('#tvVeil');
        const val = card.querySelector('#tvVeilVal');
        veil.oninput = () => { state.veil = parseInt(veil.value, 10); val.textContent = state.veil + '%'; apply(); };
        veil.onchange = () => save({ bg_veil: state.veil });
    }

    async function boot() {
        const c = await client(); if (!c) return;
        try {
            const { data: s } = await c.auth.getSession();
            if (!s || !s.session) { apply(); return; }
            state.uid = s.session.user.id;
            const { data: p } = await c.from('profiles').select('bg_url, bg_veil').eq('id', state.uid).single();
            if (p) { state.url = p.bg_url || null; state.veil = p.bg_veil == null ? 70 : p.bg_veil; }
        } catch (e) { /* keep defaults */ }
        apply();
        studioCard();
        new MutationObserver(() => { if (document.getElementById('settings')) studioCard(); }).observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'complete') boot();
    else window.addEventListener('load', () => setTimeout(boot, 300));
})();
