/* ══════════════════════════════════════════════════
   DAYA_X — ITEMS VAULT  |  Full Interactive JS
══════════════════════════════════════════════════ */

/* ─────────────── RARITY CONFIG ─────────────── */
const RARITY = {
  common:    { label: 'COMMON',    color: '#90A4AE', glow: 'rgba(144,164,174,.35)' },
  uncommon:  { label: 'UNCOMMON',  color: '#66BB6A', glow: 'rgba(102,187,106,.35)' },
  rare:      { label: 'RARE',      color: '#42A5F5', glow: 'rgba(66,165,245,.35)'  },
  epic:      { label: 'EPIC',      color: '#AB47BC', glow: 'rgba(171,71,188,.35)'  },
  legendary: { label: 'LEGENDARY', color: '#FF8C00', glow: 'rgba(255,140,0,.45)'   },
};
const RARITY_ORDER = { legendary:0, epic:1, rare:2, uncommon:3, common:4 };

/* ─────────────── ITEMS DATA ─────────────── */
const ITEMS = [
  /* BOARDS */
  { id:'b1', cat:'boards', icon:'🌋', name:'Volcano Pit Board',   rarity:'legendary', type:'Board', desc:'Forged in the deepest calderas. Lava flows react to every dice roll in real-time.',               obtained:'Jan 20', power:'∞',   equipped:true,  isNew:false },
  { id:'b2', cat:'boards', icon:'❄️', name:'Arctic Tundra Board', rarity:'epic',      type:'Board', desc:'Sub-zero plains stretch to the horizon. Frost crystals bloom beneath every move.',               obtained:'Feb 3',  power:'950', equipped:false, isNew:false },
  { id:'b3', cat:'boards', icon:'🌌', name:'Cosmic Void Board',   rarity:'rare',      type:'Board', desc:'Play across a living galaxy — stars shift around your pieces as you advance.',                  obtained:'Feb 14', power:'720', equipped:false, isNew:true  },
  { id:'b4', cat:'boards', icon:'🌿', name:'Jungle Canopy Board', rarity:'uncommon',  type:'Board', desc:'Ancient vines weave between tiles; nature reclaims the arena turn by turn.',                   obtained:'Mar 1',  power:'420', equipped:false, isNew:false },
  { id:'b5', cat:'boards', icon:'⚡', name:'Storm Circuit Board', rarity:'rare',      type:'Board', desc:'Electric arcs leap between squares. Power surges propel your tokens forward.',                  obtained:'Mar 8',  power:'680', equipped:false, isNew:true  },
  { id:'b6', cat:'boards', icon:'🏜️', name:'Desert Mirage Board', rarity:'common',   type:'Board', desc:'Shimmering sands and mirages twist the path — not every route is what it seems.',              obtained:'Mar 10', power:'200', equipped:false, isNew:false },

  /* DICE */
  { id:'d1', cat:'dice',   icon:'🔥', name:'Inferno Dice',        rarity:'legendary', type:'Dice',  desc:'Rolled from the core of a dying star. Each toss erupts in volcanic fire.',                     obtained:'Jan 5',  power:'∞',   equipped:true,  isNew:false },
  { id:'d2', cat:'dice',   icon:'🧊', name:'Glacial Dice',         rarity:'epic',      type:'Dice',  desc:'Carved from a thousand-year glacier. Numbers reveal themselves through frost bloom.',           obtained:'Jan 20', power:'900', equipped:false, isNew:false },
  { id:'d3', cat:'dice',   icon:'⭐', name:'Star Fall Dice',       rarity:'rare',      type:'Dice',  desc:'Glows with captured starlight — numbers written in constellations.',                           obtained:'Feb 2',  power:'650', equipped:false, isNew:true  },
  { id:'d4', cat:'dice',   icon:'💀', name:'Shadow Bone Dice',     rarity:'rare',      type:'Dice',  desc:'Carved from obsidian shadow crystal. Its face reveals only darkness and fate.',                obtained:'Feb 7',  power:'630', equipped:false, isNew:false },
  { id:'d5', cat:'dice',   icon:'🌊', name:'Tidal Dice',           rarity:'uncommon',  type:'Dice',  desc:'Waves crash with every roll. Tidal energy amplifies lucky results.',                           obtained:'Feb 15', power:'380', equipped:false, isNew:false },
  { id:'d6', cat:'dice',   icon:'🍃', name:'Nature Dice',          rarity:'common',    type:'Dice',  desc:'Plain oak-carved dice. No frills, just the pure roll of chance.',                              obtained:'Mar 1',  power:'150', equipped:false, isNew:false },
  { id:'d7', cat:'dice',   icon:'⚡', name:'Thunder Dice',         rarity:'uncommon',  type:'Dice',  desc:'Crackling with static. Lightning arcs between the pips on every roll.',                       obtained:'Mar 5',  power:'400', equipped:false, isNew:true  },
  { id:'d8', cat:'dice',   icon:'🌈', name:'Prism Dice',           rarity:'common',    type:'Dice',  desc:'Rainbow faces catch the light. Simple charm for the everyday arena warrior.',                  obtained:'Mar 9',  power:'180', equipped:false, isNew:true  },

  /* AVATARS */
  { id:'a1', cat:'avatars', icon:'👹', name:'Oni Warlord',          rarity:'legendary', type:'Avatar', desc:'The demon general of the ancient arena. His presence alone breaks enemy morale.',             obtained:'Jan 1',  power:'∞',   equipped:true,  isNew:false },
  { id:'a2', cat:'avatars', icon:'🐉', name:'Dragon Soul',          rarity:'epic',      type:'Avatar', desc:'A spirit bound to the great serpent. Power radiates from every movement.',                   obtained:'Jan 18', power:'880', equipped:false, isNew:false },
  { id:'a3', cat:'avatars', icon:'🤖', name:'Chrome Sentinel',      rarity:'rare',      type:'Avatar', desc:'Built in the arena forges. Cold logic drives flawless tactical decisions.',                  obtained:'Feb 5',  power:'700', equipped:false, isNew:true  },
  { id:'a4', cat:'avatars', icon:'🧙', name:'Arcane Sage',          rarity:'rare',      type:'Avatar', desc:'Ancient wisdom flows through every move. The odds bend slightly in their favor.',             obtained:'Feb 10', power:'660', equipped:false, isNew:false },
  { id:'a5', cat:'avatars', icon:'🦅', name:'Storm Eagle',          rarity:'uncommon',  type:'Avatar', desc:'Swift and sharp-eyed. Strikes from above before opponents can react.',                       obtained:'Feb 20', power:'410', equipped:false, isNew:false },
  { id:'a6', cat:'avatars', icon:'🐺', name:'Night Wolf',           rarity:'uncommon',  type:'Avatar', desc:'Hunts in shadow. Most dangerous when cornered and underestimated.',                          obtained:'Mar 3',  power:'390', equipped:false, isNew:true  },
  { id:'a7', cat:'avatars', icon:'🐸', name:'Lucky Toad',           rarity:'common',    type:'Avatar', desc:'Unassuming but blessed. Fortune smiles on those who play the long game.',                    obtained:'Mar 11', power:'200', equipped:false, isNew:true  },

  /* EFFECTS */
  { id:'e1', cat:'effects', icon:'✨', name:'Stardust Trail',       rarity:'legendary', type:'Effect', desc:'Every token move leaves a shimmering trail of stellar particles across the board.',          obtained:'Jan 12', power:'∞',   equipped:true,  isNew:false },
  { id:'e2', cat:'effects', icon:'🔥', name:'Lava Steps',           rarity:'epic',      type:'Effect', desc:'Scorching footprints follow your tokens. The board ignites with each advance.',             obtained:'Feb 1',  power:'870', equipped:false, isNew:false },
  { id:'e3', cat:'effects', icon:'❄️', name:'Frost Crystals',       rarity:'rare',      type:'Effect', desc:'Delicate ice formations bloom wherever your tokens step.',                                   obtained:'Feb 18', power:'620', equipped:false, isNew:true  },
  { id:'e4', cat:'effects', icon:'⚡', name:'Arc Lightning',         rarity:'uncommon',  type:'Effect', desc:'Crackling sparks leap between nearby tokens on every roll.',                                obtained:'Mar 6',  power:'370', equipped:false, isNew:false },

  /* TITLES */
  { id:'t1', cat:'titles',  icon:'👑', name:'Arena Overlord',       rarity:'legendary', type:'Title',  desc:'Reserved for those who have dominated every arena format. Respect is mandatory.',           obtained:'Jan 1',  power:'∞',   equipped:true,  isNew:false },
  { id:'t2', cat:'titles',  icon:'⚔️', name:'The Relentless',       rarity:'epic',      type:'Title',  desc:'No obstacle has slowed this warrior. Every setback becomes fuel.',                          obtained:'Feb 12', power:'800', equipped:false, isNew:false },
  { id:'t3', cat:'titles',  icon:'🎯', name:'Precision Master',     rarity:'rare',      type:'Title',  desc:'Every dice throw feels calculated. Luck is just prepared opportunity.',                     obtained:'Mar 4',  power:'600', equipped:false, isNew:true  },
];

/* ─────────────── STATE ─────────────── */
let currentCat    = 'all';
let currentSort   = 'rarity';
let currentView   = 'grid';
let searchQuery   = '';
let featuredId    = 'b1';
let filteredItems = [...ITEMS];

/* ─────────────── BOOT ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildBackground();
  buildFeatured(featuredId);
  buildTabs();
  renderItems();
  updateStats();
});

/* ─────────────── BACKGROUND ─────────────── */
function buildBackground() {
  // Ambient orbs on canvas
  const canvas = document.getElementById('orbs');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const orbData = Array.from({length: 12}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 60 + Math.random() * 120,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .3,
    warm: Math.random() > .5,
    alpha: .04 + Math.random() * .08,
  }));

  function drawOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbData.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = canvas.width + o.r;
      if (o.x > canvas.width + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      const c = o.warm ? `rgba(255,120,0,${o.alpha})` : `rgba(0,200,255,${o.alpha})`;
      g.addColorStop(0, c); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(drawOrbs);
  }
  drawOrbs();

  // Embers (warm side)
  const embers = document.getElementById('embers');
  for (let i = 0; i < 28; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    const size = 2 + Math.random() * 3;
    const warmColors = ['#FF4500','#FF8C00','#FFD700','#FF6B00'];
    e.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 40}%;
      bottom:${Math.random() * 60}%;
      background:${warmColors[Math.floor(Math.random()*warmColors.length)]};
      box-shadow: 0 0 6px currentColor;
      --ed:${3 + Math.random()*5}s;
      --edd:${Math.random()*5}s;
      --ex:${(Math.random()-.5)*80}px;
    `;
    embers.appendChild(e);
  }

  // Frost flakes (cool side)
  const flakes = document.getElementById('frost-flakes');
  for (let i = 0; i < 20; i++) {
    const f = document.createElement('div');
    f.className = 'flake';
    f.textContent = ['❄','✦','·','*'][Math.floor(Math.random()*4)];
    f.style.cssText = `
      left:${60 + Math.random()*40}%;
      font-size:${8 + Math.random()*12}px;
      --fd:${6 + Math.random()*10}s;
      --fdd:${Math.random()*10}s;
    `;
    flakes.appendChild(f);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* ─────────────── FEATURED ─────────────── */
function buildFeatured(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item) return;
  featuredId = id;
  const r = RARITY[item.rarity];

  // Stage aura color
  document.getElementById('stageAura').style.setProperty('--c-aura', r.glow.replace('rgba','rgba').replace('.45','.3'));
  document.getElementById('stageAura').style.background = `radial-gradient(circle, ${r.glow} 0%, transparent 70%)`;

  // Icon + glow
  document.getElementById('featIcon').textContent = item.icon;
  document.getElementById('featGlow').style.background = `radial-gradient(circle, ${r.glow}, transparent 70%)`;
  document.querySelector('.feat-item').style.setProperty('--feat-glow', r.glow);

  // Sparks
  buildSparks(item);

  // Rarity tag
  const tag = document.getElementById('rarityTag');
  tag.textContent = r.label;
  tag.style.background = hexToRgba(r.color, .15);
  tag.style.borderColor = hexToRgba(r.color, .5);
  tag.style.color = r.color;

  // Text
  document.getElementById('featName').textContent = item.name;
  document.getElementById('featType').textContent = `${item.icon}\u00a0\u00a0${item.type} Skin`;
  document.getElementById('featDesc').textContent = item.desc;
  document.getElementById('fRarity').textContent  = r.label;
  document.getElementById('fType').textContent    = item.type;
  document.getElementById('fDate').textContent    = item.obtained;
  document.getElementById('fPower').textContent   = item.power;

  // Equip button
  const btn = document.getElementById('equipBtn');
  const txt = document.getElementById('equipTxt');
  btn.disabled = item.equipped;
  txt.textContent = item.equipped ? '✓ EQUIPPED' : '⚡ EQUIP NOW';
}

function buildSparks(item) {
  const container = document.getElementById('featSparks');
  container.innerHTML = '';
  const colors = item.rarity === 'legendary' ? ['#FFD700','#FF8C00','#FF4500'] :
                 item.rarity === 'epic'      ? ['#CE93D8','#AB47BC','#7B1FA2'] :
                 item.rarity === 'rare'      ? ['#90CAF9','#42A5F5','#1565C0'] :
                                               ['#A5D6A7','#66BB6A'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const angle = (Math.PI * 2 / 10) * i;
    const dist  = 30 + Math.random() * 50;
    s.style.cssText = `
      background: ${colors[i % colors.length]};
      box-shadow: 0 0 4px ${colors[i % colors.length]};
      --sx: ${Math.cos(angle) * dist}px;
      --sy: ${Math.sin(angle) * dist}px;
      --sd: ${1.5 + Math.random()}s;
      --sdd: ${Math.random() * 1.5}s;
    `;
    container.appendChild(s);
  }
}

function equipFeatured() {
  const item = ITEMS.find(i => i.id === featuredId);
  if (!item || item.equipped) return;
  // Unequip same category
  ITEMS.forEach(it => { if (it.cat === item.cat) it.equipped = false; });
  item.equipped = true;
  document.getElementById('equipBtn').disabled = true;
  document.getElementById('equipTxt').textContent = '✓ EQUIPPED';
  showToast(`⚡ ${item.name} equipped!`);
  spawnEquipBurst();
  renderItems();
  updateStats();
}

function spawnEquipBurst() {
  const icon = document.getElementById('featIcon');
  const rect = icon.getBoundingClientRect();
  const colors = ['#FFD700','#FF8C00','#00E5FF','#FF4500','#66BB6A'];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 / 24) * i;
    const dist = 50 + Math.random() * 80;
    Object.assign(p.style, {
      position: 'fixed', zIndex: 500, pointerEvents: 'none',
      width: `${4+Math.random()*5}px`, height: `${4+Math.random()*5}px`,
      borderRadius: '50%', background: colors[i % colors.length],
      boxShadow: `0 0 8px ${colors[i % colors.length]}`,
      left: `${rect.left + rect.width/2}px`, top: `${rect.top + rect.height/2}px`,
      transition: `transform ${.6+Math.random()*.4}s cubic-bezier(.17,.67,.12,1), opacity .8s ease`,
    });
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`;
        p.style.opacity = '0';
      });
    });
    setTimeout(() => p.remove(), 1200);
  }
}

/* ─────────────── TABS ─────────────── */
function buildTabs() {
  document.getElementById('tabs').addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCat = tab.dataset.cat;
    renderItems();
  });
}

/* ─────────────── RENDER ─────────────── */
function renderItems() {
  let items = [...ITEMS];

  // Filter category
  if (currentCat !== 'all') items = items.filter(i => i.cat === currentCat);

  // Filter search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.rarity.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q)
    );
  }

  // Sort
  if (currentSort === 'rarity')   items.sort((a,b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  if (currentSort === 'newest')   items.sort((a,b) => ITEMS.indexOf(b) - ITEMS.indexOf(a));
  if (currentSort === 'name')     items.sort((a,b) => a.name.localeCompare(b.name));
  if (currentSort === 'equipped') items.sort((a,b) => b.equipped - a.equipped);

  filteredItems = items;

  const grid = document.getElementById('itemsGrid');
  const empty = document.getElementById('empty');

  if (!items.length) {
    grid.innerHTML = ''; empty.classList.add('show'); return;
  }
  empty.classList.remove('show');

  const isList = currentView === 'list';
  grid.className = 'items-grid' + (isList ? ' list-view' : '');

  grid.innerHTML = items.map((item, idx) => buildCard(item, idx, isList)).join('');

  // Click handlers
  grid.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.card-action')) return;
      const id = card.dataset.id;
      buildFeatured(id);
      card.closest('main').querySelector('.showcase').scrollIntoView({ behavior: 'smooth' });
    });
  });

  grid.querySelectorAll('.card-action').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      quickEquip(id);
    });
  });
}

function buildCard(item, idx, isList) {
  const r = RARITY[item.rarity];
  const rc = `rc-${item.rarity}`;

  if (isList) {
    return `<div class="item-card list-card ${item.equipped ? 'is-equipped':''}"
         data-id="${item.id}" style="--ci:${idx}; --c-rarity:${r.color}; border-left: 3px solid ${r.color}55;">
      <div class="card-head">
        <div class="card-icon-wrap">
          <div class="card-icon-halo" style="background: radial-gradient(circle, ${r.glow} 0%, transparent 70%)"></div>
          <div class="card-icon">${item.icon}</div>
        </div>
        <div class="list-info">
          <div class="card-name">${item.name}</div>
          <div class="card-rarity ${rc}">${r.label} · ${item.type}</div>
          <div class="card-badges">
            ${item.equipped ? '<span class="badge-equipped">EQUIPPED</span>' : ''}
            ${item.isNew    ? '<span class="badge-new">NEW</span>' : ''}
          </div>
        </div>
      </div>
      <button class="card-action ${item.equipped?'equipped':'equip'}" data-id="${item.id}">
        ${item.equipped ? '✓ ON' : '⚡ EQUIP'}
      </button>
    </div>`;
  }

  return `<div class="item-card ${item.equipped?'is-equipped':''}"
       data-id="${item.id}" style="--ci:${idx}; --c-rarity:${r.color};">
    <div class="card-stripe" style="background:${r.color}; box-shadow:0 0 12px ${r.color}66;"></div>
    <div class="card-head">
      <div class="card-icon-wrap">
        <div class="card-icon-halo" style="background: radial-gradient(circle, ${r.glow} 0%, transparent 70%)"></div>
        <div class="card-icon">${item.icon}</div>
      </div>
      <div class="card-badges">
        ${item.equipped ? '<span class="badge-equipped">EQUIPPED</span>' : ''}
        ${item.isNew    ? '<span class="badge-new">NEW</span>' : ''}
      </div>
    </div>
    <div class="card-body">
      <div class="card-name">${item.name}</div>
      <div class="card-rarity ${rc}">${r.label}</div>
      <button class="card-action ${item.equipped?'equipped':'equip'}" data-id="${item.id}">
        ${item.equipped ? '✓ EQUIPPED' : '⚡ EQUIP'}
      </button>
    </div>
  </div>`;
}

/* ─────────────── QUICK EQUIP ─────────────── */
function quickEquip(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item || item.equipped) return;
  ITEMS.forEach(it => { if (it.cat === item.cat) it.equipped = false; });
  item.equipped = true;
  if (featuredId === id) {
    document.getElementById('equipBtn').disabled = true;
    document.getElementById('equipTxt').textContent = '✓ EQUIPPED';
  }
  showToast(`⚡ ${item.name} equipped!`);
  renderItems();
  updateStats();
}

/* ─────────────── MODAL ─────────────── */
function openModal() {
  const item = ITEMS.find(i => i.id === featuredId);
  if (!item) return;
  const r = RARITY[item.rarity];

  document.getElementById('modalContent').innerHTML = `
    <div class="mod-rarity" style="color:${r.color}">${r.label}</div>
    <div class="mod-name">${item.name}</div>
    <div class="mod-type">${item.icon} ${item.type}</div>
    <div class="mod-icon-stage">
      <div class="mod-icon-glow" style="background:radial-gradient(circle,${r.glow},transparent 70%)"></div>
      <div class="mod-icon">${item.icon}</div>
    </div>
    <div class="mod-desc">${item.desc}</div>
    <div class="mod-stats">
      <div class="mod-stat"><div class="mod-stat-lbl">RARITY</div><div class="mod-stat-val" style="color:${r.color}">${r.label}</div></div>
      <div class="mod-stat"><div class="mod-stat-lbl">TYPE</div><div class="mod-stat-val">${item.type}</div></div>
      <div class="mod-stat"><div class="mod-stat-lbl">OBTAINED</div><div class="mod-stat-val">${item.obtained}</div></div>
      <div class="mod-stat"><div class="mod-stat-lbl">POWER</div><div class="mod-stat-val">${item.power}</div></div>
    </div>
    <button class="mod-equip" ${item.equipped?'disabled':''} onclick="quickEquip('${item.id}'); closeModal()">
      ${item.equipped ? '✓ ALREADY EQUIPPED' : '⚡ EQUIP THIS ITEM'}
    </button>
  `;
  document.getElementById('modalVeil').classList.add('open');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalVeil')) return;
  document.getElementById('modalVeil').classList.remove('open');
}

/* ─────────────── SEARCH ─────────────── */
function onSearch(val) {
  searchQuery = val.trim();
  document.getElementById('searchX').classList.toggle('show', !!searchQuery);
  renderItems();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  searchQuery = '';
  document.getElementById('searchX').classList.remove('show');
  renderItems();
}

/* ─────────────── SORT ─────────────── */
function sortItems() {
  currentSort = document.getElementById('sortSel').value;
  renderItems();
}

/* ─────────────── VIEW ─────────────── */
function setView(v) {
  currentView = v;
  document.getElementById('vgrid').classList.toggle('active', v === 'grid');
  document.getElementById('vlist').classList.toggle('active', v === 'list');
  renderItems();
}

/* ─────────────── STATS ─────────────── */
function updateStats() {
  document.getElementById('spTotal').textContent = ITEMS.length;
}

/* ─────────────── TOAST ─────────────── */
let toastTimer;
function showToast(msg, dur = 2600) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), dur);
}

/* ─────────────── UTIL ─────────────── */
function hexToRgba(hex, alpha) {
  // named/rgba colors pass-through
  if (hex.startsWith('rgb') || hex.startsWith('#') === false) return hex;
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
