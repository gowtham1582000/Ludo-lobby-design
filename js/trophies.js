/* ══════════════════════════════════════════════════════
   TROPHIES PAGE — JavaScript
   ══════════════════════════════════════════════════════ */

/* ── TOAST ── */
function showToast(msg, color = '#00E5A0') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = color;
  t.style.color = color;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── TABS ── */
document.getElementById('tabNav').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const pane = document.getElementById('tab-' + btn.dataset.tab);
  if (pane) pane.classList.add('active');
  const tab = btn.dataset.tab;
  if (tab === 'league')       initLeague();
  if (tab === 'trophies')     initTrophies();
  if (tab === 'medals')       initMedals();
  if (tab === 'leaderboard')  initLeaderboard();
  if (tab === 'streak')       initStreak();
  if (tab === 'achievements') initAchievements();
});

/* ── LEAGUE ── */
const LEAGUES = [
  { icon: '🪵', name: 'WOOD',    min: 0,    max: 400  },
  { icon: '⚔',  name: 'BRONZE',  min: 400,  max: 900  },
  { icon: '🥈', name: 'SILVER',  min: 900,  max: 1600 },
  { icon: '🥇', name: 'GOLD',    min: 1600, max: 2200 },
  { icon: '💎', name: 'DIAMOND', min: 2200, max: 3000 },
  { icon: '👑', name: 'MASTER',  min: 3000, max: 4000 },
  { icon: '⭐', name: 'LEGEND',  min: 4000, max: 5000 },
];
const PLAYER_PTS = 2840;
let leagueInit = false;

function initLeague() {
  if (leagueInit) return;
  leagueInit = true;
  const path = document.getElementById('leaguePath');
  path.innerHTML = '';
  const curIdx = LEAGUES.findIndex(l => PLAYER_PTS >= l.min && PLAYER_PTS < l.max);
  LEAGUES.forEach((league, i) => {
    const isDone = i < curIdx, isCur = i === curIdx;
    const node = document.createElement('div');
    node.className = 'lp-node';
    node.innerHTML = `<div class="lp-badge ${isDone ? 'done' : isCur ? 'current' : 'locked'}">${league.icon}${isDone ? '<div class="lp-check">✓</div>' : ''}</div><div class="lp-name">${league.name}</div>`;
    path.appendChild(node);
    if (i < LEAGUES.length - 1) {
      const conn = document.createElement('div');
      conn.className = 'lp-connector' + (isDone || isCur ? ' done' : '');
      path.appendChild(conn);
    }
  });
  setTimeout(() => {
    const cur = path.querySelector('.current');
    if (cur) cur.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, 400);
  const cur = LEAGUES[curIdx];
  const pct = ((PLAYER_PTS - cur.min) / (cur.max - cur.min)) * 100;
  setTimeout(() => {
    document.getElementById('leagueFill').style.width = pct + '%';
    document.getElementById('leagueMarker').style.left = pct + '%';
  }, 400);
  document.getElementById('ptsNeeded').textContent = `${cur.max - PLAYER_PTS} pts to ${LEAGUES[curIdx + 1]?.name ?? 'MAX'} ›`;
  buildSeasonalRewards();
}

function buildSeasonalRewards() {
  const SREWARDS = [
    { icon: '🏅', name: 'BRONZE FRAME', sub: 'Profile Frame', tier: 'gold' },
    { icon: '🎲', name: 'GOLD DICE', sub: 'Dice Skin', tier: 'gold' },
    { icon: '🗺', name: 'DIAMOND BOARD', sub: 'Board Skin', tier: 'diamond' },
    { icon: '💎', name: '500 GEMS', sub: 'Premium Currency', tier: 'diamond' },
    { icon: '👑', name: 'ROYAL TITLE', sub: 'Profile Title', tier: 'locked' },
    { icon: '🎭', name: 'LEGEND AVATAR', sub: 'Animated Avatar', tier: 'locked' },
  ];
  const grid = document.getElementById('srGrid');
  grid.innerHTML = '';
  SREWARDS.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = `sr-card ${r.tier === 'locked' ? 'locked-reward' : ''}`;
    el.style.animationDelay = `${i * 0.07}s`;
    el.innerHTML = `<span class="sr-card-tier tier-${r.tier}">${r.tier.toUpperCase()}</span><span class="sr-card-icon">${r.icon}</span><div class="sr-card-name">${r.name}</div><div class="sr-card-sub">${r.sub}</div>`;
    el.onclick = () => r.tier === 'locked' ? showToast('🔒 Reach higher league!', '#A855F7') : showToast(`✨ ${r.name} added!`, '#FFB800');
    grid.appendChild(el);
  });
}

/* ── TROPHIES ── */
const TROPHIES_DATA = [
  { icon: '🏆', name: 'FIRST BLOOD',    pts: 50,  tier: 'bronze',  date: 'Jan 5',  desc: 'Win your first Ludo match', locked: false },
  { icon: '🏆', name: 'FLAWLESS RUSH',  pts: 120, tier: 'silver',  date: 'Jan 12', desc: 'Win without any piece captured', locked: false },
  { icon: '🏆', name: 'DICE MASTER',    pts: 200, tier: 'gold',    date: 'Jan 20', desc: 'Roll six 5 times in one match', locked: false },
  { icon: '🏆', name: 'ARENA KING',     pts: 500, tier: 'diamond', date: 'Feb 1',  desc: 'Reach Diamond I league', locked: false },
  { icon: '🏆', name: 'STREAK HUNTER',  pts: 150, tier: 'silver',  date: 'Feb 14', desc: '7-day win streak', locked: false },
  { icon: '🏆', name: 'DOMINATOR',      pts: 300, tier: 'gold',    date: 'Feb 22', desc: 'Eliminate 3 opponents in one game', locked: false },
  { icon: '🏆', name: 'SPEED DEMON',    pts: 180, tier: 'silver',  date: 'Mar 3',  desc: 'Finish a match in under 5 mins', locked: false },
  { icon: '🏆', name: 'GHOST RUNNER',   pts: 400, tier: 'gold',    date: 'Mar 15', desc: 'Move all 4 pieces to home zone', locked: false },
  { icon: '🏆', name: 'TOURNAMENT ACE', pts: 750, tier: 'diamond', date: 'Apr 1',  desc: 'Win a ranked tournament', locked: false },
  { icon: '🏆', name: 'CENTURY CLUB',   pts: 100, tier: 'bronze',  date: 'Apr 8',  desc: 'Play 100 matches', locked: false },
  { icon: '🏆', name: 'ROAD TO LEGEND', pts: 0,   tier: 'gold',    date: '—',      desc: 'Reach Master league', locked: true },
  { icon: '🏆', name: 'ROYAL SEAL',     pts: 0,   tier: 'diamond', date: '—',      desc: 'Win 3 consecutive tournaments', locked: true },
];
let trophyInit = false;

function initTrophies() {
  if (trophyInit) return;
  trophyInit = true;
  renderTrophies('all');
  setupTrophyFilters();
}

function renderTrophies(filter) {
  const grid = document.getElementById('trophiesGrid');
  grid.innerHTML = '';
  const data = filter === 'all' ? TROPHIES_DATA : TROPHIES_DATA.filter(t => t.tier === filter);
  const cols = { gold: '#FFB800', silver: '#C0CFE0', bronze: '#CD7F32', diamond: '#00D4FF' };
  data.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = `trophy-card ${t.locked ? 'locked-trophy' : ''}`;
    el.style.animationDelay = `${i * 0.06}s`;
    el.innerHTML = `<div class="tc-glow"></div><div class="tc-tier-stripe stripe-${t.tier}"></div><span class="tc-icon" style="color:${cols[t.tier]}">${t.icon}</span><div class="tc-name">${t.name}</div>${t.pts ? `<div class="tc-pts">+${t.pts} pts</div>` : ''}<div class="tc-date">${t.date}</div>${t.locked ? '<div class="tc-lock-badge">🔒</div>' : ''}`;
    el.onclick = () => t.locked ? showToast('🔒 Not yet unlocked!', '#5d7a9a') : openTrophyModal(t);
    grid.appendChild(el);
  });
}

function setupTrophyFilters() {
  document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrophies(btn.dataset.filter);
    };
  });
}

function openTrophyModal(t) {
  const cols = { gold: '#FFB800', silver: '#C0CFE0', bronze: '#CD7F32', diamond: '#00D4FF' };
  const col = cols[t.tier];
  document.getElementById('tmContent').innerHTML = `
    <div style="font-size:60px;display:block;margin-bottom:12px;animation:tSpin 4s ease-in-out infinite alternate;filter:drop-shadow(0 0 16px ${col});">${t.icon}</div>
    <div style="font-family:'Chakra Petch',sans-serif;font-size:14px;font-weight:700;color:${col};letter-spacing:2px;margin-bottom:5px;">${t.name}</div>
    <div style="font-size:11px;color:var(--c-muted);margin-bottom:14px;">${t.desc}</div>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px;">
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 14px;text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:600;color:${col};">+${t.pts}</div>
        <div style="font-size:7px;color:var(--c-muted);letter-spacing:1px;">TROPHY PTS</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 14px;text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:var(--c-text);">${t.tier.toUpperCase()}</div>
        <div style="font-size:7px;color:var(--c-muted);letter-spacing:1px;">TIER</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 14px;text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:var(--c-text);">${t.date}</div>
        <div style="font-size:7px;color:var(--c-muted);letter-spacing:1px;">EARNED</div>
      </div>
    </div>
    <button onclick="document.getElementById('modalVeil').classList.remove('open')" style="width:100%;padding:10px;background:linear-gradient(135deg,${col}88,${col});border:none;border-radius:24px;font-family:'Chakra Petch',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;cursor:pointer;color:#000;">CLOSE</button>
  `;
  document.getElementById('modalVeil').classList.add('open');
}

document.getElementById('tmClose').onclick = () => document.getElementById('modalVeil').classList.remove('open');
document.getElementById('modalVeil').onclick = e => {
  if (e.target === document.getElementById('modalVeil')) document.getElementById('modalVeil').classList.remove('open');
};

/* ── MEDALS ── */
const MEDALS_DATA = {
  'COMBAT': [
    { icon: '⚔', name: 'FIRST WIN',   pts: 10,  locked: false, isNew: false },
    { icon: '🗡', name: 'TRIPLE KILL', pts: 30,  locked: false, isNew: true },
    { icon: '🔱', name: 'WARLORD',     pts: 60,  locked: false, isNew: false },
    { icon: '⚡', name: 'BLITZ',       pts: 80,  locked: true,  isNew: false },
    { icon: '💣', name: 'DESTROYER',   pts: 120, locked: true,  isNew: false },
  ],
  'STRATEGY': [
    { icon: '🧠', name: 'TACTICIAN',   pts: 40,  locked: false, isNew: false },
    { icon: '🎯', name: 'PRECISION',   pts: 70,  locked: false, isNew: true },
    { icon: '🔮', name: 'ORACLE',      pts: 100, locked: false, isNew: false },
    { icon: '♟', name: 'GRANDMASTER',  pts: 150, locked: true,  isNew: false },
  ],
  'SOCIAL': [
    { icon: '👥', name: 'TEAM PLAYER', pts: 20, locked: false, isNew: false },
    { icon: '🤝', name: 'GOOD SPORT',  pts: 25, locked: false, isNew: false },
    { icon: '📣', name: 'INFLUENCER',  pts: 50, locked: true,  isNew: false },
  ],
  'SEASON': [
    { icon: '🌟', name: 'S7 WARRIOR', pts: 200, locked: false, isNew: true },
    { icon: '🏅', name: 'S7 ELITE',   pts: 400, locked: true,  isNew: false },
    { icon: '👑', name: 'S7 LEGEND',  pts: 800, locked: true,  isNew: false },
  ],
};
let medalInit = false;

function initMedals() {
  if (medalInit) return;
  medalInit = true;
  const showcase = document.getElementById('medalsShowcase');
  showcase.innerHTML = '';
  Object.entries(MEDALS_DATA).forEach(([cat, medals]) => {
    const earned = medals.filter(m => !m.locked).length;
    const section = document.createElement('div');
    section.className = 'medal-category';
    section.innerHTML = `<div class="mc-header"><span class="mc-icon">${medals[0].icon}</span><span class="mc-title">${cat} MEDALS</span><span class="mc-count">${earned}/${medals.length}</span></div><div class="medals-row" id="mrow-${cat}"></div>`;
    showcase.appendChild(section);
    const row = section.querySelector(`#mrow-${cat}`);
    medals.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = `medal-card ${m.locked ? 'medal-locked' : ''}`;
      card.style.animationDelay = `${i * 0.08}s`;
      card.innerHTML = `${m.isNew && !m.locked ? '<div class="medal-new-badge">NEW</div>' : ''}<span class="medal-icon">${m.icon}</span><div class="medal-name">${m.name}</div><div class="medal-pts">${m.locked ? '🔒' : `+${m.pts} pts`}</div>`;
      card.onclick = () => {
        if (m.locked) { showToast(`🔒 ${m.name} locked`, '#5d7a9a'); return; }
        showToast(`🎖 ${m.name} · +${m.pts} pts`, '#FFB800');
      };
      row.appendChild(card);
    });
  });
}

/* ── LEADERBOARD ── */
const LB_DATA = [
  { name: 'VORTEX_V',  seed: 'vortex', pts: 4820, delta: '+2',  rank: 1 },
  { name: 'BLADE_RUN', seed: 'blade',  pts: 4610, delta: '-1',  rank: 2 },
  { name: 'APEX_ZERO', seed: 'apex',   pts: 4390, delta: '+0',  rank: 3 },
  { name: 'NEON_G',    seed: 'neon',   pts: 3980, delta: '+3',  rank: 4 },
  { name: 'STORM_X',   seed: 'storm3', pts: 3750, delta: '-2',  rank: 5 },
  { name: 'CIPHER_K',  seed: 'cipher', pts: 3510, delta: '+1',  rank: 6 },
  { name: 'RAVEN_Z',   seed: 'raven',  pts: 3290, delta: '+4',  rank: 7 },
  { name: 'PIXEL_X',   seed: 'pixel',  pts: 3100, delta: '-1',  rank: 8 },
  { name: 'NOVA_7',    seed: 'nova',   pts: 2960, delta: '+2',  rank: 9 },
  { name: 'DAYA_X',    seed: 'dayax',  pts: 2840, delta: '+0',  rank: 10, isYou: true },
  { name: 'ZERO_X',    seed: 'zerox',  pts: 2710, delta: '-3',  rank: 11 },
  { name: 'DELTA_F',   seed: 'delta',  pts: 2550, delta: '+5',  rank: 12 },
];
let lbInit = false;

function initLeaderboard() {
  if (lbInit) return;
  lbInit = true;
  buildPodium();
  buildLBList();
  setupLBFilters();
}

function buildPodium() {
  const wrap = document.getElementById('podiumWrap');
  const top3 = LB_DATA.slice(0, 3);
  const order = [top3[1], top3[0], top3[2]];
  order.forEach(p => {
    const col = document.createElement('div');
    col.className = `podium-col pod-${p.rank}`;
    col.innerHTML = `<div class="pod-avatar-wrap">${p.rank === 1 ? '<div class="pod-crown">👑</div>' : ''}<img src="https://api.dicebear.com/7.x/bottts/svg?seed=${p.seed}" class="pod-avatar" alt="${p.name}"/><div class="pod-rank-badge rank-${p.rank}">${p.rank}</div></div><div class="pod-name">${p.name}</div><div class="pod-pts">🏆 ${p.pts.toLocaleString()}</div><div class="pod-block">${p.rank}</div>`;
    wrap.appendChild(col);
  });
}

function buildLBList() {
  const list = document.getElementById('lbList');
  list.innerHTML = '';
  LB_DATA.slice(3).forEach((p, i) => {
    const row = document.createElement('div');
    row.className = `lb-row ${p.isYou ? 'lb-you' : ''}`;
    row.style.animationDelay = `${i * 0.05}s`;
    const dNum = parseInt(p.delta);
    const dCls = dNum > 0 ? 'delta-up' : dNum < 0 ? 'delta-down' : 'delta-same';
    const dIco = dNum > 0 ? '▲' : dNum < 0 ? '▼' : '—';
    row.innerHTML = `<div class="lb-rank-num">#${p.rank}</div><img src="https://api.dicebear.com/7.x/bottts/svg?seed=${p.seed}" class="lb-row-avatar" alt="${p.name}"/><div class="lb-row-name">${p.name}${p.isYou ? ' 🌟' : ''}</div><div class="lb-row-pts">🏆 ${p.pts.toLocaleString()}</div><div class="lb-row-delta ${dCls}">${dIco}${Math.abs(dNum) || ''}</div>`;
    list.appendChild(row);
  });
  document.getElementById('lbYourRank').innerHTML = `YOUR GLOBAL RANK · <span>#10</span> · 2,840 pts · Top 8%`;
}

function setupLBFilters() {
  document.querySelectorAll('.lb-filter').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.lb-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Showing ${btn.textContent.trim()} leaderboard`, '#00D4FF');
    };
  });
}

/* ── STREAK ── */
let streakInit = false;

function initStreak() {
  if (streakInit) return;
  streakInit = true;
  buildStreakCalendar();
  buildStreakMilestones();
  buildMultiplierTrack();
}

function buildStreakCalendar() {
  const cal = document.getElementById('streakCalendar');
  cal.innerHTML = '';
  const today = 18;
  for (let d = 1; d <= 30; d++) {
    const div = document.createElement('div');
    const isFuture = d > today, isToday = d === today, isMissed = [3, 4, 10].includes(d), isStreak = d >= today - 6 && d < today;
    let cls = 'sc-day ';
    if (isFuture) cls += 'sc-future';
    else if (isToday) cls += 'sc-today';
    else if (isMissed) cls += 'sc-missed';
    else cls += 'sc-played';
    div.className = cls;
    div.textContent = d;
    cal.appendChild(div);
  }
}

function buildStreakMilestones() {
  const MS = [
    { days: 3,  label: 'Getting Started',  reward: '+200 🪙',        reached: true },
    { days: 7,  label: 'Week Warrior',     reward: '+500 🪙 +50%',   reached: true },
    { days: 14, label: 'Fortnight Force',  reward: '+1,200 🪙',      reached: false, current: true },
    { days: 21, label: 'Three Week Hero',  reward: '+2,500 🪙',      reached: false },
    { days: 30, label: 'Monthly Legend',    reward: '🏅 Badge',       reached: false },
    { days: 60, label: 'Diamond Streak',   reward: '👑 Crown',       reached: false },
  ];
  const wrap = document.getElementById('streakMilestones');
  wrap.innerHTML = '';
  MS.forEach(m => {
    const row = document.createElement('div');
    row.className = `sm-row ${m.reached ? 'sm-reached' : ''} ${m.current ? 'sm-current' : ''}`;
    row.innerHTML = `<div class="sm-days">${m.days}</div><div class="sm-label">${m.label}</div><div class="sm-reward">${m.reward}</div>${m.reached ? '<div class="sm-check">✓</div>' : ''}`;
    wrap.appendChild(row);
  });
}

function buildMultiplierTrack() {
  const MULT = [
    { label: 'Day 1-3',   mult: 1.0, active: true,  pct: 100 },
    { label: 'Day 4-6',   mult: 1.1, active: true,  pct: 100 },
    { label: 'Day 7-13',  mult: 1.5, active: true,  pct: 100, current: true },
    { label: 'Day 14-20', mult: 2.0, active: false, pct: 0 },
    { label: 'Day 21-29', mult: 2.5, active: false, pct: 0 },
    { label: 'Day 30+',   mult: 3.0, active: false, pct: 0 },
  ];
  const wrap = document.getElementById('multBars');
  wrap.innerHTML = '';
  MULT.forEach(m => {
    const row = document.createElement('div');
    row.className = 'mult-bar-row';
    row.innerHTML = `<div class="mb-label">${m.label}</div><div class="mb-track"><div class="mb-fill ${m.active ? 'mb-active' : 'mb-inactive'}" style="width:0%" data-pct="${m.active ? m.pct : 0}"></div></div><div class="mb-val" style="color:${m.current ? 'var(--c-amber)' : m.active ? 'var(--c-gold)' : 'var(--c-muted)'}">×${m.mult.toFixed(1)}</div>`;
    wrap.appendChild(row);
  });
  setTimeout(() => {
    document.querySelectorAll('.mb-fill').forEach(f => { f.style.width = f.dataset.pct + '%'; });
  }, 300);
}

/* ── ACHIEVEMENTS ── */
const ACH_DATA = {
  'LUDO BASICS': [
    { icon: '🎲', name: 'FIRST ROLL',    desc: 'Roll your first dice',           xp: 20,  done: true,  pct: 100 },
    { icon: '🎯', name: 'HOME RUN',      desc: 'Get a piece to home',            xp: 30,  done: true,  pct: 100 },
    { icon: '🏠', name: 'ALL HOME',      desc: 'Bring all 4 pieces home',        xp: 60,  done: true,  pct: 100 },
    { icon: '⚔', name: 'FIRST CAPTURE', desc: 'Capture an opponent piece',       xp: 40,  done: true,  pct: 100 },
    { icon: '🔄', name: 'COMEBACK KID',  desc: 'Win after being last place',     xp: 80,  done: false, pct: 60 },
  ],
  'COMBAT': [
    { icon: '💥', name: 'WIPEOUT',     desc: 'Capture 3 pieces in one game',    xp: 100, done: true,  pct: 100 },
    { icon: '🔱', name: 'ELIMINATOR',  desc: 'Eliminate all 3 opponents',       xp: 150, done: false, pct: 33 },
    { icon: '💀', name: 'NO MERCY',    desc: 'Win with 0 losses',              xp: 250, done: false, pct: 0 },
  ],
  'MILESTONES': [
    { icon: '🎂', name: '100 GAMES',    desc: 'Play 100 total matches',         xp: 120, done: true,  pct: 100 },
    { icon: '🏆', name: '50 WINS',      desc: 'Win 50 ranked matches',          xp: 180, done: false, pct: 56 },
    { icon: '⭐', name: 'HIGH ROLLER',  desc: 'Roll six 50 times total',        xp: 90,  done: false, pct: 80 },
    { icon: '👑', name: '1000 WINS',    desc: 'Win 1000 ranked matches',        xp: 500, done: false, pct: 28 },
  ],
};
let achInit = false;

function initAchievements() {
  if (achInit) return;
  achInit = true;
  const fill = document.getElementById('achRingFill');
  const circ = 2 * Math.PI * 35;
  fill.style.strokeDasharray = circ;
  fill.style.strokeDashoffset = circ;
  setTimeout(() => { fill.style.strokeDashoffset = circ * (1 - 0.62); }, 300);
  const cats = document.getElementById('achCategories');
  cats.innerHTML = '';
  Object.entries(ACH_DATA).forEach(([cat, items]) => {
    const sec = document.createElement('div');
    sec.className = 'ach-cat';
    sec.innerHTML = `<div class="ach-cat-title">${cat}</div><div class="ach-cat-grid" id="achgrid-${cat.replace(/\s+/g, '_')}"></div>`;
    cats.appendChild(sec);
    const grid = sec.querySelector('.ach-cat-grid');
    items.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = `ach-card ${a.done ? 'ach-done' : ''} ${!a.done && a.pct === 0 ? 'ach-locked' : ''}`;
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = `${a.done ? '<div class="ach-done-check">✓</div>' : ''}<div class="ach-card-icon">${a.icon}</div><div class="ach-card-info"><div class="ach-card-name">${a.name}</div><div class="ach-card-desc">${a.desc}</div><div class="ach-card-xp">+${a.xp} XP</div></div>${!a.done && a.pct > 0 ? `<div class="ach-progress-strip" style="width:0%" data-pct="${a.pct}"></div>` : ''}`;
      card.onclick = () => {
        if (a.done) showToast(`⭐ ${a.name} · +${a.xp} XP`, '#00E5A0');
        else if (a.pct > 0) showToast(`⏳ ${a.name} · ${a.pct}% done`, '#FFB800');
        else showToast(`🔒 ${a.name} · Not started`, '#5d7a9a');
      };
      grid.appendChild(card);
    });
  });
  setTimeout(() => {
    document.querySelectorAll('.ach-progress-strip[data-pct]').forEach(el => { el.style.width = el.dataset.pct + '%'; });
  }, 400);
}

/* ── 3D TROPHY MOUSE TILT ── */
const trophy3d = document.getElementById('mainTrophy');
const scene = document.getElementById('trophy3dScene');
scene.addEventListener('mousemove', e => {
  const r = scene.getBoundingClientRect();
  const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
  const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
  trophy3d.style.animation = 'none';
  trophy3d.style.transform = `translateX(-50%) rotateY(${dx * 25}deg) rotateX(${-dy * 12}deg)`;
});
scene.addEventListener('mouseleave', () => { trophy3d.style.animation = ''; trophy3d.style.transform = ''; });

/* ── SEASON COUNTDOWN ── */
(function () {
  let secs = 14 * 86400 + 6 * 3600;
  const el = document.getElementById('seasonCountdown');
  function fmt() {
    const d = Math.floor(secs / 86400), h = Math.floor((secs % 86400) / 3600);
    el.textContent = `${d}d ${h}h`;
    secs--;
  }
  fmt();
  setInterval(fmt, 1000);
})();

/* ── SCROLL ENTRANCE ANIMATIONS ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.tab-pane > *, .hero-section > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .4s ${i * .08}s ease, transform .4s ${i * .08}s ease`;
    obs.observe(el);
  });
})();

/* ── INIT ── */
initTrophies();
