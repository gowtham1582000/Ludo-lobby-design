/* ══════════════════════════════════════════════════════
   DAILY REWARDS – DAYA PASS  |  interactive JS
══════════════════════════════════════════════════════ */

/* ─── DATA ─── */
const WEEK_REWARDS = [
  { day:1, icon:'🪙', name:'Gold Coins',    value:'+500',    rarity:'COMMON',   color:'#00E5A0' },
  { day:2, icon:'⚡', name:'Power Boost',   value:'+XP×1.5', rarity:'UNCOMMON', color:'#7B2FF7' },
  { day:3, icon:'🎁', name:'Mystery Box',   value:'RANDOM',  rarity:'COMMON',   color:'#FF69B4' },
  { day:4, icon:'💰', name:'Gold Coins',    value:'+2,500',  rarity:'RARE',     color:'#FFB800' },
  { day:5, icon:'🔑', name:'Arena Key',     value:'×2',      rarity:'RARE',     color:'#00E5CC' },
  { day:6, icon:'💎', name:'Gem Pack',      value:'+50',     rarity:'EPIC',     color:'#00CFFF' },
  { day:7, icon:'👑', name:'Crown Chest',   value:'MEGA',    rarity:'LEGENDARY',color:'#FFD700' },
];

const MISSIONS = [
  { id:'m1', icon:'⚔️',  name:'Win 3 Matches',    desc:'Play & win 3 arena matches',   prog:2, total:3,  reward:'+800 🪙',  done:false },
  { id:'m2', icon:'🎯',  name:'Perfect Round',     desc:'Win a match without losing',   prog:1, total:1,  reward:'+💎 ×5',   done:true  },
  { id:'m3', icon:'🤝',  name:'Play with Friends', desc:'Play 2 matches with a friend', prog:1, total:2,  reward:'+XP 500',  done:false },
  { id:'m4', icon:'🔥',  name:'Hot Streak',        desc:'Win 5 matches in a row',       prog:3, total:5,  reward:'+1,500 🪙',done:false },
  { id:'m5', icon:'🏆',  name:'Tournament Entry',  desc:'Join any tournament today',    prog:1, total:1,  reward:'Free Spin',done:true  },
];

const CALENDAR_ICONS = ['🪙','⚡','🎁','💰','🔑','💎','👑','🪙','⚡','🎁',
                         '💰','🔑','💎','👑','🪙','⚡','🎁','💰','🔑','💎',
                         '👑','🪙','⚡','🎁','💰','🔑','💎','👑','🪙','⚡'];

/* ─── STATE ─── */
let currentDay   = 7;
let claimedToday = false;
let coins        = 24650;
let gems         = 480;
let xp           = 1240;
const XP_MAX     = 2000;
let missionsDone = { m2: true, m5: true };

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderStreakRing();
  renderMonthBar();
  renderWeeklyTrack();
  renderTodayCard();
  renderMissions();
  renderLoyaltyBar();
  renderCalendar();
  startCountdown();
  buildTodayRays(document.getElementById('todayRays'), 14, 'rgba(0,229,160,');
  animateCoinsIn();
});

/* ─── STREAK RING ─── */
function renderStreakRing() {
  const pct = currentDay / 30;
  const circ = 326.7;
  const offset = circ - circ * pct;
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('streakRing').style.strokeDashoffset = offset;
    }, 400);
  });
  document.getElementById('streakNum').textContent = currentDay;
  const remaining = 10 - (currentDay % 10) || 10;
  document.getElementById('streakMsg').textContent =
    currentDay >= 30
      ? '🏆 MAX STREAK! You are legendary!'
      : `🎉 Keep going! ${remaining} day${remaining>1?'s':''} to Mega Reward!`;
}

/* ─── MONTH BAR ─── */
function renderMonthBar() {
  document.getElementById('monthDay').textContent = `Day ${currentDay} / 30`;
  setTimeout(() => {
    document.getElementById('monthBarFill').style.width = `${(currentDay / 30) * 100}%`;
  }, 600);
}

/* ─── WEEKLY TRACK ─── */
function renderWeeklyTrack() {
  const track = document.getElementById('weeklyTrack');
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  track.innerHTML = WEEK_REWARDS.map((r, i) => {
    const isClaimed  = i < currentDay - 1;
    const isToday    = i === currentDay - 1;
    const isLocked   = i > currentDay - 1;
    const isSpecial  = r.rarity === 'LEGENDARY' || r.rarity === 'EPIC';
    let cls = 'day-card';
    if (isClaimed) cls += ' claimed';
    if (isToday)   cls += ' today';
    if (isLocked)  cls += ' locked';
    if (isSpecial && !isLocked) cls += ' special';
    return `<div class="${cls}" style="--di:${i}" onclick="dayCardClick(${i})">
      ${isClaimed ? `<div class="day-check">✓</div>` : ''}
      <div class="day-label">${days[i]}</div>
      <div class="day-icon">${r.icon}</div>
      <div class="day-val">${r.value}</div>
      ${isToday ? `<div class="day-now-badge">TODAY</div>` : ''}
    </div>`;
  }).join('');
}

/* ─── TODAY CARD ─── */
function renderTodayCard() {
  const r = WEEK_REWARDS[currentDay - 1];
  document.getElementById('todayIcon').textContent    = r.icon;
  document.getElementById('todayName').textContent    = r.name;
  document.getElementById('todayValue').textContent   = r.value;
  document.getElementById('todayRarity').textContent  = r.rarity;
  document.getElementById('todayRarity').style.color  = r.color;
  document.getElementById('todayRarity').style.borderColor = r.color + '55';
  document.getElementById('todayRarity').style.background  = r.color + '15';
  document.getElementById('todayIcon').style.filter =
    `drop-shadow(0 0 16px ${r.color}88)`;
  if (claimedToday) {
    const btn = document.getElementById('claimBtn');
    btn.disabled = true;
    document.getElementById('claimBtnText').textContent = '✓ CLAIMED';
  }
}

/* ─── TODAY RAYS ─── */
function buildTodayRays(container, count, colorBase) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const ray = document.createElement('div');
    ray.className = 'ray';
    const angle = (360 / count) * i;
    const opacity = 0.12 + Math.random() * 0.18;
    ray.style.cssText = `
      transform: rotate(${angle}deg);
      opacity: ${opacity};
      height: ${80 + Math.random() * 50}px;
      background: linear-gradient(0deg, ${colorBase}0.4), transparent);
      left: 50%; top: 50%; transform-origin: bottom center;
    `;
    container.appendChild(ray);
  }
}

/* ─── MISSIONS ─── */
function renderMissions() {
  const list = document.getElementById('missionsList');
  list.innerHTML = MISSIONS.map((m, i) => {
    const done = missionsDone[m.id] || m.done;
    const pct  = Math.round((m.prog / m.total) * 100);
    return `<div class="mission-item ${done ? 'done' : ''}" style="--mi:${i}" id="mis-${m.id}">
      <div class="mission-icon-wrap">${m.icon}</div>
      <div class="mission-body">
        <div class="mission-name">${m.name} ${done ? '<span style="color:var(--c-green);font-size:11px">✓</span>':''}</div>
        <div class="mission-desc">${m.desc}</div>
        <div class="mission-prog-bar">
          <div class="mission-prog-fill" style="width:${done?100:pct}%"></div>
        </div>
      </div>
      <div class="mission-reward">
        <div class="mission-reward-val">${m.reward}</div>
        <div class="mission-reward-label">${done ? 'Completed' : `${m.prog}/${m.total}`}</div>
        ${done && !missionsDone[m.id+'_collected']
          ? `<button class="mission-collect-btn" onclick="collectMission('${m.id}',this,'${m.reward}')">CLAIM</button>`
          : done ? `<div style="font-size:9px;color:var(--muted);margin-top:3px">Collected</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function collectMission(id, btn, reward) {
  missionsDone[id + '_collected'] = true;
  btn.disabled = true;
  btn.textContent = '✓';
  btn.style.opacity = '.5';
  showToast(`Mission reward collected: ${reward}`);
  addXP(150);
  if (reward.includes('🪙')) {
    const num = parseInt(reward.replace(/[^0-9]/g,'')) || 500;
    coins += num;
    animateCurrency('coinCount', coins);
  }
  if (reward.includes('💎')) {
    gems += 5;
    animateCurrency('gemCount', gems);
  }
}

/* ─── LOYALTY BAR ─── */
function renderLoyaltyBar() {
  setTimeout(() => {
    document.getElementById('loyaltyBarFill').style.width = `${(xp / XP_MAX) * 100}%`;
    document.getElementById('loyaltyXP').textContent = `${xp.toLocaleString()} / ${XP_MAX.toLocaleString()} XP`;
  }, 700);
}

function addXP(amount) {
  xp = Math.min(xp + amount, XP_MAX);
  document.getElementById('loyaltyBarFill').style.width = `${(xp / XP_MAX) * 100}%`;
  document.getElementById('loyaltyXP').textContent = `${xp.toLocaleString()} / ${XP_MAX.toLocaleString()} XP`;
}

/* ─── CALENDAR ─── */
function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  for (let d = 1; d <= 30; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    if (d < currentDay)  cell.classList.add('cal-claimed');
    if (d === currentDay) cell.classList.add('cal-today');
    if (d > currentDay)  cell.classList.add('cal-future');
    if (d % 7 === 0)     cell.classList.add('cal-special');
    cell.innerHTML = `
      <div class="cal-day-num">${d}</div>
      <div class="cal-icon">${d < currentDay ? '✓' : CALENDAR_ICONS[d-1]}</div>
      ${d % 7 === 0 ? `<div class="cal-dot"></div>` : ''}
    `;
    cell.addEventListener('click', () => calCellClick(d));
    grid.appendChild(cell);
  }
}

function calCellClick(day) {
  if (day >= currentDay) {
    showToast(`🔒 Day ${day} unlocks in ${day - currentDay + 1} day${day-currentDay>0?'s':''}!`);
    return;
  }
  const r = WEEK_REWARDS[(day - 1) % 7];
  showToast(`Day ${day}: ${r.icon} ${r.name} — Collected!`);
}

function dayCardClick(idx) {
  if (idx > currentDay - 1) {
    showToast(`🔒 Unlocks on Day ${idx + 1}!`);
  } else if (idx === currentDay - 1 && !claimedToday) {
    claimReward();
  }
}

/* ─── CLAIM REWARD ─── */
function claimReward() {
  if (claimedToday) return;
  claimedToday = true;

  const r = WEEK_REWARDS[currentDay - 1];

  if (r.value.includes('2,500') || r.value.includes('500')) {
    const n = parseInt(r.value.replace(/[^0-9]/g,'')) || 500;
    coins += n;
    setTimeout(() => animateCurrency('coinCount', coins), 1000);
  }
  if (r.name === 'Gem Pack') { gems += 50; setTimeout(() => animateCurrency('gemCount', gems), 1000); }

  addXP(200);

  const btn = document.getElementById('claimBtn');
  btn.disabled = true;
  document.getElementById('claimBtnText').textContent = '✓ CLAIMED';

  const burst = document.getElementById('modalBurst');
  burst.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const piece = document.createElement('div');
    piece.className = 'modal-burst-piece';
    piece.style.cssText = `--ba:${(360/14)*i}deg; --bd:${i*0.03}s;`;
    burst.appendChild(piece);
  }

  document.getElementById('modalIcon').textContent = r.icon;
  document.getElementById('modalDay').textContent  = currentDay;
  document.getElementById('modalName').textContent = r.name;
  document.getElementById('modalVal').textContent  = r.value;

  document.getElementById('claimModal').classList.add('show');

  setTimeout(() => vibrate(), 300);
  renderCalendar();
}

function closeModal() {
  document.getElementById('claimModal').classList.remove('show');
  showToast(`🔥 Streak ${currentDay}! Come back tomorrow!`);
}

/* ─── CURRENCY ANIMATION ─── */
function animateCurrency(id, target) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent.replace(/,/g,'')) || 0;
  const dur = 800;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min((now - startTime) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + (target - start) * ease).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateCoinsIn() {
  setTimeout(() => animateCurrency('coinCount', coins), 300);
  setTimeout(() => animateCurrency('gemCount', gems), 500);
}

/* ─── TOAST ─── */
function showToast(msg, dur = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), dur);
}

/* ─── COUNTDOWN TIMER ─── */
function startCountdown() {
  const el = document.getElementById('countdown');
  function update() {
    const now  = new Date();
    const msLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const h = String(Math.floor(msLeft / 3600000)).padStart(2,'0');
    const m = String(Math.floor((msLeft % 3600000) / 60000)).padStart(2,'0');
    const s = String(Math.floor((msLeft % 60000) / 1000)).padStart(2,'0');
    el.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

/* ─── VIBRATE ─── */
function vibrate() {
  if ('vibrate' in navigator) navigator.vibrate([80, 40, 80]);
}

/* ─── 3D MOUSE TILT ─── */
const todayCard = document.getElementById('todayCard');
if (todayCard) {
  todayCard.addEventListener('mousemove', e => {
    const rect = todayCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    todayCard.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg) scale(1.01)`;
  });
  todayCard.addEventListener('mouseleave', () => {
    todayCard.style.transform = '';
  });
}
