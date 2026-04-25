/* ═══════════════════════════════════════════
   DAYA_X — PROFILE  |  Full Interactive JS
═══════════════════════════════════════════ */

/* ─── STATE ─── */
let xp       = 12450;
let xpGoal   = 15000;
let level    = 42;
let online   = true;
let toastTimer;

const DEFAULT = { xp: 12450, xpGoal: 15000, level: 42, online: true };

/* ─── BADGES DATA ─── */
const BADGES = [
  { icon:'🎯', label:'Sharpshooter', color:'#FF6B00', glow:'rgba(255,107,0,.4)', locked:false },
  { icon:'♟️', label:'Strategist',   color:'#3B82F6', glow:'rgba(59,130,246,.4)',  locked:false },
  { icon:'🛡️', label:'Guardian',    color:'#00E5CC', glow:'rgba(0,229,204,.4)',   locked:false },
  { icon:'⚡', label:'Speed Core',   color:'#FFD700', glow:'rgba(255,215,0,.4)',   locked:false },
  { icon:'🎁', label:'Collector',    color:'#AB47BC', glow:'rgba(171,71,188,.4)',  locked:false },
  { icon:'🌙', label:'Night Ops',    color:'#22D3EE', glow:'rgba(34,211,238,.4)',  locked:false },
  { icon:'💎', label:'Untouchable',  color:'#00E5A0', glow:'rgba(0,229,160,.4)',   locked:false },
  { icon:'🏆', label:'Top Ladder',   color:'#FFB800', glow:'rgba(255,184,0,.4)',   locked:false },
  { icon:'🔥', label:'Hot Streak',   color:'#FF4500', glow:'rgba(255,69,0,.4)',    locked:true  },
  { icon:'🚀', label:'Rocket',       color:'#7B2FF7', glow:'rgba(123,47,247,.4)',  locked:true  },
  { icon:'👑', label:'Overlord',     color:'#FFD700', glow:'rgba(255,215,0,.4)',   locked:true  },
  { icon:'⚔️', label:'Warlord',     color:'#F43F5E', glow:'rgba(244,63,94,.4)',   locked:true  },
];

/* ─── MATCHES POOL ─── */
const MATCHES = [
  { icon:'🌋', name:'Arena Rush',    meta:'MVP · 9/2/6',      result:'+24 RP', color:'#00E5A0' },
  { icon:'⚔️', name:'Temple Clash', meta:'Loss · 3/5/2',     result:'−12 RP', color:'#F43F5E' },
  { icon:'🌌', name:'Sky Grid',      meta:'Flawless · 10/0/7',result:'+32 RP', color:'#FFB800' },
  { icon:'🌙', name:'Night Sprint',  meta:'Win · 7/1/4',      result:'+16 RP', color:'#3B82F6' },
  { icon:'🏔️', name:'Echo Valley',  meta:'Support · 4/3/9',  result:'+8 RP',  color:'#22D3EE' },
  { icon:'⚡', name:'Storm Circuit', meta:'Win · 8/2/5',      result:'+20 RP', color:'#AB47BC' },
];

/* ─── FRIENDS ─── */
const FRIENDS = [
  { name:'NovaFox', initials:'NF', status:'Duo queue ready',    online:true  },
  { name:'Zenith',  initials:'Z',  status:'Last seen 12m ago',  online:false },
  { name:'Kairo',   initials:'K',  status:'In custom room',     online:true  },
  { name:'Miko',    initials:'M',  status:'Looking for squad',  online:true  },
];

/* ═══════════════════════════════════
   BOOT
═══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  updateXP(false);
  updateStatusUI();
  renderBadges();
  renderMatches();
  renderFriends();
  startCountdown();
  startRadar();
  animateMeters();

  // avatar upload
  const avatarInput = document.getElementById('avatarInput');
  avatarInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const av = document.getElementById('avatar');
      av.style.backgroundImage = `linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.22)), url('${ev.target.result}')`;
      av.style.backgroundSize = 'cover';
      av.style.backgroundPosition = 'center';
      document.getElementById('avatarInitials').style.display = 'none';
      showToast('Avatar updated.');
    };
    reader.readAsDataURL(file);
  });

  // Name → initials sync
  document.getElementById('playerName').addEventListener('input', e => {
    const parts = e.target.textContent.trim().split(/\s+/).filter(Boolean).slice(0,2);
    const ini = parts.map(p => p[0]).join('').toUpperCase() || 'DP';
    document.getElementById('avatarInitials').textContent = ini;
  });
});

/* ═══════════════════════════════════
   AMBIENT CANVAS
═══════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('worldCanvas');
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const ORBS = Array.from({length:14}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 70 + Math.random() * 130,
    vx: (Math.random()-.5)*.25,
    vy: (Math.random()-.5)*.25,
    warm: Math.random() > .5,
    a: .04 + Math.random() * .07,
  }));

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ORBS.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = canvas.width + o.r;
      if (o.x > canvas.width + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      const c = o.warm ? `rgba(255,107,0,${o.a})` : `rgba(0,229,204,${o.a})`;
      g.addColorStop(0, c); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ═══════════════════════════════════
   RADAR CHART
═══════════════════════════════════ */
function startRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 60;
  const stats = [82, 88, 73, 69, 76]; // Attack, Speed, Defense, Support, Control
  const labels = ['ATK','SPD','DEF','SUP','CTR'];
  const N = stats.length;
  let phase = 0;

  function drawRadar() {
    ctx.clearRect(0,0,160,160);
    // grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI*2/N)*i - Math.PI/2;
        const d = (r * ring/4);
        const x = cx + d*Math.cos(angle), y = cy + d*Math.sin(angle);
        i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${ring===4?.12:.06})`;
      ctx.lineWidth = 1; ctx.stroke();
    }
    // spokes
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI*2/N)*i - Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r*Math.cos(angle), cy + r*Math.sin(angle));
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // animated data polygon
    const pulse = 1 + Math.sin(phase) * .015;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI*2/N)*i - Math.PI/2;
      const d = r * (stats[i]/100) * pulse;
      const x = cx + d*Math.cos(angle), y = cy + d*Math.sin(angle);
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.closePath();
    // gradient fill
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grd.addColorStop(0, 'rgba(0,229,204,.35)');
    grd.addColorStop(.5, 'rgba(59,130,246,.2)');
    grd.addColorStop(1, 'rgba(255,107,0,.12)');
    ctx.fillStyle = grd; ctx.fill();
    ctx.strokeStyle = 'rgba(0,229,204,.7)'; ctx.lineWidth = 1.5; ctx.stroke();
    // dots
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI*2/N)*i - Math.PI/2;
      const d = r * (stats[i]/100) * pulse;
      ctx.beginPath();
      ctx.arc(cx + d*Math.cos(angle), cy + d*Math.sin(angle), 3, 0, Math.PI*2);
      ctx.fillStyle = '#00E5CC'; ctx.fill();
    }
    // labels
    ctx.font = 'bold 8px Orbitron, monospace';
    ctx.fillStyle = 'rgba(232,244,255,.5)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI*2/N)*i - Math.PI/2;
      const d = r + 12;
      ctx.fillText(labels[i], cx + d*Math.cos(angle), cy + d*Math.sin(angle));
    }
    phase += .025;
    requestAnimationFrame(drawRadar);
  }
  drawRadar();
}

/* ═══════════════════════════════════
   ANIMATE METER BARS
═══════════════════════════════════ */
function animateMeters() {
  setTimeout(() => {
    document.querySelectorAll('.meter-fill').forEach(el => {
      const row = el.closest('.meter-row');
      const pct = getComputedStyle(row).getPropertyValue('--mpct').trim();
      el.style.width = pct;
    });
  }, 400);
}

/* ═══════════════════════════════════
   XP
═══════════════════════════════════ */
function updateXP(animate = true) {
  const pct = Math.max(0, Math.min(100, Math.round((xp / xpGoal) * 100)));
  const bar  = document.getElementById('xpBar');
  const glow = document.getElementById('xpGlow');
  if (animate) {
    bar.style.transition = 'width .9s cubic-bezier(.4,0,.2,1)';
  } else {
    bar.style.transition = 'none';
  }
  setTimeout(() => { bar.style.width = pct + '%'; glow.style.left = pct + '%'; }, animate ? 50 : 300);
  document.getElementById('xpLabel').textContent = `Level ${level} — ${xp.toLocaleString()} / ${xpGoal.toLocaleString()} XP`;
  document.getElementById('xpPercent').textContent = pct + '%';
}

function addXP() {
  const gain = Math.round(Math.random() * 900 + 240);
  xp += gain;
  if (xp >= xpGoal) {
    level++; xp -= xpGoal; xpGoal += 5000;
    showToast(`⬆ Level Up! Now Level ${level}`);
    spawnConfetti();
  } else {
    showToast(`+${gain} XP!`);
  }
  updateXP(true);
  spawnXPPop(gain);
  document.getElementById('streakVal').textContent = Math.min(parseInt(document.getElementById('streakVal').textContent) + 1, 99);
}

function spawnXPPop(gain) {
  const el = document.createElement('div');
  el.className = 'xp-pop';
  el.textContent = `+${gain} XP`;
  const btn = document.querySelector('.warm-btn');
  const rect = btn.getBoundingClientRect();
  el.style.left = rect.left + 'px';
  el.style.top  = rect.top + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

/* ═══════════════════════════════════
   STATUS
═══════════════════════════════════ */
function toggleStatus() {
  online = !online;
  updateStatusUI();
  showToast(online ? '🟢 Status set to Online' : '🔴 Status set to Offline');
}

function updateStatusUI() {
  const chip = document.getElementById('statusChip');
  const dot  = document.getElementById('avatarStatusDot');
  const lbl  = document.getElementById('statusLabel');
  chip.className = 'status-chip' + (online ? '' : ' offline');
  dot.className  = 'avatar-status-dot' + (online ? '' : ' off');
  lbl.textContent = online ? 'Online' : 'Offline';
}

/* ═══════════════════════════════════
   BADGES
═══════════════════════════════════ */
function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = BADGES.map((b, i) => `
    <div class="badge-card ${b.locked ? 'locked' : ''}"
         style="--badge-color:${b.color}; --badge-glow:${b.glow}; --bi:${i}"
         onclick="badgeClick('${b.label}', ${b.locked})">
      <div class="badge-icon-wrap">
        <div class="badge-glow-halo"></div>
        ${b.icon}
      </div>
      <div class="badge-lbl">${b.label}</div>
      ${b.locked ? '<span class="badge-lock">🔒</span>' : ''}
    </div>
  `).join('');
}

function badgeClick(label, locked) {
  if (locked) { showToast(`🔒 ${label} — Not yet unlocked`); return; }
  showToast(`✨ ${label} badge activated!`);
}

/* ═══════════════════════════════════
   MATCHES
═══════════════════════════════════ */
function renderMatches() {
  const pool = [...MATCHES].sort(() => Math.random()-.5).slice(0, 4);
  document.getElementById('matchList').innerHTML = pool.map(m => `
    <div class="match-card" style="--match-color:${m.color}">
      <div class="match-icon">${m.icon}</div>
      <div class="match-info">
        <div class="match-name">${m.name}</div>
        <div class="match-meta">${m.meta}</div>
      </div>
      <div class="match-result" style="color:${m.color}">${m.result}</div>
    </div>
  `).join('');
}

function shuffleMatches() {
  document.getElementById('matchList').style.opacity = '0';
  setTimeout(() => {
    renderMatches();
    document.getElementById('matchList').style.opacity = '1';
    document.getElementById('matchList').style.transition = 'opacity .3s';
  }, 200);
  showToast('⟳ Battle log refreshed');
}

/* ═══════════════════════════════════
   FRIENDS / SQUAD
═══════════════════════════════════ */
function renderFriends() {
  document.getElementById('friendList').innerHTML = FRIENDS.map(f => `
    <div class="friend-card">
      <div class="friend-avatar">
        ${f.initials}
        <div class="friend-online-dot ${f.online ? '' : 'off'}"></div>
      </div>
      <div class="friend-info">
        <div class="friend-name">${f.name}</div>
        <div class="friend-status">${f.status}</div>
      </div>
      <button class="friend-action ${f.online ? 'invite' : ''}"
              onclick="friendAction('${f.name}', ${f.online})">
        ${f.online ? 'Invite' : 'Ping'}
      </button>
    </div>
  `).join('');
}

function friendAction(name, isOnline) {
  showToast(isOnline ? `📩 Invite sent to ${name}` : `🔔 ${name} pinged`);
}

/* ═══════════════════════════════════
   CONTROLS
═══════════════════════════════════ */
function onToggle(btn) {
  btn.classList.toggle('on');
  const label = btn.dataset.label;
  showToast(label + (btn.classList.contains('on') ? ' enabled' : ' disabled'));
}

function saveProfile() {
  document.getElementById('saveNote').textContent = 'Profile saved locally.';
  showToast('✅ Profile saved');
  spawnConfetti(18);
}

function resetProfile() {
  document.getElementById('playerName').textContent = 'Daya Player';
  document.getElementById('avatarInitials').textContent = 'DP';
  document.getElementById('avatarInitials').style.display = '';
  const av = document.getElementById('avatar');
  av.style.backgroundImage = '';
  xp = DEFAULT.xp; xpGoal = DEFAULT.xpGoal; level = DEFAULT.level; online = DEFAULT.online;
  updateXP(true);
  updateStatusUI();
  renderMatches();
  renderFriends();
  document.getElementById('streakVal').textContent = '6';
  document.getElementById('saveNote').textContent = 'Profile reset to defaults.';
  showToast('↺ Profile reset');
}

function focusName() {
  const el = document.getElementById('playerName');
  el.focus();
  const sel = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(el);
  sel.removeAllRanges(); sel.addRange(range);
}

function shareProfile() {
  const text = 'Check out my Daya Pass Arena profile — Level ' + level + ', Mythic II Rank!';
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('🔗 Profile link copied!'));
  } else {
    showToast('🔗 Share text ready');
  }
}

function cycleTheme() {
  const root = document.documentElement;
  const curr = getComputedStyle(root).getPropertyValue('--teal').trim();
  if (curr.includes('00E5CC') || !curr) {
    root.style.setProperty('--teal',    '#7C3AED');
    root.style.setProperty('--teal-lt', '#C4B5FD');
    root.style.setProperty('--cool',    '#A78BFA');
    showToast('🟣 Purple mode activated');
  } else if (curr.includes('7C3AED')) {
    root.style.setProperty('--teal',    '#F43F5E');
    root.style.setProperty('--teal-lt', '#FDA4AF');
    root.style.setProperty('--cool',    '#FB7185');
    showToast('🔴 Rose mode activated');
  } else {
    root.style.setProperty('--teal',    '#00E5CC');
    root.style.setProperty('--teal-lt', '#80FFEC');
    root.style.setProperty('--cool',    '#00C8FF');
    showToast('🩵 Teal mode restored');
  }
}

/* ═══════════════════════════════════
   SEASON COUNTDOWN
═══════════════════════════════════ */
function startCountdown() {
  const el = document.getElementById('seasonCountdown');
  let totalSec = 18 * 86400 + 4 * 3600;
  function tick() {
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    el.textContent = `${d}d ${h}h`;
    if (totalSec > 0) totalSec--;
  }
  tick();
  setInterval(tick, 1000);
}

/* ═══════════════════════════════════
   CONFETTI
═══════════════════════════════════ */
function spawnConfetti(count = 50) {
  const colors = ['#FFD700','#00E5CC','#FF6B00','#3B82F6','#F43F5E','#AB47BC','#00E5A0'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'cf';
    const size = 5 + Math.random() * 9;
    c.style.cssText = `
      left:${5 + Math.random() * 90}vw;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --cr:${Math.random()>.5?'50%':'2px'};
      --cd:${1.2 + Math.random()*2}s;
      --cde:${Math.random()*.5}s;
      --cx:${(Math.random()-.5)*100}px;
      --crr:${Math.random()*720-360}deg;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
}

/* ═══════════════════════════════════
   TOAST
═══════════════════════════════════ */
function showToast(msg, dur = 2400) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), dur);
}
