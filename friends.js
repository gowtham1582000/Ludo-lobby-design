/* ============================================================
   friends.js — Daya Pass Arena · Friends Page
   ============================================================ */

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

const FRIENDS = [
  { id:'F001', name:'KING_R',    avatar:'🦁', status:'online',  locale:'Chennai, IN', trophies:3820, winrate:79, rank:'S+', ingameRoom:null },
  { id:'F002', name:'DRAGO_99',  avatar:'🐉', status:'ingame',  locale:'Mumbai, IN',  trophies:5100, winrate:85, rank:'S+', ingameRoom:'Room #4421' },
  { id:'F003', name:'NOVA_X',    avatar:'🎯', status:'online',  locale:'Delhi, IN',   trophies:2240, winrate:62, rank:'A',  ingameRoom:null },
  { id:'F004', name:'BLAZE_K',   avatar:'🔥', status:'online',  locale:'Chennai, IN', trophies:1980, winrate:58, rank:'A',  ingameRoom:null },
  { id:'F005', name:'SHADOW_Z',  avatar:'🌑', status:'ingame',  locale:'Bangalore, IN', trophies:4400, winrate:81, rank:'S', ingameRoom:'Room #2209' },
  { id:'F006', name:'STORM_99',  avatar:'⚡', status:'offline', locale:'Hyderabad, IN', trophies:1650, winrate:54, rank:'B+', ingameRoom:null },
  { id:'F007', name:'QUEEN_V',   avatar:'👑', status:'online',  locale:'Chennai, IN', trophies:6700, winrate:91, rank:'SS', ingameRoom:null },
  { id:'F008', name:'VIPER_7',   avatar:'🐍', status:'offline', locale:'Pune, IN',    trophies:1100, winrate:47, rank:'B',  ingameRoom:null },
  { id:'F009', name:'ACE_11',    avatar:'🃏', status:'online',  locale:'Coimbatore, IN', trophies:3100, winrate:73, rank:'A+', ingameRoom:null },
  { id:'F010', name:'PANDA_P',   avatar:'🐼', status:'offline', locale:'Kolkata, IN', trophies:890,  winrate:43, rank:'B-', ingameRoom:null },
  { id:'F011', name:'TITAN_X',   avatar:'🗿', status:'ingame',  locale:'Chennai, IN', trophies:7800, winrate:88, rank:'SS+', ingameRoom:'Tournament #12' },
  { id:'F012', name:'ROGUE_M',   avatar:'🎭', status:'online',  locale:'Chennai, IN', trophies:2900, winrate:67, rank:'A',  ingameRoom:null },
];

const INCOMING_REQUESTS = [
  { id:'R001', name:'CYBER_Q',  avatar:'🤖', mutual:3, since:'2h ago' },
  { id:'R002', name:'OMEGA_8',  avatar:'♾️',  mutual:1, since:'5h ago' },
  { id:'R003', name:'ZEN_WOLF', avatar:'🐺', mutual:5, since:'1d ago' },
];

const SENT_REQUESTS = [
  { id:'S001', name:'PRISM_X',  avatar:'🔮', since:'3h ago' },
  { id:'S002', name:'DELTA_4',  avatar:'🔺', since:'2d ago' },
];

/* Search DB — players not yet friends */
const SEARCH_DB = [
  { id:'P001', name:'FLASH_V',  avatar:'⚡', trophies:2100, mutual:2, isFriend:false },
  { id:'P002', name:'GHOST_K',  avatar:'👻', trophies:3300, mutual:0, isFriend:false },
  { id:'P003', name:'COBRA_9',  avatar:'🐍', trophies:1500, mutual:4, isFriend:false },
  { id:'P004', name:'NOVA_X',   avatar:'🎯', trophies:2240, mutual:3, isFriend:true  },
  { id:'P005', name:'LUMOS_1',  avatar:'💡', trophies:4400, mutual:1, isFriend:false },
  { id:'P006', name:'REAPER_X', avatar:'💀', trophies:5500, mutual:0, isFriend:false },
  { id:'P007', name:'TITAN_X',  avatar:'🗿', trophies:7800, mutual:6, isFriend:true  },
  { id:'P008', name:'AURA_9',   avatar:'🌟', trophies:980,  mutual:0, isFriend:false },
];

/* Track sent requests locally */
const sentSet = new Set();

/* ══════════════════════════════════════════
   RENDER FRIENDS LIST
══════════════════════════════════════════ */

let currentFilter = 'all';
let currentSearch = '';

/**
 * Build and inject all friend cards into #friendsList.
 */
function renderFriends() {
  const list = document.getElementById('friendsList');
  list.innerHTML = '';

  const sorted = [...FRIENDS].sort((a, b) => {
    const order = { ingame: 0, online: 1, offline: 2 };
    return order[a.status] - order[b.status];
  });

  const filtered = sorted.filter(f => {
    const matchSearch = currentSearch === '' ||
      f.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      f.id.toLowerCase().includes(currentSearch.toLowerCase());

    const matchFilter =
      currentFilter === 'all'   ? true :
      currentFilter === 'online' ? f.status === 'online' :
      currentFilter === 'local'  ? f.locale.toLowerCase().includes('chennai') :
      currentFilter === 'ingame' ? f.status === 'ingame' : true;

    return matchSearch && matchFilter;
  });

  // Group labels
  const groups = [
    { key: 'ingame', label: 'IN GAME', items: filtered.filter(f => f.status === 'ingame') },
    { key: 'online', label: 'ONLINE',  items: filtered.filter(f => f.status === 'online') },
    { key: 'offline',label: 'OFFLINE', items: filtered.filter(f => f.status === 'offline') },
  ];

  let anyRendered = false;

  groups.forEach(group => {
    if (group.items.length === 0) return;
    anyRendered = true;

    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = `${group.label} · ${group.items.length}`;
    list.appendChild(label);

    group.items.forEach((f, idx) => {
      const card = buildFriendCard(f, idx);
      list.appendChild(card);
    });
  });

  const empty = document.getElementById('emptyState');
  if (!anyRendered) {
    empty.classList.add('visible');
  } else {
    empty.classList.remove('visible');
  }

  updateOnlineStrip();
  updateFriendCount();
}

/**
 * Build a single friend card element.
 */
function buildFriendCard(f, idx) {
  const card = document.createElement('div');
  card.className = `friend-card ${f.status}`;
  card.style.animationDelay = `${idx * 0.04}s`;
  card.onclick = () => openActionPanel(f);

  const canInvite = f.status === 'online';
  const inviteLabel = f.status === 'ingame' ? 'IN GAME' : f.status === 'offline' ? 'OFFLINE' : 'INVITE';

  const ingameBadge = f.status === 'ingame'
    ? `<div class="ingame-banner">🎮 ${f.ingameRoom}</div>` : '';

  card.innerHTML = `
    <div class="fc-avatar-wrap">
      <div class="fc-avatar">${f.avatar}</div>
      <div class="fc-status-dot ${f.status}"></div>
    </div>
    <div class="fc-info">
      <div class="fc-name">${f.name}</div>
      <div class="fc-meta">
        <span class="fc-status-txt ${f.status}">
          ${f.status === 'online' ? '● Online' : f.status === 'ingame' ? '● In Game' : '○ Offline'}
        </span>
        <span class="fc-locale">📍 ${f.locale}</span>
      </div>
      ${ingameBadge}
      <div class="fc-stats">
        <span class="fc-stat trophy">🏆 ${f.trophies.toLocaleString()}</span>
        <span class="fc-stat winrate">${f.winrate}% WR</span>
        <span class="fc-stat rank">${f.rank}</span>
      </div>
    </div>
    <div class="fc-actions">
      <button class="fc-btn invite" onclick="event.stopPropagation(); inviteFriend('${f.id}','${f.name}')" ${canInvite ? '' : 'disabled'}>${inviteLabel}</button>
      <button class="fc-btn more" onclick="event.stopPropagation(); openActionPanel(getFriendById('${f.id}'))">···</button>
    </div>
  `;
  return card;
}

function getFriendById(id) {
  return FRIENDS.find(f => f.id === id);
}

/* ══════════════════════════════════════════
   ONLINE STRIP
══════════════════════════════════════════ */

function updateOnlineStrip() {
  const online = FRIENDS.filter(f => f.status === 'online' || f.status === 'ingame');
  const strip = document.getElementById('onlineStrip');
  const avatarsEl = document.getElementById('stripAvatars');
  const countEl = document.getElementById('stripCount');

  if (online.length === 0) { strip.style.display = 'none'; return; }
  strip.style.display = 'flex';

  const show = online.slice(0, 6);
  avatarsEl.innerHTML = show.map(f => {
    const bg = f.status === 'ingame'
      ? 'background:rgba(77,166,255,0.15);border:1px solid rgba(77,166,255,0.2)'
      : 'background:rgba(0,255,180,0.1);border:1px solid rgba(0,255,180,0.15)';
    return `<div class="strip-av" style="${bg}">${f.avatar}<span class="online-indicator"></span></div>`;
  }).join('');

  countEl.textContent = online.length > 6 ? `+${online.length - 6} more` : `${online.length} online`;
}

/* ══════════════════════════════════════════
   SEARCH & FILTER
══════════════════════════════════════════ */

function searchFriends(val) {
  currentSearch = val.trim();
  const clearBtn = document.getElementById('searchClear');
  clearBtn.style.display = currentSearch ? '' : 'none';
  renderFriends();
}

function clearSearch() {
  document.getElementById('friendSearch').value = '';
  currentSearch = '';
  document.getElementById('searchClear').style.display = 'none';
  renderFriends();
}

function filterFriends(tab, filter) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentFilter = filter;
  renderFriends();
}

/* ══════════════════════════════════════════
   FRIEND COUNT PILL
══════════════════════════════════════════ */

function updateFriendCount() {
  const pill = document.getElementById('friendCountPill');
  pill.textContent = `${FRIENDS.length} FRIENDS`;
}

/* ══════════════════════════════════════════
   INVITE / MATCHUP
══════════════════════════════════════════ */

/**
 * Send a game invite to an online friend.
 */
function inviteFriend(id, name) {
  showToast(`🎮 Invite sent to ${name}!`, 'green');
}

/* ══════════════════════════════════════════
   ACTION PANEL (per friend)
══════════════════════════════════════════ */

function openActionPanel(f) {
  if (!f) return;
  document.getElementById('actionPanelTitle').textContent = f.name;

  document.getElementById('actionProfile').innerHTML = `
    <div class="ap-ava">${f.avatar}</div>
    <div class="ap-name">${f.name}</div>
    <div class="ap-id">ID: #${f.id} · 📍 ${f.locale}</div>
    <div class="ap-stats">
      <div class="ap-stat"><div class="ap-stat-val">${f.trophies.toLocaleString()}</div><div class="ap-stat-lbl">TROPHIES</div></div>
      <div class="ap-stat"><div class="ap-stat-val">${f.winrate}%</div><div class="ap-stat-lbl">WIN RATE</div></div>
      <div class="ap-stat"><div class="ap-stat-val">${f.rank}</div><div class="ap-stat-lbl">RANK</div></div>
    </div>
  `;

  const btns = [];

  if (f.status === 'online') {
    btns.push({ icon:'🎮', title:'Invite to Play', sub:'Send a match invite', cls:'primary', action:`inviteFriend('${f.id}','${f.name}');closeAllPanels();` });
    btns.push({ icon:'⚔️', title:'1v1 Challenge', sub:'Head-to-head battle', cls:'', action:`showToast('⚔️ Challenge sent to ${f.name}!','blue');closeAllPanels();` });
  } else if (f.status === 'ingame') {
    btns.push({ icon:'👁️', title:'Spectate Game', sub:f.ingameRoom, cls:'', action:`showToast('👁️ Joining as spectator...','blue');closeAllPanels();` });
  }

  btns.push({ icon:'👤', title:'View Profile', sub:'Stats, history & achievements', cls:'', action:`showToast('Opening profile...','');closeAllPanels();` });
  btns.push({ icon:'💬', title:'Send Message', sub:'Chat privately', cls:'', action:`showToast('💬 Opening chat...','');closeAllPanels();` });
  btns.push({ icon:'🚫', title:'Remove Friend', sub:'Remove from your friends list', cls:'danger', action:`removeFriend('${f.id}','${f.name}');closeAllPanels();` });

  document.getElementById('actionButtons').innerHTML = btns.map(b => `
    <div class="action-row-btn ${b.cls}" onclick="${b.action}">
      <span class="arb-icon">${b.icon}</span>
      <div class="arb-text">
        <div class="arb-title">${b.title}</div>
        <div class="arb-sub">${b.sub}</div>
      </div>
      <span class="arb-arrow">›</span>
    </div>
  `).join('');

  openPanel('actionPanel');
}

function removeFriend(id, name) {
  const idx = FRIENDS.findIndex(f => f.id === id);
  if (idx > -1) FRIENDS.splice(idx, 1);
  renderFriends();
  showToast(`${name} removed from friends`, 'red');
}

/* ══════════════════════════════════════════
   ADD FRIEND PANEL
══════════════════════════════════════════ */

function searchAdd(val) {
  const results = document.getElementById('addResults');
  const q = val.trim().toLowerCase();

  if (!q) {
    results.innerHTML = `
      <div class="add-placeholder">
        <div class="add-placeholder-icon">🔍</div>
        Search by username or player ID (e.g. #48291)
      </div>`;
    return;
  }

  const matches = SEARCH_DB.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    results.innerHTML = `<div class="add-placeholder"><div class="add-placeholder-icon">😶</div>No players found for "${val}"</div>`;
    return;
  }

  results.innerHTML = matches.map(p => {
    let btnCls = '', btnTxt = 'ADD';
    if (p.isFriend) { btnCls = 'already'; btnTxt = 'FRIENDS'; }
    else if (sentSet.has(p.id)) { btnCls = 'sent'; btnTxt = 'SENT ✓'; }
    return `
      <div class="ar-card">
        <div class="ar-ava">${p.avatar}</div>
        <div class="ar-info">
          <div class="ar-name">${p.name}</div>
          <div class="ar-id">ID: ${p.id} · 🏆 ${p.trophies.toLocaleString()} · ${p.mutual} mutual</div>
        </div>
        <button class="ar-btn ${btnCls}" onclick="sendRequest('${p.id}','${p.name}',this)" ${p.isFriend || sentSet.has(p.id) ? 'disabled' : ''}>${btnTxt}</button>
      </div>`;
  }).join('');
}

function sendRequest(id, name, btn) {
  sentSet.add(id);
  btn.textContent = 'SENT ✓';
  btn.classList.add('sent');
  btn.disabled = true;
  showToast(`Friend request sent to ${name}!`, 'green');
}

function copyInviteLink() {
  const txt = document.getElementById('inviteLink').textContent;
  if (navigator.clipboard) navigator.clipboard.writeText(txt);
  showToast('Invite link copied!', 'green');
}

function shareVia(platform) {
  showToast(`Opening ${platform}...`, 'blue');
}

/* ══════════════════════════════════════════
   REQUESTS PANEL
══════════════════════════════════════════ */

function renderRequestsPanel() {
  const incoming = document.getElementById('incomingReqs');
  const sent = document.getElementById('sentReqs');

  if (INCOMING_REQUESTS.length === 0) {
    incoming.innerHTML = `<div class="add-placeholder"><div class="add-placeholder-icon">📭</div>No incoming requests</div>`;
  } else {
    incoming.innerHTML = INCOMING_REQUESTS.map(r => `
      <div class="req-card" id="inc_${r.id}">
        <div class="req-ava">${r.avatar}</div>
        <div class="req-info">
          <div class="req-name">${r.name}</div>
          <div class="req-meta">${r.mutual} mutual friends · ${r.since}</div>
        </div>
        <div class="req-acts">
          <button class="req-btn accept" onclick="acceptRequest('${r.id}','${r.name}')">ACCEPT</button>
          <button class="req-btn decline" onclick="declineRequest('${r.id}','${r.name}')">✕</button>
        </div>
      </div>`).join('');
  }

  if (SENT_REQUESTS.length === 0) {
    sent.innerHTML = `<div class="add-placeholder"><div class="add-placeholder-icon">📤</div>No sent requests</div>`;
  } else {
    sent.innerHTML = SENT_REQUESTS.map(r => `
      <div class="req-card" id="sent_${r.id}">
        <div class="req-ava">${r.avatar}</div>
        <div class="req-info">
          <div class="req-name">${r.name}</div>
          <div class="req-meta">Sent ${r.since}</div>
        </div>
        <div class="req-acts">
          <span class="req-status-sent">PENDING</span>
          <button class="req-btn cancel" onclick="cancelRequest('${r.id}','${r.name}')">CANCEL</button>
        </div>
      </div>`).join('');
  }

  updateReqBadge();
}

function acceptRequest(id, name) {
  const el = document.getElementById(`inc_${id}`);
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = '0.25s'; setTimeout(() => el.remove(), 260); }
  const idx = INCOMING_REQUESTS.findIndex(r => r.id === id);
  if (idx > -1) INCOMING_REQUESTS.splice(idx, 1);
  // Add to friends list
  const avatars = ['🌟','💫','🔮','🎪'];
  FRIENDS.push({ id, name, avatar: avatars[Math.floor(Math.random()*avatars.length)], status:'online', locale:'India', trophies: Math.floor(Math.random()*3000+500), winrate: Math.floor(Math.random()*40+40), rank:'B+', ingameRoom:null });
  renderFriends();
  updateReqBadge();
  showToast(`${name} is now your friend!`, 'green');
}

function declineRequest(id, name) {
  const el = document.getElementById(`inc_${id}`);
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = '0.25s'; setTimeout(() => el.remove(), 260); }
  const idx = INCOMING_REQUESTS.findIndex(r => r.id === id);
  if (idx > -1) INCOMING_REQUESTS.splice(idx, 1);
  updateReqBadge();
  showToast(`Request from ${name} declined`, 'red');
}

function cancelRequest(id, name) {
  const el = document.getElementById(`sent_${id}`);
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = '0.25s'; setTimeout(() => el.remove(), 260); }
  const idx = SENT_REQUESTS.findIndex(r => r.id === id);
  if (idx > -1) SENT_REQUESTS.splice(idx, 1);
  showToast(`Request to ${name} cancelled`, 'red');
}

function updateReqBadge() {
  const badge = document.getElementById('reqBadge');
  const n = INCOMING_REQUESTS.length;
  badge.textContent = n;
  badge.style.display = n > 0 ? '' : 'none';
}

/* ══════════════════════════════════════════
   PANEL MANAGEMENT
══════════════════════════════════════════ */

function openPanel(id) {
  closeAllPanels(false);
  document.getElementById('panelOverlay').classList.add('open');
  document.getElementById(id).classList.add('open');

  if (id === 'requestsPanel') renderRequestsPanel();
  if (id === 'addPanel') {
    document.getElementById('addSearch').value = '';
    document.getElementById('addResults').innerHTML = `
      <div class="add-placeholder">
        <div class="add-placeholder-icon">🔍</div>
        Search by username or player ID (e.g. #48291)
      </div>`;
  }
}

function closeAllPanels(closeOverlay = true) {
  document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));
  if (closeOverlay) document.getElementById('panelOverlay').classList.remove('open');
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */

let toastTimer = null;

/**
 * Show a brief toast notification.
 * @param {string} msg  - Message text
 * @param {string} type - 'green' | 'blue' | 'red' | ''
 */
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 2600);
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderFriends();
  updateReqBadge();
});
