// ============ TradeVault Weekly Auto-Review v2 ============
(function () {
    const KEY = 'tv_weekly_reviews';

    function generateReview() {
        if (typeof db === 'undefined') return;
        const cutoff = new Date(Date.now() - 7 * 86400000);
        db.getAllTrades().then(trades => {
            const weekTrades = trades.filter(t => new Date(t.entryDate) >= cutoff);
            if (weekTrades.length === 0) return showToast('No trades recorded in the last 7 days.', 'warning');

            const wins = weekTrades.filter(t => t.profitLoss > 0);
            const losses = weekTrades.filter(t => t.profitLoss < 0);
            const winRate = Math.round((wins.length / weekTrades.length) * 100);
            const netPnL = weekTrades.reduce((sum, t) => sum + t.profitLoss, 0);
            const gradeCounts = {};
            weekTrades.forEach(t => { const g = t.tradeGrade || 'N/A'; gradeCounts[g] = (gradeCounts[g] || 0) + 1; });
            const bestGrade = ['A', 'B', 'C', 'D', 'F'].find(g => gradeCounts[g]) || 'N/A';
            const mistakes = {};
            weekTrades.forEach(t => {
                if (t.profitLoss < 0 && t.mistakes) t.mistakes.split(',').forEach(m => {
                    const c = m.trim(); if (c) mistakes[c] = (mistakes[c] || 0) + Math.abs(t.profitLoss);
                });
            });
            const topMistake = Object.entries(mistakes).sort((a, b) => b[1] - a[1])[0];

            let text = `WEEKLY TRADING REVIEW\n\n`;
            text += `You took ${weekTrades.length} trades over the last 7 days.\n`;
            text += `- Win Rate: ${winRate}% (${wins.length}W / ${losses.length}L)\n`;
            text += `- Net P&L: ${formatCurrency(netPnL)}\n\n`;
            text += `EXECUTION QUALITY\nYour most common trade grade was ${bestGrade}.\n\n`;
            if (topMistake) text += `AREA FOR IMPROVEMENT\nYour most expensive mistake was "${topMistake[0]}", costing ${formatCurrency(topMistake[1])} this week.\n\n`;
            else text += `AREA FOR IMPROVEMENT\nNo major mistakes recorded this week. Excellent discipline!\n\n`;
            text += `FOCUS FOR NEXT WEEK\n`;
            if (winRate < 40) text += `Focus on trade selection. Wait for A+ setups only.`;
            else if (netPnL < 0 && winRate > 50) text += `Your winners are too small. Let winning trades run longer.`;
            else if (netPnL > 0) text += `You are profitable. Stick to the exact routine that got you here.`;
            else text += `Review your trading plan and reduce position size until confidence returns.`;

            showReviewModal(text);
        });
    }

    function showReviewModal(text) {
        const ov = document.getElementById('modalOverlay');
        if (!ov) return;
        ov.innerHTML = `
            <div class="modal" style="max-width: 620px;">
                <div class="modal-header"><h2>Weekly Auto-Review</h2><button class="modal-close" onclick="app.closeModal()">✕</button></div>
                <div class="modal-body">
                    <div style="white-space:pre-wrap;font-size:.88rem;line-height:1.7;color:var(--text-secondary);" id="reviewText">${text}</div>
                    <div style="margin-top:1rem;border-top:1px solid var(--border-color);padding-top:.8rem;">
                        <h5 style="margin-bottom:.5rem;">Saved Reviews</h5>
                        <div id="wkHistory" style="max-height:140px;overflow-y:auto;font-size:.8rem;color:var(--text-secondary);"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-text" onclick="navigator.clipboard.writeText(document.getElementById('reviewText').innerText); showToast('Copied to clipboard!')">Copy</button>
                    <button class="btn btn-secondary" id="wkSave">Save</button>
                    <button class="btn btn-secondary" id="wkPdf">PDF</button>
                    <button class="btn btn-primary" onclick="app.closeModal()">Done</button>
                </div>
            </div>`;
        ov.classList.add('active');
        renderHistory();
        document.getElementById('wkSave').onclick = () => {
            const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
            arr.unshift({ ts: Date.now(), text });
            localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 30)));
            showToast('Review saved to history 📝');
            renderHistory();
        };
        document.getElementById('wkPdf').onclick = () => toPdf(text);
    }

    function renderHistory() {
        const el = document.getElementById('wkHistory');
        if (!el) return;
        const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
        el.innerHTML = arr.length ? arr.map((r, i) =>
            `<div style="padding:.4rem .5rem;border-radius:8px;cursor:pointer;margin-bottom:.3rem;background:rgba(217,224,231,.04);" onclick="document.getElementById('reviewText').innerText=JSON.parse(localStorage.getItem('${KEY}'))[${i}].text">
                📝 ${new Date(r.ts).toLocaleDateString()} — ${r.text.split('\n')[2] || 'Weekly review'}
            </div>`).join('') : '<div style="color:var(--text-tertiary);">No saved reviews yet.</div>';
    }

    function toPdf(text) {
        if (!(window.jspdf && window.jspdf.jsPDF)) return showToast('PDF library not loaded on this page', 'warning');
        const doc = new jspdf.jsPDF();
        const lines = doc.splitTextToSize(text, 180);
        doc.setFontSize(11);
        doc.text(lines, 15, 20);
        doc.save('TradeVault-Weekly-Review.pdf');
        showToast('PDF downloaded 📄');
    }

    function injectButton() {
        const dashHeader = document.querySelector('.dash-header');
        if (!dashHeader || document.getElementById('weeklyReviewBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'weeklyReviewBtn'; btn.className = 'btn btn-secondary';
        btn.style.marginLeft = '0.5rem'; btn.textContent = 'Weekly Review';
        btn.onclick = generateReview;
        const monthlyBtn = document.getElementById('monthlyReportBtn');
        if (monthlyBtn) monthlyBtn.after(btn); else dashHeader.appendChild(btn);
    }

    function boot() {
        injectButton();
        if (typeof dashboard !== 'undefined' && !dashboard.__wkHooked) {
            dashboard.__wkHooked = true;
            const orig = dashboard.loadDashboard.bind(dashboard);
            dashboard.loadDashboard = async function () { const r = await orig(); injectButton(); return r; };
        }
    }
    if (document.readyState === 'complete') setTimeout(boot, 500);
    else window.addEventListener('load', () => setTimeout(boot, 500));
})();
