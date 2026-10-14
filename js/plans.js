// ============ TradeVault Plans: Free vs Pro v2 ============
(function () {
    const FREE_TRADE_LIMIT = 50;
    const STRIPE_LINK = ''; // ← paste your Stripe Payment Link here when ready

    const st = document.createElement('style');
    st.textContent = `
        .plan-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
        @media (max-width: 640px) { .plan-cards { grid-template-columns: 1fr; } }
        .plan-card2 { border: 1px solid var(--border-color); border-radius: 16px; padding: 1.2rem; background: var(--bg-card); position: relative; }
        .plan-card2.pro { border-color: #D9E0E7; box-shadow: 0 0 0 1px rgba(217,224,231,.35), 0 12px 32px rgba(0,0,0,.35); }
        .plan-tag { position: absolute; top: -10px; right: 14px; background: linear-gradient(135deg,#D9E0E7,#6B737D); color: #0B0D10; font-size: .62rem; font-weight: 800; padding: .15rem .55rem; border-radius: 100px; letter-spacing: .06em; }
        .plan-price { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); }
        .plan-price small { font-size: .72rem; color: var(--text-tertiary); font-weight: 600; }
        .plan-feats { list-style: none; padding: 0; margin: .8rem 0; font-size: .8rem; color: var(--text-secondary); display: grid; gap: .45rem; }
        .plan-feats li::before { content: '✓ '; color: #3FA87A; font-weight: 700; }
        .plan-feats li.no { opacity: .55; }
        .plan-feats li.no::before { content: '— '; color: var(--text-tertiary); }
        .pro-badge { background: linear-gradient(135deg,#D9E0E7,#6B737D); color: #0B0D10; font-size: .6rem; font-weight: 800; padding: .12rem .5rem; border-radius: 100px; letter-spacing: .08em; margin-left: .5rem; vertical-align: middle; }
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
        isPro() { return this.plan === 'pro'; },

        async refresh() {
            if (!window.tvClient) return;
            try {
                const { data: s } = await tvClient.auth.getSession();
                if (!s.session) { this.plan = 'free'; return this.paint(); }
                const { data: p } = await tvClient.from('profiles').select('plan').eq('id', s.session.user.id).single();
                this.plan = (p && p.plan) || 'free';
            } catch (e) { /* keep cached */ }
            localStorage.setItem('tv_plan', this.plan);
            this.paint();
        },

        paint() {
            /* --- sidebar footer: PRO badge or Upgrade button --- */
            const foot = document.querySelector('.sidebar-footer');
            if (foot) {
                if (this.isPro()) {
                    if (!foot.querySelector('.pro-badge')) {
                        const nameEl = foot.querySelector('strong, .user-name, div div');
                        if (nameEl) nameEl.insertAdjacentHTML('afterend', '<span class="pro-badge">PRO</span>');
                    }
                    const ub = document.getElementById('tvUpgradeBtn');
                    if (ub) ub.remove();
                } else if (!document.getElementById('tvUpgradeBtn')) {
                    foot.insertAdjacentHTML('beforeend', '<button class="btn btn-secondary" id="tvUpgradeBtn">⭐ Upgrade to Pro</button>');
                    document.getElementById('tvUpgradeBtn').onclick = () => this.showUpgrade();
                }
            }
            /* --- settings about line --- */
            const about = [...document.querySelectorAll('#settings h3')].find(h => /about/i.test(h.textContent));
            if (about && !document.getElementById('planLine')) {
                about.parentElement.insertAdjacentHTML('beforeend',
                    `<p id="planLine" style="font-size:.78rem;color:var(--text-secondary);margin-top:.4rem;">Current plan: <strong>${this.isPro() ? 'PRO ⭐' : 'Free'}</strong> · <a href="#" id="planUpgradeLink" style="color:var(--text-primary);text-decoration:underline;">${this.isPro() ? 'Manage' : 'Upgrade'}</a></p>`);
                document.getElementById('planUpgradeLink').onclick = e => { e.preventDefault(); this.showUpgrade(); };
            }
            /* --- landing pricing section --- */
            if (!document.getElementById('tvPricing')) {
                const footer = document.querySelector('footer');
                const anchor = footer || document.querySelector('.testimonials, #features-section');
                if (anchor) {
                    const sec = document.createElement('section');
                    sec.id = 'tvPricing'; sec.className = 'tv-pricing';
                    sec.innerHTML = `<h2>Simple, honest pricing</h2><p>Start free. Upgrade when your journaling gets serious.</p>
                    <div class="plan-cards">
                      <div class="plan-card2"><h4>Free</h4><div class="plan-price">$0 <small>forever</small></div>
                        <ul class="plan-feats"><li>Up to ${FREE_TRADE_LIMIT} trades</li><li>Journal, charts & analytics</li><li>All calculators</li><li class="no">CSV import</li><li class="no">PDF & weekly reports</li><li class="no">Grade analytics</li></ul>
                        <button class="btn btn-secondary" onclick="location.href='auth.html'">Start Free</button></div>
                      <div class="plan-card2 pro"><span class="plan-tag">MOST POPULAR</span><h4>Pro</h4><div class="plan-price">$9 <small>/ month</small></div>
                        <ul class="plan-feats"><li>Unlimited trades</li><li>Everything in Free</li><li>CSV import</li><li>PDF & weekly reports</li><li>Grade analytics</li><li>PRO badge & priority support</li></ul>
                        <button class="btn btn-primary" onclick="tvPlan.showUpgrade()">Get Pro</button></div>
                    </div>`;
                    anchor.before(sec);
                }
            }
        },

        showUpgrade(feature) {
            const ov = document.getElementById('modalOverlay');
            if (!ov || ov.classList.contains('active')) return;
            ov.innerHTML = `<div class="modal" style="max-width:660px;">
              <div class="modal-header"><h2>${feature ? feature + ' is a Pro feature' : 'TradeVault Plans'}</h2><button class="modal-close" onclick="app.closeModal()">✕</button></div>
              <div class="modal-body">
                <div class="plan-cards">
                  <div class="plan-card2"><h4>Free</h4><div class="plan-price">$0 <small>forever</small></div>
                    <ul class="plan-feats"><li>Up to ${FREE_TRADE_LIMIT} trades</li><li>Journal, charts & analytics</li><li>All calculators</li><li class="no">CSV import</li><li class="no">PDF & weekly reports</li><li class="no">Grade analytics</li></ul></div>
                  <div class="plan-card2 pro"><span class="plan-tag">MOST POPULAR</span><h4>Pro</h4><div class="plan-price">$9 <small>/ month</small></div>
                    <ul class="plan-feats"><li>Unlimited trades</li><li>Everything in Free</li><li>CSV import</li><li>PDF & weekly reports</li><li>Grade analytics</li><li>PRO badge & priority support</li></ul></div>
                </div>
                <div class="form-group"><label>Have a Pro code?</label>
                  <div style="display:flex;gap:.5rem;">
                    <input class="form-control" id="proCodeInput" placeholder="PRO-XXXX-0000" style="text-transform:uppercase;">
                    <button class="btn btn-primary" id="proRedeemBtn">Activate</button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" onclick="app.closeModal()">Later</button>
                <button class="btn btn-primary" id="proBuyBtn">Get Pro — $9/mo</button>
              </div></div>`;
            ov.classList.add('active');
            document.getElementById('proRedeemBtn').onclick = async () => {
                const code = document.getElementById('proCodeInput').value.trim().toUpperCase();
                if (!code) return showToast('Enter a code first', 'warning');
                const btn = document.getElementById('proRedeemBtn');
                btn.disabled = true; btn.textContent = 'Checking…';
                const { data, error } = await tvClient.rpc('redeem_pro_code', { p_code: code });
                btn.disabled = false; btn.textContent = 'Activate';
                if (error) return showToast('Error: ' + error.message, 'error');
                if (data === 'ok') {
                    this.plan = 'pro'; localStorage.setItem('tv_plan', 'pro');
                    app.closeModal(); showToast('Welcome to TradeVault Pro ⭐');
                    setTimeout(() => location.reload(), 900);
                } else showToast('Invalid or already-used code', 'error');
            };
            document.getElementById('proBuyBtn').onclick = () => {
                if (STRIPE_LINK) window.open(STRIPE_LINK, '_blank');
                else showToast('Card payments launch soon — use a Pro code for now', 'warning');
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

    /* ---------- lock Pro visuals for free users + repaint on nav ---------- */
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

    function boot() { tvPlan.refresh(); gates(); tvPlan.paint(); }
    if (document.readyState === 'complete') setTimeout(boot, 400);
    else window.addEventListener('load', () => setTimeout(boot, 400));
    if (typeof dashboard !== 'undefined' && !dashboard.__planHooked) {
        dashboard.__planHooked = 1;
        const od = dashboard.loadDashboard.bind(dashboard);
        dashboard.loadDashboard = async function () { const r = await od(); tvPlan.paint(); return r; };
    }
})();
