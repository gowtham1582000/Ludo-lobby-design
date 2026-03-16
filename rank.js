(function initTrophyRanking() {
  const trophyEl = document.getElementById('trophyCount');
  const rankTierEl = document.getElementById('trophyRankTier');
  const rankRangeEl = document.getElementById('trophyRankRange');
  const globalRankEl = document.getElementById('globalTrophyRank');
  const rankNavItemEl = document.getElementById('rankNavItem');
  const trophyCardEl = trophyEl ? trophyEl.closest('.stat-card') : null;
  const rankCardEl = rankTierEl ? rankTierEl.closest('.stat-card') : null;

  if (!trophyEl || !rankTierEl || !rankRangeEl || !globalRankEl || !trophyCardEl || !rankCardEl) return;

  const tiers = [
    { name: 'Silver', min: 0, max: 799, color: '#C7D3E6' },
    { name: 'Gold', min: 800, max: 1499, color: 'var(--gold)' },
    { name: 'Platinum', min: 1500, max: 2499, color: 'var(--cyan)' },
    { name: 'Diamond', min: 2500, max: Infinity, color: 'var(--purple-soft)' }
  ];

  function parseTrophies(value) {
    return Number(String(value || '').replace(/[^0-9]/g, '')) || 0;
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

  function openRankPage() {
    const trophies = parseTrophies(trophyEl.textContent);
    localStorage.setItem('ludo_trophy_count_v1', String(trophies));
    window.location.href = `trophy-rank.html?trophies=${encodeURIComponent(trophies)}`;
  }

  function openGlobalRankPage(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const trophies = parseTrophies(trophyEl.textContent);
    localStorage.setItem('ludo_trophy_count_v1', String(trophies));
    window.location.href = `global-rank.html?trophies=${encodeURIComponent(trophies)}`;
  }

  function renderTrophyRanking() {
    const trophies = parseTrophies(trophyEl.textContent);
    const currentTier = getTier(trophies);
    const globalRank = getGlobalRank(trophies);

    rankTierEl.textContent = currentTier.name;
    rankTierEl.style.color = currentTier.color;
    rankRangeEl.textContent = formatRange(currentTier);
    globalRankEl.textContent = `Global #${globalRank.toLocaleString()}`;
    localStorage.setItem('ludo_trophy_count_v1', String(trophies));
  }

  rankCardEl.classList.add('rank-card-trigger');
  rankCardEl.setAttribute('role', 'button');
  rankCardEl.setAttribute('tabindex', '0');
  rankCardEl.setAttribute('aria-label', 'Open trophy rank details page');
  rankCardEl.addEventListener('click', openRankPage);
  rankCardEl.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openRankPage();
    }
  });

  trophyCardEl.classList.add('rank-card-trigger');
  trophyCardEl.setAttribute('role', 'button');
  trophyCardEl.setAttribute('tabindex', '0');
  trophyCardEl.setAttribute('aria-label', 'Open global trophy rankings');
  trophyCardEl.addEventListener('click', openGlobalRankPage);
  trophyCardEl.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      openGlobalRankPage(event);
    }
  });

  globalRankEl.classList.add('stat-sub-link');

  if (rankNavItemEl) {
    rankNavItemEl.addEventListener('click', openGlobalRankPage);
    rankNavItemEl.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        openGlobalRankPage(event);
      }
    });
  }

  renderTrophyRanking();

  const observer = new MutationObserver(renderTrophyRanking);
  observer.observe(trophyEl, { childList: true, characterData: true, subtree: true });

  window.updateTrophyRanking = renderTrophyRanking;
})();
