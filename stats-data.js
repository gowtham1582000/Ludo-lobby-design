(function initStatsData() {
  const STORAGE_KEY = 'ludo_match_history_v1';

  function createMatchHistory() {
    const pattern = [
      'W', 'W', 'L', 'W', 'W', 'W', 'L', 'W', 'W', 'W',
      'W', 'L', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'W',
      'L', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'L', 'W',
      'W', 'L', 'W', 'W', 'W', 'W'
    ];
    const endingStreak = Array.from({ length: 14 }, () => 'W');
    const fullPattern = pattern.concat(endingStreak);

    return fullPattern.map((result, index) => {
      const reverseIndex = fullPattern.length - index - 1;
      const timestamp = Date.now() - reverseIndex * 6 * 60 * 60 * 1000;
      const mode = ['Classic Duel', 'Quick Team', 'Rank Rush', 'Royal Arena'][index % 4];
      const trophies = result === 'W' ? 18 + (index % 5) * 3 : -(8 + (index % 4) * 2);
      return {
        id: `mh-${index + 1}`,
        result,
        mode,
        opponent: `Player ${String(index + 11).padStart(2, '0')}`,
        trophies,
        timestamp
      };
    });
  }

  function getMatchHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { }

    const seeded = createMatchHistory();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    } catch { }
    return seeded;
  }

  function getCurrentStreak(history) {
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i -= 1) {
      if (history[i].result !== 'W') break;
      streak += 1;
    }
    return streak;
  }

  function getLongestWinStreak(history) {
    let best = 0;
    let current = 0;
    history.forEach(match => {
      if (match.result === 'W') {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    });
    return best;
  }

  function getWinRate(history) {
    if (!history.length) return 0;
    const wins = history.filter(match => match.result === 'W').length;
    return Math.round((wins / history.length) * 100);
  }

  function getStreakSegments(history) {
    const segments = [];
    let start = 0;

    while (start < history.length) {
      const result = history[start].result;
      let end = start;
      while (end + 1 < history.length && history[end + 1].result === result) {
        end += 1;
      }

      segments.push({
        result,
        length: end - start + 1,
        startMatch: history[start],
        endMatch: history[end]
      });
      start = end + 1;
    }

    return segments;
  }

  window.ludoStatsData = {
    getMatchHistory,
    getCurrentStreak,
    getLongestWinStreak,
    getWinRate,
    getStreakSegments
  };
})();
