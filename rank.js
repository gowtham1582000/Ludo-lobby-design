/* ============================================================
   rank.js — Daya Pass Arena · Rank Page
   ============================================================ */

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

const PLAYER = {
  name: 'DAYA_X', id: '#48291',
  tier: 'S+', tierIcon: '🔱', tierLabel: 'MYTHIC',
  globalRank: 247, trophies: 1240, winRate: 83, winStreak: 14,
  bonusRate: 2.5, pts: 8240, ptsMax: 10000,
};

const TIERS = [
  { name:'MYTHIC',     icon:'🔱', color:'#e879f9', range:'10,000+',  pct:82,  state:'current' },
  { name:'S+',         icon:'⚡', color:'#c084fc', range:'8,000–9,999',pct:100,state:'current' },
  { name:'S',          icon:'💜', color:'#a78bfa', range:'6,000–7,999',pct:100,state:'done' },
  { name:'A+',         icon:'🔵', color:'#60a5fa', range:'4,000–5,999',pct:100,state:'done' },
  { name:'A',          icon:'💚', color:'#34d399', range:'2,000–3,999',pct:100,state:'done' },
  { name:'B+',         icon:'⭐', color:'#fbbf24', range:'0–1,999',    pct:100,state:'done' },
  { name:'MYTHIC III', icon:'🔮', color:'#e879f9', range:'12,000+',    pct:0,  state:'locked' },
];

const CIRCUIT_STATS = [
  { icon:'🏆', val:'1,240', lbl:'TROPHIES',    delta:'+84 this week',  dir:'up',  cls:'gold-c' },
  { icon:'🌐', val:'#247',  lbl:'GLOBAL RANK', delta:'▲ 31 places',    dir:'up',  cls:'mythic-c' },
  { icon:'⚡', val:'14',    lbl:'WIN STREAK',  delta:'Best: 22',        dir:'up',  cls:'blue-c' },
  { icon:'📊', val:'83%',   lbl:'WIN RATE',    delta:'+5% this week',  dir:'up',  cls:'green-c' },
];

const STREAK_MILESTONES = [
  { streak:3,  reward:'🪙', bonus:'+500',  reached:true  },
  { streak:5,  reward:'💎', bonus:'+1k',   reached:true  },
  { streak:10, reward:'🔥', bonus:'+2.5k', reached:true  },
  { streak:15, reward:'⚡', bonus:'+5k',   reached:false },
  { streak:20, reward:'🏆', bonus:'+10k',  reached:false },
  { streak:25, reward:'🔱', bonus:'SKIN',  reached:false },
];

const BONUS_BARS = [
  { label:'TROPHIES',  pct:82, val:'+2.5x',  color:'#f5c518' },
  { label:'COINS',     pct:65, val:'+2.0x',  color:'#fb923c' },
  { label:'XP',        pct:90, val:'+3.0x',  color:'#c084fc' },
  { label:'GEMS',      pct:50, val:'+1.5x',  color:'#4da6ff' },
];

const LEAGUE_DATA = {
  diamond: {
    icon:'💎', name:'Diamond League', color:'#4da6ff',
    pts:'8,000+', players:'1,204',
    list:[
      { rank:1, name:'QUEEN_V',  ava:'👑', sub:'SS · Chennai',  pts:'12,400', trend:'🔼' },
      { rank:2, name:'TITAN_X',  ava:'🗿', sub:'SS+ · Chennai', pts:'11,800', trend:'🔼' },
      { rank:3, name:'DRAGO_99', ava:'🐉', sub:'S+ · Mumbai',   pts:'10,950', trend:'🔽' },
      { rank:4, name:'KING_R',   ava:'🦁', sub:'S+ · Delhi',    pts:'10,200', trend:'▶' },
      { rank:5, name:'BLAZE_K',  ava:'🔥', sub:'S · Chennai',   pts:'9,800',  trend:'🔼' },
      { rank:6, name:'ACE_11',   ava:'🃏', sub:'A+ · Coimbatore',pts:'9,440', trend:'▶' },
      { rank:7, name:'NOVA_X',   ava:'🎯', sub:'A · Delhi',     pts:'9,100',  trend:'🔽' },
      { rank:8, name:'DAYA_X',   ava:'⚔️', sub:'S+ · Chennai',  pts:'8,240',  trend:'🔼', me:true },
    ]
  },
  platinum: {
    icon:'🔷', name:'Platinum League', color:'#a78bfa',
    pts:'5,000–7,999', players:'4,820',
    list:[
      { rank:1, name:'SHADOW_Z', ava:'🌑', sub:'S · Bangalore', pts:'7,900', trend:'🔼' },
      { rank:2, name:'STORM_99', ava:'⚡', sub:'A+ · Hyderabad',pts:'7,400', trend:'▶' },
      { rank:3, name:'ROGUE_M',  ava:'🎭', sub:'A · Chennai',   pts:'7,100', trend:'🔽' },
      { rank:4, name:'VIPER_7',  ava:'🐍', sub:'A · Pune',      pts:'6,800', trend:'🔼' },
      { rank:5, name:'PANDA_P',  ava:'🐼', sub:'B+ · Kolkata',  pts:'6,200', trend:'▶' },
    ]
  },
  gold: {
    icon:'🥇', name:'Gold League', color:'#f5c518',
    pts:'2,000–4,999', players:'18,340',
    list:[
      { rank:1, name:'FLASH_V',  ava:'⚡', sub:'A · Mumbai',    pts:'4,900', trend:'🔼' },
      { rank:2, name:'GHOST_K',  ava:'👻', sub:'A · Delhi',     pts:'4,700', trend:'▶' },
      { rank:3, name:'COBRA_9',  ava:'🐍', sub:'B+ · Pune',     pts:'4,200', trend:'🔽' },
      { rank:4, name:'LUMOS_1',  ava:'💡', sub:'B+ · Chennai',  pts:'3,900', trend:'🔼' },
    ]
  },
  silver: {
    icon:'🥈', name:'Silver League', color:'#c0c0c0',
    pts:'0–1,999', players:'52,100',
    list:[
      { rank:1, name:'OMEGA_8',  ava:'♾️',  sub:'B · Mumbai',    pts:'1,950', trend:'🔼' },
      { rank:2, name:'ZEN_WOLF', ava:'🐺', sub:'B- · Chennai',  pts:'1,800', trend:'▶' },
      { rank:3, name:'REAPER_X', ava:'💀', sub:'C+ · Bangalore',pts:'1,600', trend:'🔼' },
    ]
  },
};

const REWARD_TRAIL = [
  { step:1,  reward:'🪙',  name:'500 Coins',         req:'Reach Bronze',         state:'claimed' },
  { step:2,  reward:'💎',  name:'50 Gems',           req:'Reach Silver',          state:'claimed' },
  { step:3,  reward:'🎨',  name:'Classic Skin',      req:'Reach Gold',            state:'claimed' },
  { step:4,  reward:'🔥',  name:'2,500 Coins',       req:'10 Win Streak',         state:'claimed' },
  { step:5,  reward:'⚡',  name:'Win Trail Badge',   req:'Reach Platinum',        state:'claimed' },
  { step:6,  reward:'🎁',  name:'Mystery Chest',     req:'Reach Diamond (62%)',   state:'current' },
  { step:7,  reward:'🏆',  name:'5,000 Coins',       req:'Reach S Rank',          state:'locked' },
  { step:8,  reward:'🌋',  name:'Volcano Pit Skin',  req:'Reach S+ Rank',         state:'locked' },
  { step:9,  reward:'🔱',  name:'Mythic Frame',      req:'Reach Mythic',          state:'locked' },
  { step:10, reward:'👑',  name:'Season Champion',   req:'Top 100 Global',        state:'locked' },
];

const LEADERBOARD = {
  global: [
    { rank:1,  name:'QUEEN_V',  ava:'👑', sub:'SS · Chennai',    pts:'12,400', trend:'🔼' },
    { rank:2,  name:'TITAN_X',  ava:'🗿', sub:'SS+ · Chennai',   pts:'11,800', trend:'🔼' },
    { rank:3,  name:'DRAGO_99', ava:'🐉', sub:'S+ · Mumbai',     pts:'10,950', trend:'🔽' },
    { rank:4,  name:'KING_R',   ava:'🦁', sub:'S+ · Delhi',      pts:'10,200', trend:'▶' },
    { rank:5,  name:'BLAZE_K',  ava:'🔥', sub:'S · Chennai',     pts:'9,800',  trend:'🔼' },
    { rank:6,  name:'ACE_11',   ava:'🃏', sub:'A+ · Coimbatore', pts:'9,440',  trend:'▶' },
    { rank:7,  name:'NOVA_X',   ava:'🎯', sub:'A · Delhi',       pts:'9,100',  trend:'🔽' },
  ],
  regional: [
    { rank:1,  name:'QUEEN_V',  ava:'👑', sub:'SS · Chennai',    pts:'12,400', trend:'🔼' },
    { rank:2,  name:'TITAN_X',  ava:'🗿', sub:'SS+ · Chennai',   pts:'11,800', trend:'🔼' },
    { rank:3,  name:'BLAZE_K',  ava:'🔥', sub:'S · Chennai',     pts:'9,800',  trend:'🔼' },
    { rank:4,  name:'ROGUE_M',  ava:'🎭', sub:'A · Chennai',     pts:'7,100',  trend:'🔽' },
    { rank:5,  name:'LUMOS_1',  ava:'💡', sub:'B+ · Chennai',    pts:'3,900',  trend:'▶' },
    { rank:6,  name:'ZEN_WOLF', ava:'🐺', sub:'B- · Chennai',    pts:'1,800',  trend:'▶' },
    { rank:7,  name:'DAYA_X',   ava:'⚔️', sub:'S+ · Chennai',    pts:'8,240',  trend:'🔼', me:true },
  ],
  friends: [
    { rank:1,  name:'QUEEN_V',  ava:'👑', sub:'SS',  pts:'12,400', trend:'🔼' },
    { rank:2,  name:'TITAN_X',  ava:'🗿', sub:'SS+', pts:'11,800', trend:'🔼' },
    { rank:3,  name:'DRAGO_99', ava:'🐉', sub:'S+',  pts:'10,950', trend:'🔽' },
    { rank:4,  name:'KING_R',   ava:'🦁', sub:'S+',  pts:'10,200', trend:'▶' },
    { rank:5,  name:'BLAZE_K',  ava:'🔥', sub:'S',   pts:'9,800',  trend:'🔼' },
    { rank:6,  name:'NOVA_X',   ava:'🎯', sub:'A',   pts:'9,100',  trend:'🔽' },
    { rank:7,  name:'DAYA_X',   ava:'⚔️', sub:'S+',  pts:'8,240',  trend:'🔼', me:true },
  ],
};

const MY_RANKS = {
  global:   { rank: 247,  label: 'Global' },
  regional: { rank: 7,    label: 'Chennai' },
  friends:  { rank: 7,    label: 'Friends' },
};

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderMythicCircuit();
  renderLeagueTab('diamond');
  renderRewardTrail();
  renderLeaderboard('global');
  startCountdown();
});

/* ══════════════════════════════════════════
   HERO CARD
══════════════════════════════════════════ */

function renderHero() {
  document.getElementById('globalRank').textContent = `#${PLAYER.globalRank}`;
  document.getElementById('qsWinStreak').textContent = PLAYER.winStreak;
  document.getElementById('qsWinRate').textContent   = `${PLAYER.winRate}%`;
  document.getElementById('qsBonusRate').textContent = `+${PLAYER.bonusRate}x`;
  document.getElementById('qsTrophies').textContent  = PLAYER.trophies.toLocaleString();
  document.getElementById('curPts').textContent      = PLAYER.pts.toLocaleString();
  const pct = Math.round((PLAYER.pts / PLAYER.ptsMax) * 100);
  setTimeout(() => {
    document.getElementById('rankFill').style.width = pct + '%';
    document.getElementById('rankGlow').style.left  = pct + '%';
  }, 300);
}

/* ══════════════════════════════════════════
   MYTHIC CIRCUIT
══════════════════════════════════════════ */

function renderMythicCircuit() {
  renderTierLadder();
  renderCircuitGrid();
  renderStreakCard();
  renderBonusCard();
}

function renderTierLadder() {
  const el = document.getElementById('tierLadder');
  el.innerHTML = TIERS.map(t => {
    const isCurrent  = t.state === 'current';
    const isDone     = t.state === 'done';
    const isLocked   = t.state === 'locked';
    const fillColor  = isLocked ? '#333' : t.color;
    const fillWidth  = isDone ? 100 : (isCurrent ? t.pct : 0);
    const statusCls  = isCurrent ? 'status-current' : isDone ? 'status-done' : 'status-locked';
    const statusTxt  = isCurrent ? 'CURRENT' : isDone ? '✓ DONE' : 'LOCKED';
    const rowCls     = isCurrent ? 'current' : isDone ? 'completed' : 'locked';
    return `
      <div class="tier-row ${rowCls}">
        <div class="tier-icon">${t.icon}</div>
        <div class="tier-info">
          <div class="tier-name" style="color:${t.color}">${t.name}</div>
          <div class="tier-range">${t.range} pts</div>
        </div>
        <div class="tier-bar-wrap">
          <div class="tier-bar-track">
            <div class="tier-bar-fill" style="width:${fillWidth}%;background:${fillColor};"></div>
          </div>
          <div class="tier-pct">${isDone ? '100%' : isCurrent ? t.pct + '%' : '—'}</div>
        </div>
        <span class="tier-badge-status ${statusCls}">${statusTxt}</span>
      </div>`;
  }).join('');
}

function renderCircuitGrid() {
  const el = document.getElementById('circuitGrid');
  el.innerHTML = CIRCUIT_STATS.map((s, i) => `
    <div class="cg-card ${s.cls}" style="animation-delay:${i*0.08}s">
      <div class="cg-icon">${s.icon}</div>
      <div class="cg-val">${s.val}</div>
      <div class="cg-lbl">${s.lbl}</div>
      <div class="cg-delta ${s.dir}">${s.delta}</div>
    </div>`).join('');
}

function renderStreakCard() {
  document.getElementById('streakBig').textContent = PLAYER.winStreak;
  const maxHeight = 48;
  const el = document.getElementById('streakMilestones');
  el.innerHTML = STREAK_MILESTONES.map(m => {
    const barH = Math.round((m.streak / 25) * maxHeight);
    const bg   = m.reached ? '#fb923c' : '#1a1d28';
    const bdr  = m.reached ? 'rgba(251,146,60,0.4)' : 'rgba(255,255,255,0.07)';
    return `
      <div class="sm-step ${m.reached ? 'reached' : ''}">
        <div class="sm-reward">${m.reached ? m.reward : '🔒'}</div>
        <div class="sm-bar" style="height:${barH}px;background:${bg};border:1px solid ${bdr};"></div>
        <div class="sm-num">${m.streak}W</div>
        <div class="sm-num" style="color:${m.reached?'#fb923c':'#444'}">${m.bonus}</div>
      </div>`;
  }).join('');
}

function renderBonusCard() {
  document.getElementById('bonusVal').textContent = `+${PLAYER.bonusRate}x`;
  const el = document.getElementById('bonusBars');
  el.innerHTML = BONUS_BARS.map(b => `
    <div class="bb-item">
      <div class="bb-label">${b.label}</div>
      <div class="bb-track">
        <div class="bb-fill" style="width:${b.pct}%;background:${b.color};transition:width 1s ease;"></div>
      </div>
      <div class="bb-val">${b.val}</div>
    </div>`).join('');
}

/* ══════════════════════════════════════════
   LEADER LEAGUE
══════════════════════════════════════════ */

let currentLeague = 'diamond';

function renderLeagueTab(key) {
  const d = LEAGUE_DATA[key];
  document.getElementById('leagueHero').innerHTML = `
    <div class="lh-icon">${d.icon}</div>
    <div class="lh-name">${d.name}</div>
    <div class="lh-sub">${d.pts} pts · ${d.players} players</div>
    <div class="lh-stats">
      <div class="lh-stat">
        <div class="lh-stat-val" style="color:${d.color}">${d.pts.split('–')[0] || d.pts}</div>
        <div class="lh-stat-lbl">MIN PTS</div>
      </div>
      <div class="lh-stat">
        <div class="lh-stat-val" style="color:var(--text-primary)">${d.players}</div>
        <div class="lh-stat-lbl">PLAYERS</div>
      </div>
    </div>`;

  const el = document.getElementById('leagueList');
  el.innerHTML = d.list.map((p, i) => {
    const rCls = p.rank===1?'r1':p.rank===2?'r2':p.rank===3?'r3':'';
    return `
      <div class="ll-card ${p.me?'me':''}" style="animation-delay:${i*0.05}s">
        <div class="ll-rank ${rCls}">${p.rank===1?'🥇':p.rank===2?'🥈':p.rank===3?'🥉':'#'+p.rank}</div>
        <div class="ll-ava">${p.ava}</div>
        <div class="ll-info">
          <div class="ll-name">${p.name}${p.me?' (YOU)':''}</div>
          <div class="ll-sub">${p.sub}</div>
        </div>
        <div class="ll-pts" style="color:${d.color}">${p.pts}</div>
        <div class="ll-trend">${p.trend}</div>
      </div>`;
  }).join('');
}

function switchLeague(tab, key) {
  document.querySelectorAll('.ltab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentLeague = key;
  renderLeagueTab(key);
}

/* ══════════════════════════════════════════
   REWARD TRAIL
══════════════════════════════════════════ */

function renderRewardTrail() {
  const el = document.getElementById('rewardTrail');
  el.innerHTML = REWARD_TRAIL.map((r, i) => {
    const stepCls   = r.state === 'claimed' ? 'done' : r.state === 'current' ? 'active' : 'pending';
    const stepTxt   = r.state === 'claimed' ? '✓' : r.state === 'current' ? r.step : r.step;
    const itemCls   = r.state === 'claimed' ? 'claimed' : r.state === 'current' ? 'current' : 'locked';
    const statusCls = r.state === 'claimed' ? 'status-claimed' : r.state === 'current' ? 'status-claim' : 'status-locked';
    const statusTxt = r.state === 'claimed' ? '✓ CLAIMED' : r.state === 'current' ? 'CLAIM' : '🔒 LOCKED';
    const onclick   = r.state === 'current' ? `onclick="claimReward(this,'${r.name}')"` : '';
    return `
      <div class="rt-item ${itemCls}" style="animation-delay:${i*0.06}s">
        <div class="rt-step ${stepCls}">${stepTxt}</div>
        <div class="rt-reward-icon">${r.reward}</div>
        <div class="rt-info">
          <div class="rt-reward-name">${r.name}</div>
          <div class="rt-req">${r.req}</div>
        </div>
        <span class="rt-status ${statusCls}" ${onclick}>${statusTxt}</span>
      </div>`;
  }).join('');
}

function claimReward(btn, name) {
  const item = btn.closest('.rt-item');
  item.classList.remove('current');
  item.classList.add('claimed');
  btn.className = 'rt-status status-claimed';
  btn.textContent = '✓ CLAIMED';
  btn.onclick = null;
  const step = item.querySelector('.rt-step');
  step.className = 'rt-step done';
  step.textContent = '✓';
  showMiniToast(`🎁 ${name} claimed!`);
}

/* ══════════════════════════════════════════
   LEADERS (LEADERBOARD)
══════════════════════════════════════════ */

let currentScope = 'global';

function renderLeaderboard(scope) {
  const data = LEADERBOARD[scope];
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  const myRank = MY_RANKS[scope];

  // Podium
  const order = [top3[1], top3[0], top3[2]];
  const podSlots = ['p2','p1','p3'];
  document.getElementById('podium').innerHTML = order.map((p, i) => {
    if (!p) return '';
    return `
      <div class="podium-slot ${podSlots[i]}">
        <div class="pod-name">${p.name}</div>
        <div class="pod-pts">${p.pts}</div>
        <div class="pod-ava">${p.ava}</div>
        <div class="pod-block">${p.rank===1?'🥇':p.rank===2?'🥈':'🥉'}</div>
      </div>`;
  }).join('');

  // Rest
  const listEl = document.getElementById('leaderboardList');
  listEl.innerHTML = rest.map((p, i) => {
    const rCls = '';
    return `
      <div class="ll-card ${p.me?'me':''}" style="animation-delay:${i*0.04}s">
        <div class="ll-rank">#${p.rank}</div>
        <div class="ll-ava">${p.ava}</div>
        <div class="ll-info">
          <div class="ll-name">${p.name}${p.me?' (YOU)':''}</div>
          <div class="ll-sub">${p.sub}</div>
        </div>
        <div class="ll-pts" style="color:var(--gold)">${p.pts}</div>
        <div class="ll-trend">${p.trend}</div>
      </div>`;
  }).join('');

  // My rank sticky row
  document.getElementById('myRankRow').innerHTML = `
    <div class="ll-rank" style="color:var(--mythic)">#${myRank.rank}</div>
    <div class="ll-ava">⚔️</div>
    <div class="ll-info">
      <div class="ll-name" style="color:var(--mythic)">DAYA_X (YOU)</div>
      <div class="ll-sub">${myRank.label} Rank · S+ · 8,240 pts</div>
    </div>
    <div class="ll-pts" style="color:var(--mythic)">8,240</div>
    <div class="ll-trend">🔼</div>`;
}

function switchScope(tab, scope) {
  document.querySelectorAll('.scope-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentScope = scope;
  renderLeaderboard(scope);
}

/* ══════════════════════════════════════════
   TAB SWITCHING
══════════════════════════════════════════ */

function switchTab(tab, key) {
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(`tab-${key}`).classList.add('active');
}

/* ══════════════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════════════ */

function startCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 18);
  endDate.setHours(endDate.getHours() + 6);

  function tick() {
    const now  = new Date();
    const diff = endDate - now;
    if (diff <= 0) { document.getElementById('countdown').textContent = 'ENDED'; return; }
    const d  = Math.floor(diff / 86400000);
    const h  = Math.floor((diff % 86400000) / 3600000);
    const m  = Math.floor((diff % 3600000) / 60000);
    const s  = Math.floor((diff % 60000) / 1000);
    document.getElementById('countdown').textContent = `${d}d ${String(h).padStart(2,'0')}h left`;
    document.getElementById('rfTimer').textContent   = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════
   MINI TOAST
══════════════════════════════════════════ */

let toastTmr = null;

function showMiniToast(msg) {
  let t = document.getElementById('miniToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'miniToast';
    t.style.cssText = `
      position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(60px);
      background:#0f1116;border:1px solid rgba(232,121,249,0.35);color:#e879f9;
      font-family:'Orbitron',monospace;font-size:11px;font-weight:700;letter-spacing:0.5px;
      padding:10px 20px;border-radius:12px;z-index:999;white-space:nowrap;
      transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s;opacity:0;pointer-events:none;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  t.style.opacity = '1';
  clearTimeout(toastTmr);
  toastTmr = setTimeout(() => {
    t.style.transform = 'translateX(-50%) translateY(60px)';
    t.style.opacity = '0';
  }, 2500);
}
