(function initStreakDetailsPage() {
  const dataApi = window.ludoStatsData;
  const currentEl = document.getElementById('streakCurrentValue');
  const summaryEl = document.getElementById('streakSummary');
  const longestEl = document.getElementById('streakLongest');
  const recentEl = document.getElementById('streakRecent');
  const listEl = document.getElementById('streakRunList');

  if (!dataApi || !currentEl || !summaryEl || !longestEl || !recentEl || !listEl) return;

  const history = dataApi.getMatchHistory().slice(-50);
  const currentStreak = dataApi.getCurrentStreak(history);
  const longest = dataApi.getLongestWinStreak(history);
  const segments = dataApi.getStreakSegments(history).slice(-8).reverse();
  const recentMatch = history[history.length - 1];

  currentEl.textContent = String(currentStreak);
  summaryEl.textContent = currentStreak > 0
    ? `${currentStreak} wins in a row from your most recent matches`
    : 'No active win streak right now';
  longestEl.textContent = String(longest);
  recentEl.textContent = recentMatch && recentMatch.result === 'W' ? 'Win' : 'Loss';

  listEl.innerHTML = segments.map(segment => {
    const isWin = segment.result === 'W';
    const dateLabel = new Date(segment.endMatch.timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
    return `
      <article class="run-row">
        <div class="run-badge ${isWin ? 'win' : 'loss'}">${isWin ? 'WIN RUN' : 'LOSS RUN'}</div>
        <div>
          <div class="run-name">${segment.length} ${segment.length === 1 ? 'match' : 'matches'}</div>
          <div class="run-sub">${segment.startMatch.mode} to ${segment.endMatch.mode}</div>
        </div>
        <div class="run-score">
          <div class="run-length">${isWin ? `${segment.length}W` : `${segment.length}L`}</div>
          <div class="run-time">${dateLabel}</div>
        </div>
      </article>
    `;
  }).join('');
})();
