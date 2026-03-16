(function initStatsPagesLinks() {
  const dataApi = window.ludoStatsData;
  const winRateCardEl = document.getElementById('winRateCard');
  const winRateValueEl = document.getElementById('winRateValue');
  const winRateSubEl = document.getElementById('winRateSub');
  const streakCardEl = document.getElementById('streakCard');
  const streakValueEl = document.getElementById('streakValue');
  const streakSubEl = document.getElementById('streakSub');

  if (!dataApi || !winRateCardEl || !winRateValueEl || !winRateSubEl || !streakCardEl || !streakValueEl || !streakSubEl) return;

  const history = dataApi.getMatchHistory().slice(-50);
  const currentStreak = dataApi.getCurrentStreak(history);
  const winRate = dataApi.getWinRate(history);

  winRateValueEl.textContent = `${winRate}%`;
  winRateSubEl.textContent = `Last ${history.length} matches`;
  streakValueEl.textContent = String(currentStreak);
  streakSubEl.textContent = currentStreak > 0 ? `${currentStreak} wins in a row` : 'No active streak';

  function openMatchHistory(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.href = 'match-history.html';
  }

  function openStreakDetails(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.href = 'streak-details.html';
  }

  [
    [winRateCardEl, openMatchHistory, 'Open match history'],
    [streakCardEl, openStreakDetails, 'Open streak details']
  ].forEach(([card, handler, label]) => {
    card.classList.add('rank-card-trigger');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', label);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        handler(event);
      }
    });
  });
})();
