(function initTrophyRankPage() {
  const tiers = [
    { name: 'Silver', min: 0, max: 799, color: '#C7D3E6', note: 'Starter league for rising players.' },
    { name: 'Gold', min: 800, max: 1499, color: '#FFD700', note: 'Competitive play starts feeling serious here.' },
    { name: 'Platinum', min: 1500, max: 2499, color: '#00F5FF', note: 'High-skill tier with stronger matchmaking.' },
    { name: 'Diamond', min: 2500, max: Infinity, color: '#A855F7', note: 'Elite tier reserved for top trophy grinders.' }
  ];

  const trophyValueEl = document.getElementById('rankPageTrophies');
  const globalValueEl = document.getElementById('rankPageGlobal');
  const chipEl = document.getElementById('rankPageChip');
  const tierEl = document.getElementById('rankPageTier');
  const metaEl = document.getElementById('rankPageMeta');
  const ladderEl = document.getElementById('rankLadder');

  if (!trophyValueEl || !globalValueEl || !chipEl || !tierEl || !metaEl || !ladderEl) return;

  function getTrophies() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = Number(params.get('trophies'));
    if (Number.isFinite(fromQuery) && fromQuery >= 0) return fromQuery;

    const fromStorage = Number(localStorage.getItem('ludo_trophy_count_v1'));
    if (Number.isFinite(fromStorage) && fromStorage >= 0) return fromStorage;

    return 0;
  }

  function getTier(trophies) {
    return tiers.find(tier => trophies >= tier.min && trophies <= tier.max) || tiers[0];
  }

  function getGlobalRank(trophies) {
    return Math.max(1, Math.round(250000 / Math.max(1, trophies / 100)));
  }

  function formatRange(tier) {
    return Number.isFinite(tier.max)
      ? `${tier.min.toLocaleString()} - ${tier.max.toLocaleString()} trophies`
      : `${tier.min.toLocaleString()}+ trophies`;
  }

  const trophies = getTrophies();
  const currentTier = getTier(trophies);
  const globalRank = getGlobalRank(trophies);

  chipEl.textContent = `${currentTier.name} Tier`;
  tierEl.textContent = currentTier.name;
  tierEl.style.color = currentTier.color;
  trophyValueEl.textContent = trophies.toLocaleString();
  globalValueEl.textContent = `#${globalRank.toLocaleString()}`;
  metaEl.textContent = `${trophies.toLocaleString()} trophies | ${formatRange(currentTier)} | Global #${globalRank.toLocaleString()}`;

  ladderEl.innerHTML = tiers.map(tier => `
    <article class="ladder-item${tier.name === currentTier.name ? ' active' : ''}">
      <div class="ladder-left">
        <div class="ladder-name" style="color:${tier.color}">${tier.name}</div>
        <div class="ladder-note">${tier.note}</div>
      </div>
      <div class="ladder-range">${formatRange(tier)}</div>
    </article>
  `).join('');
})();
