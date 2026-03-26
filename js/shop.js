const SPRITES = {
  daya: {
    file: 'images/daya-pass-design.jpeg',
    cols: 4,
    rows: 2,
    glow: 'cyan',
  },
  token: {
    file: 'images/token-design.jpeg',
    cols: 3,
    rows: 3,
    glow: 'purple',
  },
};

function sprite(sheet, col, row, glow) {
  return { sheet, col, row, glow: glow || SPRITES[sheet].glow };
}

const ITEMS = {
  dice: [
    { id: 'd1', name: 'ROYAL SIGNAL', sprite: sprite('daya', 0, 0), badge: 'owned', desc: 'Default pass skin with a crisp tournament finish.', price: 0, currency: 'free', owned: true },
    { id: 'd2', name: 'FIRELINE PASS', sprite: sprite('daya', 1, 0), badge: 'hot', desc: 'Aggressive ember rails for fast table presence.', price: 600, currency: 'coin' },
    { id: 'd3', name: 'PIXEL VAULT', sprite: sprite('daya', 2, 0), badge: 'new', desc: 'Arcade-style pass skin with a lit cyan frame.', price: 40, currency: 'gem' },
    { id: 'd4', name: 'PRISM CORE', sprite: sprite('daya', 3, 0), desc: 'Clean premium finish with vault-grade glow.', price: 1200, currency: 'coin' },
    { id: 'd5', name: 'TEMPLE ARC', sprite: sprite('daya', 0, 1), desc: 'Sacred panel lines and a warm relic shimmer.', price: 950, currency: 'coin' },
    { id: 'd6', name: 'FROST GRID', sprite: sprite('daya', 1, 1), badge: 'sale', desc: 'Cold neon perimeter built for night ranked sessions.', price: 45, currency: 'gem', sale: 60 },
    { id: 'd7', name: 'SOLAR DASH', sprite: sprite('daya', 2, 1), desc: 'Bright champion trim with high-contrast corners.', price: 70, currency: 'gem' },
    { id: 'd8', name: 'TITAN SEAL', sprite: sprite('daya', 3, 1), badge: 'hot', desc: 'Heavy premium pass shell for boss-lobby energy.', price: 1500, currency: 'coin' },
  ],
  pawns: [
    { id: 'p1', name: 'DRAGON SENTRY', sprite: sprite('token', 0, 0), badge: 'owned', desc: 'Legendary dragon pawn with a sharp plated silhouette.', price: 0, currency: 'free', owned: true },
    { id: 'p2', name: 'MECHA WARDEN', sprite: sprite('token', 1, 0), badge: 'new', desc: 'Chrome bot token tuned for futuristic squad rooms.', price: 1500, currency: 'coin' },
    { id: 'p3', name: 'SHOGUN CORE', sprite: sprite('token', 2, 0), badge: 'hot', desc: 'Samurai-styled pawn with bold ceremonial armor.', price: 80, currency: 'gem' },
    { id: 'p4', name: 'CRIMSON WYRM', sprite: sprite('token', 0, 1), desc: 'High-detail dragon variant for aggressive players.', price: 2200, currency: 'coin' },
    { id: 'p5', name: 'VOID PILOT', sprite: sprite('token', 1, 1), badge: 'sale', desc: 'Dark-tech avatar piece with a cinematic glow ring.', price: 50, currency: 'gem', sale: 70 },
    { id: 'p6', name: 'TEMPLE KING', sprite: sprite('token', 2, 1), desc: 'Royal pawn set with crown-grade gold highlights.', price: 100, currency: 'gem' },
    { id: 'p7', name: 'NOVA RIDER', sprite: sprite('token', 0, 2), desc: 'Fast silhouette built for flashy comeback matches.', price: 1750, currency: 'coin' },
    { id: 'p8', name: 'COBALT TITAN', sprite: sprite('token', 1, 2), desc: 'Armored heavy token with bold league-ladder presence.', price: 65, currency: 'gem' },
    { id: 'p9', name: 'PHANTOM ACE', sprite: sprite('token', 2, 2), badge: 'new', desc: 'Sleek elite pawn skin for high-rank grinders.', price: 2600, currency: 'coin' },
  ],
  powers: [
    { id: 'pw1', name: 'SPEED BOOST', emoji: '⚡', type: 'attack', badge: '', desc: 'Roll again on bonus squares. x3 uses.', price: 200, currency: 'coin' },
    { id: 'pw2', name: 'SAFE SHIELD', emoji: '🛡', type: 'defense', badge: 'hot', desc: 'Blocks one capture attempt. x2 uses.', price: 350, currency: 'coin' },
    { id: 'pw3', name: 'WARP GATE', emoji: '🌀', type: 'luck', badge: 'new', desc: 'Teleports a pawn to a random safe tile.', price: 15, currency: 'gem' },
    { id: 'pw4', name: 'PRECISION AIM', emoji: '🎯', type: 'attack', badge: '', desc: 'Choose your die result for one turn.', price: 25, currency: 'gem' },
    { id: 'pw5', name: 'LUCKY CLOVER', emoji: '🍀', type: 'luck', badge: '', desc: 'Increases six-roll odds for two turns.', price: 500, currency: 'coin' },
    { id: 'pw6', name: 'FORTRESS FIELD', emoji: '🧿', type: 'defense', badge: 'sale', desc: 'Creates a temporary safe ring around one pawn.', price: 20, currency: 'gem', sale: 30 },
  ],
};

const COIN_BUNDLES = [
  { icon: '🟡', amount: '1,000', bonus: 'STARTER PACK', price: '₹49', raw: 1000 },
  { icon: '💰', amount: '5,000', bonus: '+500 BONUS COINS', price: '₹199', raw: 5500, popular: true },
  { icon: '🏆', amount: '15,000', bonus: '+3,000 BONUS COINS', price: '₹499', raw: 18000 },
  { icon: '💎', amount: '50,000', bonus: '+15,000 BONUS COINS', price: '₹1,299', raw: 65000 },
];

const GEM_BUNDLES = [
  { icon: '💎', amount: '60', bonus: 'STARTER GEM', price: '₹79', raw: 60 },
  { icon: '🔷', amount: '300', bonus: '+30 BONUS DIAMONDS', price: '₹349', raw: 330, popular: true },
  { icon: '💠', amount: '1,000', bonus: '+200 BONUS DIAMONDS', price: '₹999', raw: 1200 },
  { icon: '🌊', amount: '3,000', bonus: '+1,000 BONUS DIAMONDS', price: '₹2,499', raw: 4000 },
];

const filterState = {
  dice: 'all',
  pawns: 'all',
  powers: 'all',
};

let coins = 24850;
let diamonds = 480;
let pendingBtn = null;
let currentModal = null;

document.addEventListener('DOMContentLoaded', () => {
  updateCurrencyUI();
  bindShopChrome();
  renderItems();

  document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
});

function bindShopChrome() {
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

function updateCurrencyUI() {
  document.getElementById('coin-count').textContent = coins.toLocaleString();
  document.getElementById('diamond-count').textContent = diamonds.toLocaleString();
}

function switchTab(id) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.section-page').forEach((p) => p.classList.remove('active'));
  document.querySelector(`[data-tab="${id}"]`).classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

function setFilter(el) {
  const row = el.closest('.filter-row');
  row.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
  el.classList.add('active');

  const section = el.closest('.section-page');
  if (!section) return;

  const cat = section.id.replace('tab-', '');
  filterState[cat] = el.textContent.trim().toLowerCase();
  renderCategory(cat);
  showToast(el.textContent.trim() + ' filter applied.');
}

function renderItems() {
  renderCategory('dice');
  renderCategory('pawns');
  renderCategory('powers');
  renderCurrency();
}

function badgeHTML(badge) {
  if (!badge) return '';
  const map = { owned: 'badge-owned', hot: 'badge-hot', new: 'badge-new', sale: 'badge-sale' };
  const labels = { owned: 'OWNED', hot: 'HOT', new: 'NEW', sale: 'SALE' };
  return `<div class="card-badge ${map[badge] || ''}">${labels[badge] || ''}</div>`;
}

function priceHTML(item) {
  if (item.currency === 'free') {
    return '<span class="price-tag free-price">FREE</span>';
  }
  const icon = item.currency === 'coin' ? '🟡' : '💎';
  const cls = item.currency === 'coin' ? 'gold-price' : 'diamond-price';
  const oldPrice = item.sale ? `<div class="old-price">${icon} ${item.sale}</div>` : '';
  return `<div>${oldPrice}<span class="price-tag ${cls}">${icon} ${item.price.toLocaleString()}</span></div>`;
}

function buyBtnHTML(item) {
  if (item.owned) return '<button class="buy-btn owned-state">EQUIPPED</button>';
  const cls = item.currency === 'coin' ? 'gold' : item.currency === 'gem' ? 'cyan' : '';
  const priceStr = item.currency === 'coin' ? `🟡 ${item.price.toLocaleString()} coins` : `💎 ${item.price} diamonds`;
  return `<button class="buy-btn ${cls}" onclick="confirmBuy('${item.id}', '${item.name.replace(/'/g, "\\'")}', '${item.currency}', '${priceStr}')">BUY</button>`;
}

function getFilteredItems(cat) {
  const active = filterState[cat];
  return ITEMS[cat].filter((item) => {
    if (active === 'all') return true;
    if (cat === 'powers') return item.type === active;
    if (active === 'coins') return item.currency === 'coin';
    if (active === 'gems') return item.currency === 'gem';
    return true;
  });
}

function buildSpriteStyle(data) {
  const sheet = SPRITES[data.sheet];
  const x = sheet.cols === 1 ? 0 : (data.col / (sheet.cols - 1)) * 100;
  const y = sheet.rows === 1 ? 0 : (data.row / (sheet.rows - 1)) * 100;
  return [
    `--sheet-url:url('${sheet.file}')`,
    `--sheet-size:${sheet.cols * 100}% ${sheet.rows * 100}%`,
    `--sheet-pos:${x}% ${y}%`,
  ].join(';');
}

function artHTML(item, large) {
  if (!item.sprite) {
    return `<span class="float-anim power-emoji ${large ? 'power-emoji-large' : ''}" style="font-size:${large ? 62 : 52}px">${item.emoji}</span>`;
  }
  const largeCls = large ? 'sheet-art-large' : '';
  return `<div class="sheet-art ${largeCls} ${item.sprite.glow}" style="${buildSpriteStyle(item.sprite)}"></div>`;
}

function renderCategory(cat) {
  const grid = document.getElementById('grid-' + cat);
  if (!grid) return;

  const bgCls = cat === 'dice' ? 'dice-bg' : cat === 'pawns' ? 'pawn-bg' : 'power-bg';
  const items = getFilteredItems(cat);

  grid.innerHTML = items.map((item) => `
    <div class="item-card ${item.owned ? 'owned' : ''} ${item.badge && item.badge !== 'owned' ? item.badge : ''}" id="card-${item.id}">
      ${badgeHTML(item.badge)}
      <div class="card-visual ${bgCls}">
        ${artHTML(item, false)}
      </div>
      <div class="card-info">
        <div class="card-name">${item.name}</div>
        <div class="card-desc">${item.desc}</div>
        <div class="card-price">
          ${priceHTML(item)}
          <div id="btn-${item.id}">${buyBtnHTML(item)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCurrency() {
  const coinGrid = document.getElementById('grid-coin-bundles');
  coinGrid.innerHTML = COIN_BUNDLES.map((bundle) => `
    <div class="bundle-card coin-bundle ${bundle.popular ? 'popular' : ''}" onclick="confirmBundle('${bundle.amount} Coins', '${bundle.icon}', '${bundle.price}', 'coin', ${bundle.raw})">
      ${bundle.popular ? '<div class="popular-tag">POPULAR</div>' : ''}
      <div class="bundle-icon">${bundle.icon}</div>
      <div class="bundle-amount gold-text">${bundle.amount}</div>
      <div class="bundle-bonus">${bundle.bonus}</div>
      <div class="real-price">${bundle.price}</div>
      <button class="bundle-buy gold-btn">BUY NOW</button>
    </div>
  `).join('');

  const gemGrid = document.getElementById('grid-gem-bundles');
  gemGrid.innerHTML = GEM_BUNDLES.map((bundle) => `
    <div class="bundle-card diamond-bundle ${bundle.popular ? 'popular' : ''}" onclick="confirmBundle('${bundle.amount} Diamonds', '${bundle.icon}', '${bundle.price}', 'gem', ${bundle.raw})">
      ${bundle.popular ? '<div class="popular-tag">POPULAR</div>' : ''}
      <div class="bundle-icon">${bundle.icon}</div>
      <div class="bundle-amount cyan-text">${bundle.amount}</div>
      <div class="bundle-bonus">${bundle.bonus}</div>
      <div class="real-price">${bundle.price}</div>
      <button class="bundle-buy cyan-btn">BUY NOW</button>
    </div>
  `).join('');
}

function confirmBuy(id, name, currency, priceStr) {
  const allItems = [...ITEMS.dice, ...ITEMS.pawns, ...ITEMS.powers];
  const item = allItems.find((entry) => entry.id === id);
  pendingBtn = { id, item };
  openModal(artHTML(item, true), name, `Add "${name}" to your collection?`, priceStr, 'purchase');
}

function confirmBundle(name, icon, price, type, raw) {
  pendingBtn = { bundle: true, type, raw };
  openModal(`<span class="bundle-modal-icon">${icon}</span>`, name, `Complete your purchase of ${name}?`, price, 'bundle');
}

function openModal(iconHTML, title, sub, price, mode) {
  document.getElementById('modal-icon').innerHTML = iconHTML;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-sub').textContent = sub;
  document.getElementById('modal-price').textContent = price;
  currentModal = mode;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  pendingBtn = null;
  currentModal = null;
}

function executePurchase() {
  if (!pendingBtn) return;

  const purchase = pendingBtn;
  closeModal();

  if (purchase.bundle) {
    if (purchase.type === 'coin') coins += purchase.raw;
    else diamonds += purchase.raw;
    updateCurrencyUI();
    showToast('Currency added to wallet.');
    return;
  }

  const found = [...ITEMS.dice, ...ITEMS.pawns, ...ITEMS.powers].find((item) => item.id === purchase.id);
  if (!found) return;

  found.owned = true;
  found.badge = 'owned';
  renderCategory(found.id.startsWith('d') ? 'dice' : found.id.startsWith('p') ? 'pawns' : 'powers');
  showToast(found.name + ' equipped.');
}

function openBuy(type) {
  switchTab('currency');
  setTimeout(() => {
    const el = document.querySelector(type === 'diamonds' ? '.diamond-bundle' : '.coin-bundle');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}
