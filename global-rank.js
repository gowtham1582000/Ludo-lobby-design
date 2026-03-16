(function initGlobalRankPage() {
  const primaryRankEl = document.getElementById('leaderboardPrimaryRank');
  const metaEl = document.getElementById('leaderboardMeta');
  const listTitleEl = document.getElementById('leaderboardListTitle');
  const listMetaEl = document.getElementById('leaderboardListMeta');
  const listEl = document.getElementById('leaderboardList');
  const tabEls = Array.from(document.querySelectorAll('[data-scope]'));
  const regionalTabEl = document.querySelector('[data-scope="regional"]');

  if (!primaryRankEl || !metaEl || !listTitleEl || !listMetaEl || !listEl || !regionalTabEl || !tabEls.length) return;

  const regionConfig = {
    India: { playerOffset: 0, topBase: 8900, suffix: 'IN' },
    'United States': { playerOffset: 180, topBase: 9400, suffix: 'US' },
    Brazil: { playerOffset: 140, topBase: 9100, suffix: 'BR' },
    'United Kingdom': { playerOffset: 95, topBase: 9050, suffix: 'UK' },
    Japan: { playerOffset: 160, topBase: 9200, suffix: 'JP' },
    Indonesia: { playerOffset: 75, topBase: 9000, suffix: 'ID' }
  };

  function getTrophies() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = Number(params.get('trophies'));
    if (Number.isFinite(fromQuery) && fromQuery >= 0) return fromQuery;

    const fromStorage = Number(localStorage.getItem('ludo_trophy_count_v1'));
    if (Number.isFinite(fromStorage) && fromStorage >= 0) return fromStorage;

    return 0;
  }

  function getGlobalRank(trophies) {
    return Math.max(1, Math.round(250000 / Math.max(1, trophies / 100)));
  }

  function getRegionalRank(trophies, regionName) {
    const config = regionConfig[regionName] || regionConfig.India;
    return Math.max(1, Math.round(getGlobalRank(trophies) * 0.12) + config.playerOffset);
  }

  function formatName(index, regionName) {
    const suffix = (regionConfig[regionName] || regionConfig.India).suffix;
    const names = ['Aarav', 'Nova', 'Mira', 'Rogue', 'Zen', 'Kairo', 'Lina', 'Bolt'];
    return `${names[index % names.length]} ${suffix}`;
  }

  const trophies = getTrophies();
  let scope = 'global';
  let region = localStorage.getItem('ludo_rank_region_v1') || 'India';
  if (!regionConfig[region]) region = 'India';

  function buildRows() {
    const rows = [];
    const config = regionConfig[region] || regionConfig.India;
    const playerRank = scope === 'global' ? getGlobalRank(trophies) : getRegionalRank(trophies, region);
    const title = scope === 'global' ? 'Global Top Players' : `${region} Top Players`;

    for (let i = 1; i <= 6; i++) {
      rows.push({
        rank: i,
        name: formatName(i - 1, region),
        trophies: config.topBase - (i - 1) * 260,
        sub: scope === 'global' ? 'World leaderboard contender' : `${region} regional contender`,
        isPlayer: false
      });
    }

    rows.push({
      rank: playerRank,
      name: 'You',
      trophies,
      sub: scope === 'global' ? 'Your current global placement' : `Your current placement in ${region}`,
      isPlayer: true
    });

    rows.sort((a, b) => a.rank - b.rank);
    return { rows, playerRank, title };
  }

  function render() {
    const { rows, playerRank, title } = buildRows();
    primaryRankEl.textContent = `#${playerRank.toLocaleString()}`;
    metaEl.textContent = `${trophies.toLocaleString()} trophies | ${region} selected`;
    regionalTabEl.textContent = `Regional - ${region}`;
    listTitleEl.textContent = title;
    listMetaEl.textContent = scope === 'global'
      ? `${region} region selected`
      : 'Change region to compare local placement';

    tabEls.forEach(tab => {
      const active = tab.dataset.scope === scope;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    listEl.innerHTML = rows.map(row => `
      <article class="leaderboard-row${row.isPlayer ? ' player' : ''}">
        <div class="rank-badge">#${row.rank}</div>
        <div>
          <div class="player-name">${row.name}</div>
          <div class="player-sub">${row.sub}</div>
        </div>
        <div class="player-score">
          <div class="player-trophies">${row.trophies.toLocaleString()}</div>
          <div class="player-scope-rank">${scope === 'global' ? 'Global' : region}</div>
        </div>
      </article>
    `).join('');
  }

  tabEls.forEach(tab => {
    tab.addEventListener('click', () => {
      scope = tab.dataset.scope === 'regional' ? 'regional' : 'global';
      render();
    });
  });

  render();
})();
