// ============ TradeVault Upgrade Pack: grade analytics + pro calculator ============
(function () {
    async function gradeChart() {
        const grid = document.querySelector('.analytics-full-grid') || (document.querySelector('#analytics .chart-container') || {}).parentElement;
        if (!grid || document.getElementById('gradeChartCard') || typeof Chart === 'undefined' || typeof db === 'undefined') return;
        const trades = (await db.getAllTrades()).filter(t => t.tradeGrade);
        if (!trades.length) return;
        const grades = ['A', 'B', 'C', 'D', 'F'];
        const stats = grades.map(g => {
            const ts = trades.filter(t => t.tradeGrade === g);
            const w = ts.filter(t => t.profitLoss > 0).length;
            return { g, n: ts.length, wr: ts.length ? Math.round(w / ts.length * 100) : 0 };
        });
        grid.insertAdjacentHTML('beforeend', '<div class="chart-container" id="gradeChartCard"><h3>Win Rate by Trade Grade</h3><canvas id="gradeCanvas"></canvas></div>');
        new Chart(document.getElementById('gradeCanvas'), {
            type: 'bar',
            data: {
                labels: stats.map(s => 'Grade ' + s.g),
                datasets: [{ data: stats.map(s => s.wr), backgroundColor: ['#D9E0E7', '#C3CBD4', '#AEB6BF', '#99A1AA', '#6B737D'], borderRadius: 8 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.parsed.y}% win rate · ${stats[c.dataIndex].n} trades` } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#6B737D' } },
                    y: { max: 100, ticks: { color: '#6B737D', callback: v => v + '%' }, grid: { color: 'rgba(217,224,231,0.06)' } }
                }
            }
        });
    }

    function proCalc() {
        const sec = document.getElementById('calculators');
        if (!sec || document.getElementById('proCalcCard')) return;
        const card = document.createElement('div');
        card.id = 'proCalcCard'; card.className = 'card calculator-card';
        card.innerHTML = `<h3>Pro Position Size Calculator</h3>
          <div class="form-group"><label>Instrument</label><select class="form-control" id="pcInst">
            <option value="100000">Forex — Standard Lot (100,000)</option>
            <option value="100">Gold / XAUUSD (100 oz)</option>
            <option value="1">Index / US100 (×1)</option>
            <option value="1c">Crypto — BTC/ETH (×1)</option>
            <option value="custom">Custom contract size</option>
          </select></div>
          <div class="form-group" id="pcCustomWrap" style="display:none;"><label>Contract Size</label><input class="form-control" type="number" id="pcCustom" value="10"></div>
          <div class="form-grid">
            <div class="form-group"><label>Balance ($)</label><input class="form-control" type="number" id="pcBal" value="10000"></div>
            <div class="form-group"><label>Risk %</label><input class="form-control" type="number" step="0.1" id="pcRisk" value="1"></div>
            <div class="form-group"><label>Entry Price</label><input class="form-control" type="number" step="any" id="pcEntry"></div>
            <div class="form-group"><label>Stop Loss</label><input class="form-control" type="number" step="any" id="pcStop"></div>
            <div class="form-group"><label>Take Profit (optional)</label><input class="form-control" type="number" step="any" id="pcTp"></div>
          </div>
          <div class="tf-calc" id="pcOut" style="margin:.7rem 0;">Position size: — enter entry & stop loss</div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary" id="pcCalc">Calculate</button>
            <button class="btn btn-secondary" id="pcUse">Use in Add Trade</button>
          </div>`;
        const hdr = sec.querySelector('.section-header, .dash-header');
        if (hdr) hdr.after(card); else sec.prepend(card);
        const inst = card.querySelector('#pcInst');
        inst.onchange = () => { card.querySelector('#pcCustomWrap').style.display = (inst.value === 'custom') ? '' : 'none'; };
        const calc = () => {
            const cs = inst.value === 'custom' ? (parseFloat(card.querySelector('#pcCustom').value) || 1) : parseFloat(inst.value);
            const bal = parseFloat(card.querySelector('#pcBal').value) || 0;
            const rp = parseFloat(card.querySelector('#pcRisk').value) || 0;
            const e = parseFloat(card.querySelector('#pcEntry').value);
            const s = parseFloat(card.querySelector('#pcStop').value);
            const tp = parseFloat(card.querySelector('#pcTp').value);
            const out = card.querySelector('#pcOut');
            if (!(e > 0 && s > 0 && e !== s)) { out.innerHTML = 'Position size: — enter entry & stop loss'; return null; }
            const risk$ = bal * rp / 100;
            const dist = Math.abs(e - s);
            const lots = risk$ / (dist * cs);
            const units = lots * cs;
            const rr = tp ? (Math.abs(tp - e) / dist).toFixed(2) : null;
            out.innerHTML = `Risk: <strong>${formatCurrency(risk$)}</strong> · Size: <strong>${lots.toFixed(2)} lots</strong> (${formatNumber(units, 0)} units) · Reward: <strong>${rr ? rr + 'R' : '—'}</strong>`;
            return { lots, e, s, tp };
        };
        card.querySelector('#pcCalc').onclick = calc;
        card.querySelector('#pcUse').onclick = () => {
            const r = calc();
            if (!r) return showToast('Enter entry & stop first', 'warning');
            trades.showTradeModal();
            setTimeout(() => {
                const f = document.getElementById('tradeForm'); if (!f) return;
                const set = (n, val) => { const el = f.querySelector(`[name="${n}"]`); if (el) { el.value = val; el.dispatchEvent(new Event('input')); } };
                set('positionSize', r.lots.toFixed(2));
                set('entryPrice', r.e); set('stopLoss', r.s);
                if (r.tp) set('takeProfit', r.tp);
                showToast('Size applied to trade form ✅');
            }, 300);
        };
    }

    function boot() { proCalc(); gradeChart(); }
    new MutationObserver(() => {
        const a = document.getElementById('analytics');
        if (a && a.classList.contains('active')) gradeChart();
        const c = document.getElementById('calculators');
        if (c && c.classList.contains('active')) proCalc();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    if (document.readyState === 'complete') setTimeout(boot, 700);
    else window.addEventListener('load', () => setTimeout(boot, 700));
})();
