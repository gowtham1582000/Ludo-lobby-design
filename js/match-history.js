(function initMatchHistoryPage() {
  const dataApi = window.ludoStatsData;
  const winRateEl = document.getElementById('historyWinRate');
  const summaryEl = document.getElementById('historySummary');
  const winsEl = document.getElementById('historyWins');
  const lossesEl = document.getElementById('historyLosses');
  const listEl = document.getElementById('matchHistoryList');

  if (!dataApi || !winRateEl || !summaryEl || !winsEl || !lossesEl || !listEl) return;

  const history = dataApi.getMatchHistory().slice(-10).reverse();
  const wins = history.filter(match => match.result === 'W').length;
  const losses = history.length - wins;
  const winRate = dataApi.getWinRate(history);

  winRateEl.textContent = `${winRate}%`;
  summaryEl.textContent = `${wins} wins in the last ${history.length} matches`;
  winsEl.textContent = String(wins);
  lossesEl.textContent = String(losses);

  listEl.innerHTML = history.map(match => {
    const dateLabel = new Date(match.timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
    const trophyLabel = match.trophies > 0 ? `+${match.trophies}` : `${match.trophies}`;
    return `
      <article class="match-row">
        <div class="match-badge ${match.result === 'W' ? 'win' : 'loss'}">${match.result === 'W' ? 'WIN' : 'LOSS'}</div>
        <div>
          <div class="match-name">${match.mode}</div>
          <div class="match-sub">vs ${match.opponent}</div>
        </div>
        <div class="match-score">
          <div class="match-trophy">${trophyLabel}</div>
          <div class="match-time">${dateLabel}</div>
        </div>
      </article>
    `;
  }).join('');
})();
