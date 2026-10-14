// ============ TradeVault Plans: Free vs Pro vs Owner v4 (Chapa) ============
(function () {
    const FREE_TRADE_LIMIT = 50;
    const PRICE_LABEL = '3 ETB';

    const FREE_FEATS = [
        { t: 'Up to ' + FREE_TRADE_LIMIT + ' trades', ok: 1 },
        { t: 'Basic journal & charts', ok: 1 },
        { t: 'CSV import & full export', ok: 0 },
        { t: 'PDF & weekly auto-reviews', ok: 0 },
        { t: 'Grade analytics', ok: 0 },
        { t: 'Funded dashboard & multi-account', ok: 0 },
        { t: 'Priority support', ok: 0 }
    ];
    const PRO_FEATS = [
        { t: 'Unlimited trades', ok: 1 },
        { t: 'Full journal: screenshots & psychology', ok: 1 },
        { t: 'Funded dashboard & unlimited accounts', ok: 1 },
        { t: 'CSV import & full data export', ok: 1 },
        { t: 'PDF reports & weekly auto-review', ok: 1 },
        { t: 'Grade analytics & mistake tracking', ok: 1 },
        { t: 'All 12+ performance charts', ok: 1 },
        { t: 'PRO badge & priority support', ok: 1 },
        { t: 'Early access to new features', ok: 1 }
    ];
    const featHTML = list => `<ul class="plan-feats">` + list.map(f => `<li class="${f.ok ? '' : 'no'}">${f.t}</li>`).join('') + `</ul>`;
    const pricePro = () => `<div class="plan-price">3 <small>ETB · one-time (test price)</small></div>`;

    const st = document.createElement('style');
    st.textContent = `
        .plan-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
        @media (max-width: 640px) { .plan-cards { grid-template-columns: 1fr; } }
        .plan-card2 { border: 1px solid var(--border-color); border-radius: 16px; padding: 1.2rem; background: var(--bg-card); position: relative; opacity: .92; }
        .plan-card2.pro { opacity: 1; border-color: #D9E0E7; box-shadow: 0 0 0 1px rgba(217,224,231,.35), 0 12px 32px rgba(0,0,0,.35); transform: scale(1.02); }
        .plan-tag { position: absolute; top: -10px; right: 14px; background: linear-gradient(135deg,#D9E0E7,#6B737D); color: #0B0D10; font-size: .62rem; font-weight: 800; padding: .15rem .55rem; border-radius: 100px; letter-spacing: .06em; }
        .plan-price { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); }
        .plan-price small { font-size: .72rem; color: var(--text-tertiary); font-weight: 600; }
        .plan-feats { list-style: none; padding: 0; margin: .8rem 0; font-size: .8rem; color: var(--text-secondary); display: grid; gap: .45rem; }
        .plan-feats li::before { content: '✓ '; color: #3FA87A; font-weight: 700; }
        .plan-feats li.no { opacity: .45; }
        .plan-feats li.no::before { content: '— '; color: var(--text-tertiary); }
        .pro-badge { background: linear-gradient(135deg,#D9E0E7,#6B737D); color: #0B0D10; font-size: .6rem; font-weight: 800; padding: .12rem .5rem; border-radius: 100px; letter-spacing: .08em; margin-left: .5rem; vertical-align: middle; }
        .owner-badge { background: transparent; border: 1px solid #D9E0E7; color: #D9E0E7; font-size: .6rem; font-weight: 800; padding: .12rem .5rem; border-radius: 100px; letter-spacing: .08em; margin-left: .5rem; vertical-align: middle; }
        .lock-teaser { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem; min-height: 220px; text-align: center; color: var(--text-secondary); }
        #tvUpgradeBtn { width: 100%; margin-top: .5rem; min-height: 34px; font-size: .75rem; }
        .tv-pricing { max-width: 760px; margin: 4rem auto; padding: 0 1.5rem; text-align: center; }
        .tv-pricing h2 { font-size: 1.6rem; margin-bottom: .4rem; }
        .tv-pricing p { color: var(--text-secondary); font-size: .85rem; margin-bottom: 1.2rem; }
        .tv-pricing .plan-card2 { text-align: left; }
    `;
    document.head.appendChild(st);

    const tvPlan = {
        plan: localStorage.getItem('tv_plan') || 'free',
        hasSession: false,
        isPro() { return this.plan === 'pro' || this.plan === 'owner'; },

        async refresh() {
            if (!window.tvClient) return;
            try {
                const { data: s } = await tvClient.auth.getSession();
                this.hasSession = !!s.session;
                if (!s.session) { this.plan = 'free'; return this.paint(); }
                const { data: p } = await tvClient.from('profiles').select('plan').eq('id', s.session.user.id).single();
                this.plan = (p && p.plan) || 'free';
            } catch (e) { /* keep cached */ }
            localStorage.setItem('tv_plan', this.plan);
            this.paint();
        },

        paint() {
            const foot = document.querySelector('.sidebar-footer');
            if (foot) {
                const oldBadge = foot.querySelector('.pro-badge, .owner-badge');
                if (oldBadge && oldBadge.className !== (this.plan === 'owner' ? 'owner-badge' : 'pro-badge')) oldBadge.remove();
                if (this.isPro()) {
                    if (!foot.querySelector('.pro-badge, .owner-badge')) {
                        const nameEl = foot.querySelector('strong, .user-name, div div');
                        if (nameEl) nameEl.insertAdjacentHTML('afterend', this.plan === 'owner' ? '<span class="owner-badge">OWNER</span>' : '<span class="pro-badge">PRO</span>');
                    }
                    const ub = document.getElementById('tvUpgradeBtn');
                    if (ub) ub.remove();
                } else if (!document.getElementById('tvUpgradeBtn')) {
                    foot.insertAdjacentHTML('beforeend', '<button class="btn btn-secondary" id="tvUpgradeBtn">⭐ Upgrade to Pro</button>');
                    document.getElementById('tvUpgradeBtn').onclick = () => this.showUpgrade();
                }
            }
            const about = [...document.querySelectorAll('#settings h3')].find(h => /about/i.test(h.textContent));
            if (about && !document.getElementById('planLine')) {
                const label = this.plan === 'owner' ? 'OWNER 👑' : this.isPro() ? 'PRO ⭐' : 'Free';
                about.parentElement.insertAdjacentHTML('beforeend',
                    `<p id="planLine" style="font-size:.78rem;color:var(--text-secondary);margin-top:.4rem;">Current plan: <strong>${label}</strong> · <a href="#" id="planUpgradeLink" style="color:var(--text-primary);text-decoration:underline;">${this.isPro() ? 'Manage' : 'Upgrade'}</a></p>`);
                document.getElementById('planUpgradeLink').onclick = e => { e.preventDefault(); this.showUpgrade(); };
            }
            if (!document.getElementById('tvPricing')) {
                const footer = document.querySelector('footer');
                const anchor = footer || document.querySelector('.testimonials, #features-section');
                if (anchor) {
                    const sec = document.createElement('section');
                    sec.id = 'tvPricing'; sec.className = 'tv-pricing';
                    sec.innerHTML = `<h2>Simple, honest pricing</h2><p>Start free. Upgrade when your journaling gets serious.</p>
                    <div class="plan-cards">
                      <div class="plan-card2"><h4>Free</h4><div class="plan-price">$0 <small>forever</small></div>${featHTML(FREE_FEATS)}
                        <button class="btn btn-secondary" onclick="location.href='auth.html'">Start Free</button></div>
                      <div class="plan-card2 pro"><span class="plan-tag">MOST POPULAR</span><h4>Pro</h4>${pricePro()}${featHTML(PRO_FEATS)}
                        <button class="btn btn-primary" onclick="tvPlan.showUpgrade()">Get Pro</button></div>
                    </div>`;
                    anchor.before(sec);
                }
            }
        },

        showChooser() {
            const ov = document.getElementById('modalOverlay');
            if (!ov || ov.classList.contains('active')) return;
            ov.innerHTML = `<div class="modal" style="max-width:660px;">
              <div class="modal-header"><h2>Welcome — choose your path</h2><button class="modal-close" onclick="app.closeModal(); localStorage.setItem('tv_plan_chosen','1');">✕</button></div>
              <div class="modal-body">
                <div class="plan-cards">
                  <div class="plan-card2"><h4>Free</h4><div class="plan-price">$0 <small>forever</small></div>${featHTML(FREE_FEATS)}
                    <button class="btn btn-secondary" id="chFree" style="width:100%;">Continue Free</button></div>
                  <div class="plan-card2 pro"><span class="plan-tag">RECOMMENDED</span><h4>Pro</h4>${pricePro()}${featHTML(PRO_FEATS)}
                    <button class="btn btn-primary" id="chPro" style="width:100%;">Go Pro / I have a code</button></div>
                </div>
              </div></div>`;
            ov.classList.add('active');
            document.getElementById('chFree').onclick = () => {
                localStorage.setItem('tv_plan_chosen', '1');
                app.closeModal();
                showToast('Free plan active — upgrade anytime from the sidebar');
            };
            document.getElementById('chPro').onclick = () => {
                localStorage.setItem('tv_plan_chosen', '1');
                app.closeModal();
                setTimeout(() => this.showUpgrade(), 250);
            };
        },

        /* ---------- CHAPA ---------- */
        async chapaPay(btn) {
            if (!window.tvClient || !tvClient.functions) return showToast('Payment system not ready', 'warning');
            if (btn) { btn.disabled = true; btn.textContent = 'Creating checkout…'; }
            let data = null, error = null;
            try { const r = await tvClient.functions.invoke('chapa-init'); data = r.data; error = r.error; } catch (e) { error = e; }
            if (btn) { btn.disabled = false; btn.textContent = 'Pay ' + PRICE_LABEL + ' with Chapa'; }
            if (error || !data || !data.checkout_url) return showToast('Chapa checkout failed: ' + ((error && error.message) || (data && data.error) || 'unknown'), 'error');
            localStorage.setItem('tv_chapa_tx', data.tx_ref);
            window.open(data.checkout_url, '_blank');
            showToast('Complete payment in the new tab, then press Verify');
            const vf = document.getElementById('proVerifyBtn');
            if (vf) vf.style.display = '';
        },

        async chapaVerify(tx) {
            const txRef = tx || localStorage.getItem('tv_chapa_tx');
            if (!txRef) return showToast('No pending payment found', 'warning');
            let data = null, error = null;
            try { const r = await tvClient.functions.invoke('chapa-verify', { body: { tx_ref: txRef } }); data = r.data; error = r.error; } catch (e) { error = e; }
            if (!error && data && data.ok) {
                localStorage.removeItem('tv_chapa_tx');
                this.plan = 'pro'; localStorage.setItem('tv_plan', 'pro');
                showToast('Payment confirmed — welcome to Pro ⭐');
                setTimeout(() => location.reload(), 900);
            } else {
                showToast('Not confirmed yet. If you paid, wait a few seconds and press Verify again.', 'warning');
            }
        },

        showUpgrade(feature) {
            const ov = document.getElementById('modalOverlay');
            if (!ov || ov.classList.contains('active')) return;
            const pending = localStorage.getItem('tv_chapa_tx');
            ov.innerHTML = `<div class="modal" style="max-width:660px;">
              <div class="modal-header"><h2>${feature ? feature + ' is a Pro feature' : 'TradeVault Plans'}</h2><button class="modal-close" onclick="app.closeModal()">✕</button></div>
              <div class="modal-body">
                <div class="plan-cards">
                  <div class="plan-card2"><h4>Free</h4><div class="plan-price">$0 <small>forever</small></div>${featHTML(FREE_FEATS)}</div>
                  <div class="plan-card2 pro"><span class="plan-tag">MOST POPULAR</span><h4>Pro</h4>${pricePro()}${featHTML(PRO_FEATS)}</div>
                </div>
                <div class="form-group"><label>Have a Pro code?</label>
                  <div style="display:flex;gap:.5rem;">
                    <input class="form-control" id="proCodeInput" placeholder="TV-PRO-XXXX-XXXX or OWNER-…" style="text-transform:uppercase;">
                    <button class="btn btn-primary" id="proRedeemBtn">Activate</button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" id="proVerifyBtn" style="${pending ? '' : 'display:none;'}">I have paid — Verify</button>
                <button class="btn btn-secondary" onclick="app.closeModal()">Later</button>
                <button class="btn btn-primary" id="proBuyBtn">Pay ${PRICE_LABEL} with Chapa</button>
              </div></div>`;
            ov.classList.add('active');
            document.getElementById('proBuyBtn').onclick = () => this.chapaPay(document.getElementById('proBuyBtn'));
            document.getElementById('proVerifyBtn').onclick = () => this.chapaVerify();
            document.getElementById('proRedeemBtn').onclick = async () => {
                const code = document.getElementById('proCodeInput').value.trim().toUpperCase();
                if (!code) return showToast('Enter a code first', 'warning');
                const btn = document.getElementById('proRedeemBtn');
                btn.disabled = true; btn.textContent = 'Checking…';
                const { data, error } = await tvClient.rpc('redeem_pro_code', { p_code: code });
                btn.disabled = false; btn.textContent = 'Activate';
                if (error) return showToast('Error: ' + error.message, 'error');
                if (data === 'ok') {
                    this.plan = code.startsWith('OWNER-') ? 'owner' : 'pro';
                    localStorage.setItem('tv_plan', this.plan);
                    app.closeModal();
                    showToast(this.plan === 'owner' ? 'OWNER tier activated 👑' : 'Welcome to TradeVault Pro ⭐');
                    setTimeout(() => location.reload(), 900);
                } else showToast('Invalid or already-used code', 'error');
            };
        }
    };
    window.tvPlan = tvPlan;

    /* ---------- enforcement gates ---------- */
    function gates() {
        if (typeof db !== 'undefined' && !db.__planHook) {
            db.__planHook = 1;
            const oa = db.addTrade.bind(db);
            db.addTrade = async function (d) {
                if (!tvPlan.isPro()) {
                    const n = (await db.getAllTrades()).length;
                    if (n >= FREE_TRADE_LIMIT) { tvPlan.showUpgrade('Unlimited trades'); throw new Error('PRO_REQUIRED'); }
                }
                return oa(d);
            };
        }
        if (typeof trades !== 'undefined' && !trades.__planImport) {
            trades.__planImport = 1;
            const oi = trades.importCSV.bind(trades);
            trades.importCSV = function () { if (!tvPlan.isPro()) return tvPlan.showUpgrade('CSV import'); return oi(); };
        }
    }

    /* ---------- locks + repaint ---------- */
    new MutationObserver(() => {
        gates();
        const pdf = document.getElementById('wkPdf');
        if (pdf && !pdf.__gated) {
            pdf.__gated = 1;
            pdf.addEventListener('click', e => { if (!tvPlan.isPro()) { e.stopImmediatePropagation(); tvPlan.showUpgrade('PDF exports'); } }, true);
        }
        const gc = document.getElementById('gradeChartCard');
        if (gc && !gc.dataset.locked && !tvPlan.isPro()) {
            gc.dataset.locked = '1';
            gc.innerHTML = `<div class="lock-teaser"><div style="font-size:1.6rem;">🔒</div><h3>Grade Analytics is a Pro feature</h3><p style="font-size:.8rem;">See win-rate per trade grade and fix your worst habits first.</p><button class="btn btn-primary" onclick="tvPlan.showUpgrade('Grade analytics')">Unlock with Pro</button></div>`;
        }
    }).observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', () => setTimeout(() => tvPlan.paint(), 150), true);

    function boot() {
        /* Chapa callback: site reopened after payment → auto-verify */
        const params = new URLSearchParams(location.search);
        if (params.get('chapa') === '1' || params.get('tx_ref')) {
            const tx = params.get('tx_ref') || localStorage.getItem('tv_chapa_tx');
            history.replaceState(null, '', location.pathname);
            showToast('Checking your payment with Chapa…');
            setTimeout(() => tvPlan.chapaVerify(tx), 1500);
        }
        tvPlan.refresh().then(() => {
            gates();
            tvPlan.paint();
            if (tvPlan.hasSession && tvPlan.plan === 'free' && !localStorage.getItem('tv_plan_chosen')) {
                setTimeout(() => tvPlan.showChooser(), 900);
            }
        });
    }
    if (document.readyState === 'complete') setTimeout(boot, 400);
    else window.addEventListener('load', () => setTimeout(boot, 400));
    if (typeof dashboard !== 'undefined' && !dashboard.__planHooked) {
        dashboard.__planHooked = 1;
        const od = dashboard.loadDashboard.bind(dashboard);
        dashboard.loadDashboard = async function () { const r = await od(); tvPlan.paint(); return r; };
    }
})();
