const SPRITES = {
  daya: {
    file: 'daya-pass-design.jpeg',
    cols: 4,
    rows: 2,
    glow: 'cyan',
  },
  token: {
    file: 'token-design.jpeg',
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

  /* ═══════════════════════════════
     WALLET DISPLAY UPDATE
  ═══════════════════════════════ */
  function updateWallet() {
    coinsDisplay.textContent = state.coins.toLocaleString();
    gemsDisplay.textContent  = state.gems.toLocaleString();
    saveWallet();
  }

  hydrateFromStorage();
  updateWallet();
  upgradeTokenPreviews();
  upgradeTokenPriceIcons();

  /* ═══════════════════════════════
     TOAST NOTIFICATION
  ═══════════════════════════════ */
  let toastTimer = null;

  function showToast(message, isError) {
    shopToast.textContent = message;
    shopToast.classList.remove('show', 'toast-error');

    if (isError) shopToast.classList.add('toast-error');

    /* Force reflow so transition replays */
    void shopToast.offsetWidth;
    shopToast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      shopToast.classList.remove('show');
    }, 2600);
  }

  /* ═══════════════════════════════
     PURCHASE LOGIC
  ═══════════════════════════════ */
  function handlePurchase(card) {
    /* Already owned — no action */
    if (card.classList.contains('owned')) return;

    const itemName = card.dataset.item;
    const price    = parseFloat(card.dataset.price);
    const currency = card.dataset.currency;

    /* ── Check funds ── */
    if (currency === 'gem') {
      if (state.gems < price) {
        showToast('❌ Not enough Gems!', true);
        shakCard(card);
        return;
      }
      state.gems -= price;

    } else if (currency === 'coin') {
      if (state.coins < price) {
        showToast('❌ Not enough Coins!', true);
        shakCard(card);
        return;
      }
      state.coins -= price;

    } else if (currency === 'usd') {
      /* Real money — simulate a store redirect or confirmation */
      showToast('🔗 Redirecting to store…', false);
      return;
    }

    /* ── Deduct and mark owned ── */
    updateWallet();
    markOwned(card, itemName);
    rememberOwned(card, itemName);
    showToast('✓ ' + itemName + ' purchased!', false);
  }

  /* Visual shake on insufficient funds */
  function shakCard(el) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'card-shake 0.4s ease';
    el.addEventListener('animationend', function () {
      el.style.animation = '';
    }, { once: true });
  }

  /* Mark a card as owned after purchase */
  function markOwned(card, itemName) {
    card.classList.remove('buyable');
    card.classList.add('owned');
    card.style.cursor = 'default';

    /* Update the price / CTA element */
    const ctaEl = card.querySelector('.item-cta, .pu-price, .bundle-cta, .bundle-price');
    if (ctaEl) {
      /* Bundle CTA — update the action button text */
      if (ctaEl.classList.contains('bundle-cta')) {
        ctaEl.textContent = '✓ PURCHASED';
        ctaEl.style.background = 'rgba(0,255,135,0.12)';
        ctaEl.style.borderColor = 'rgba(0,255,135,0.3)';
        ctaEl.style.color       = 'var(--green-neon)';
      } else {
        /* Dice / token / power-up price pill */
        ctaEl.textContent = '✓ OWNED';
        ctaEl.className   = 'item-cta owned-tag';
      }
    }

    /* Add owned border glow */
    card.style.borderColor = 'rgba(0,255,135,0.35)';
    card.style.boxShadow   = '0 0 12px rgba(0,255,135,0.1)';
  }

  function inferType(card) {
    if (!card) return 'other';
    if (card.classList.contains('dice-item')) return 'dice';
    if (card.classList.contains('token-card')) return 'pawn';
    if (card.classList.contains('pu-card')) return 'powerup';
    if (card.classList.contains('bundle-card')) return 'bundle';
    return 'other';
  }

  function rememberOwned(card, itemName) {
    if (!itemName) return;
    ownedMap[itemName] = {
      type: inferType(card),
      ts: Date.now(),
    };
    saveOwned(ownedMap);

    // Auto-equip first purchased dice/pawn if nothing is equipped yet.
    if (ownedMap[itemName].type === 'dice' || ownedMap[itemName].type === 'pawn') {
      const equip = loadEquip();
      if (ownedMap[itemName].type === 'dice' && !equip.dice) equip.dice = itemName;
      if (ownedMap[itemName].type === 'pawn' && !equip.pawn) equip.pawn = itemName;
      saveEquip(equip);
    }
  }

  /* ═══════════════════════════════
     ATTACH CLICK HANDLERS
     (works for all buyable cards)
  ═══════════════════════════════ */
  function attachCardListeners() {
    /* Dice items */
    document.querySelectorAll('.dice-item.buyable').forEach(function (card) {
      card.addEventListener('click', function () { handlePurchase(card); });
    });

    /* Token cards */
    document.querySelectorAll('.token-card.buyable').forEach(function (card) {
      card.addEventListener('click', function () { handlePurchase(card); });
    });

    /* Power-up cards */
    document.querySelectorAll('.pu-card.buyable').forEach(function (card) {
      card.addEventListener('click', function () { handlePurchase(card); });
    });

    /* Bundle cards */
    document.querySelectorAll('.bundle-card.buyable').forEach(function (card) {
      card.addEventListener('click', function () { handlePurchase(card); });
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

  function injectUiIconDefs() {
    if (document.getElementById('uiIconsV1')) return;
    const s = [
      '<svg id="uiIconsV1" width="0" height="0" style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true" focusable="false">',
      '<defs>',
      // Coin (simple embossed disc)
      '<symbol id="ico-coin" viewBox="0 0 24 24">',
      '<circle cx="12" cy="12" r="8.6" fill="#FFD700" opacity="0.95"/>',
      '<circle cx="12" cy="12" r="7.4" fill="#FFC400" opacity="0.95"/>',
      '<path d="M8.7 10.2c2.9-2.8 6.7-2.8 8.6-.9" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linecap="round"/>',
      '<path d="M9.2 14.4c2.7 1.9 5.8 1.8 7.5.2" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1.6" stroke-linecap="round"/>',
      '</symbol>',
      // Gem (diamond)
      '<symbol id="ico-gem" viewBox="0 0 24 24">',
      '<path d="M7.5 8.3 12 4.6l4.5 3.7 2.2 3.2L12 20.2 5.3 11.5z" fill="#00F5FF" opacity="0.95"/>',
      '<path d="M7.5 8.3h9" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.4" stroke-linecap="round"/>',
      '<path d="M12 4.6 9.6 11.5 12 20.2l2.4-8.7z" fill="rgba(255,255,255,0.12)"/>',
      '</symbol>',
      '</defs></svg>',
    ].join('');
    document.body.insertAdjacentHTML('afterbegin', s);
  }

  function upgradeTokenPriceIcons() {
    injectUiIconDefs();
    const tab = document.getElementById('tab-tokens');
    if (!tab) return;

    tab.querySelectorAll('.item-cta').forEach(function (cta) {
      // Replace emoji spans with SVG icons for consistent rendering.
      if (cta.classList.contains('coin-price')) {
        replaceCtaIcon(cta, 'ico-coin');
      } else if (cta.classList.contains('gem-price')) {
        replaceCtaIcon(cta, 'ico-gem');
      }
    });
  }

  function replaceCtaIcon(cta, symbolId) {
    const span = cta.querySelector('span');
    if (!span) return;
    span.innerHTML = '<svg class="cta-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + symbolId + '" xlink:href="#' + symbolId + '"></use></svg>';
  }

  function pawnBody() {
    return [
      '<path fill="currentColor" d="M12 3.2c-2.1 0-3.8 1.7-3.8 3.8 0 1.5.9 2.9 2.2 3.5-1.5.8-2.5 2.4-2.5 4.2 0 1.2.4 2.3 1.2 3.2H6.4c-.5 0-.8.4-.8.8v.1c0 .4.3.8.8.8h11.2c.5 0 .8-.4.8-.8v-.1c0-.4-.3-.8-.8-.8h-2.7c.8-.9 1.2-2 1.2-3.2 0-1.8-1-3.4-2.5-4.2 1.3-.6 2.2-2 2.2-3.5 0-2.1-1.7-3.8-3.8-3.8z"/>',
      '<path fill="#fff" opacity="0.18" d="M9.6 6.4c.4-1.1 1.4-1.9 2.7-1.9 1 0 1.9.5 2.4 1.3.3.5.1 1.1-.4 1.4-.5.3-1.1.1-1.4-.4-.2-.3-.4-.4-.7-.4-.4 0-.7.2-.9.6-.2.5-.7.8-1.2.6-.5-.2-.8-.7-.6-1.2z"/>',
    ].join('');
  }

  function symbolPawn(id, addon, emblem) {
    return [
      '<symbol id="', id, '" viewBox="0 0 24 24">',
      addon || '',
      pawnBody(),
      emblem || '',
      '</symbol>',
    ].join('');
  }

  function eStroke(d) {
    return '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,0.62)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function eFill(d) {
    return '<path d="' + d + '" fill="rgba(0,0,0,0.30)"/>';
  }

  // Add-ons below are big silhouette changes so pawn sets look different even at small size.
  function skullAddon() {
    return [
      '<path fill="currentColor" d="M8.6 6.8 6.2 5.2 7.1 8.4z"/>',
      '<path fill="currentColor" d="M15.4 6.8 16.9 8.4 17.8 5.2z"/>',
    ].join('');
  }

  function crownAddon() {
    return [
      '<path fill="currentColor" d="M7.4 9.4 6.2 6.7 8.4 7.9 12 5.9 15.6 7.9 17.8 6.7 16.6 9.4 7.4 9.4z"/>',
    ].join('');
  }

  function dragonAddon() {
    return [
      '<path fill="currentColor" d="M8.8 6.7 6.6 5.4 7.4 8.0z"/>',
      '<path fill="currentColor" d="M15.2 6.7 16.6 8.0 17.4 5.4z"/>',
      '<path fill="currentColor" opacity="0.85" d="M12 8.2 10.8 9.8 12 10.4 13.2 9.8z"/>',
    ].join('');
  }

  function eagleAddon() {
    return [
      '<path fill="currentColor" d="M5.0 13.6 2.3 12.2 5.3 10.2 7.2 11.8z"/>',
      '<path fill="currentColor" d="M19.0 13.6 16.8 11.8 18.7 10.2 21.7 12.2z"/>',
    ].join('');
  }

  function gemAddon() {
    return '<path fill="currentColor" d="M12 2.8 15.2 5.2 12 7.6 8.8 5.2z"/>';
  }

  function robotAddon() {
    return [
      '<path fill="currentColor" d="M11.4 2.8h1.2v2.4h-1.2z"/>',
      '<path fill="currentColor" d="M10.2 5.0h3.6v2.1h-3.6z"/>',
    ].join('');
  }

  function neonAddon() {
    return '<path fill="currentColor" d="M12 4.6c3.0 0 5.4 1 5.4 2.2S15 9 12 9 6.6 8 6.6 6.8 9 4.6 12 4.6z"/>';
  }

  function samuraiAddon() {
    return [
      '<path fill="currentColor" d="M6.6 10.2 4.8 8.3 7.6 8.9z"/>',
      '<path fill="currentColor" d="M17.4 10.2 16.4 8.9 19.2 8.3z"/>',
      '<path fill="currentColor" d="M11.2 5.5h1.6l-.8 2.1z"/>',
    ].join('');
  }

  function heartAddon() {
    return '<path fill="currentColor" d="M12 9.0c-1.9-1.7-4.2-.4-4.2 1.4 0 1.6 1.4 2.8 4.2 4.2 2.8-1.4 4.2-2.6 4.2-4.2 0-1.8-2.3-3.1-4.2-1.4z"/>';
  }

  function cometAddon() {
    return [
      '<path fill="currentColor" d="M12 4.8l1.1 2.3 2.5.3-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.3z"/>',
      '<path fill="currentColor" opacity="0.8" d="M6.2 14.3c2.6-.6 4.7-1.7 6.3-3.6-.7 2.2-2.2 4.0-4.8 5.0z"/>',
    ].join('');
  }

  function flameAddon() {
    return '<path fill="currentColor" d="M12 4.8c1.7 2.2 2.8 3.6 2.8 5.2 0 1.7-1.3 3.0-2.8 3.4-1.5-.4-2.8-1.7-2.8-3.4 0-1.6 1.1-3 2.8-5.2z"/>';
  }

  function leafAddon() {
    return '<path fill="currentColor" d="M8.1 9.1c4.9-1.1 7.8-4 8.9-8.8-4.9 1.1-7.8 4-8.9 8.8z"/>';
  }

  function skullEmblem() {
    return [
      eFill('M9 10.5a3 3 0 0 1 6 0v1.1c0 .9-.4 1.6-1.1 2.1V15c0 .6-.4 1-1 1h-1v-1h-.8v1H10c-.6 0-1-.4-1-1v-1.3c-.7-.5-1.1-1.2-1.1-2.1v-1.1z'),
      eStroke('M10.6 11.8h.01'),
      eStroke('M13.4 11.8h.01'),
      eStroke('M11 14h2'),
    ].join('');
  }

  function crownEmblem() {
    return eFill('M8 13l1.6-4 2.4 2 2.4-2L16 13v2H8v-2z');
  }

  function dragonEmblem() {
    return [
      eStroke('M15.5 9.2c-2.1-2-6-.3-6 2.4 0 2.2 2.2 3.2 4.2 2.6-1 1.7-3.1 2.4-5 2.6'),
      eStroke('M15.6 9.1l1.3-1.1'),
    ].join('');
  }

  function gemEmblem() {
    return [
      eFill('M12 8l3.2 3.3L12 16.8 8.8 11.3 12 8z'),
      eStroke('M8.8 11.3h6.4'),
      eStroke('M12 8v8.8'),
    ].join('');
  }

  function eagleEmblem() {
    return [
      eStroke('M8.2 13.6c1.6-1.9 3-2.8 3.8-2.8s2.2.9 3.8 2.8'),
      eStroke('M7.4 12.4l1.7 1.4'),
      eStroke('M16.6 12.4l-1.7 1.4'),
      eStroke('M11.2 14.4l.8.8.8-.8'),
    ].join('');
  }

  function robotEmblem() {
    return [
      eStroke('M12 8.6v1.1'),
      eStroke('M9 10.2h6v5.1H9z'),
      eStroke('M10.7 12.3h.01'),
      eStroke('M13.3 12.3h.01'),
      eStroke('M10 15.3h4'),
    ].join('');
  }

  function neonEmblem() {
    return [
      '<circle cx="12" cy="12" r="3.4" fill="none" stroke="rgba(0,0,0,0.42)" stroke-width="1.8"/>',
      eStroke('M12 8.3v.01'),
      eStroke('M12 15.7v.01'),
    ].join('');
  }

  function samuraiEmblem() {
    return [
      eStroke('M9 10.4c0-1.3 6-1.3 6 0v2c0 1.7-1.3 3-3 3s-3-1.3-3-3v-2z'),
      eStroke('M9 10.4l-1.2-1.6'),
      eStroke('M15 10.4l1.2-1.6'),
    ].join('');
  }

  function heartEmblem() {
    return eFill('M12 16s-4-2.6-4-5a2.2 2.2 0 0 1 4-1 2.2 2.2 0 0 1 4 1c0 2.4-4 5-4 5z');
  }

  function cometEmblem() {
    return [
      eFill('M12 9l.9 1.9 2.1.3-1.5 1.5.3 2.1-1.8-1-1.8 1 .3-2.1-1.5-1.5 2.1-.3L12 9z'),
      eStroke('M6.5 15.3c2.3.4 4.1-.1 5.4-1.2'),
    ].join('');
  }

  function flameEmblem() {
    return eStroke('M12 8.3c1.8 2.3 2.8 3.6 2.8 5.2a2.8 2.8 0 0 1-5.6 0c0-1.6 1-2.9 2.8-5.2z');
  }

  function leafEmblem() {
    return [
      eStroke('M8 14c5-1 8-4 9-9-5 1-8 4-9 9z'),
      eStroke('M8 14c1 2 3 4 6 5'),
    ].join('');
  }

  /* ═══════════════════════════════
     localStorage persistence
  ═══════════════════════════════ */
  function safeParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }

  function loadWallet() {
    const parsed = safeParse(localStorage.getItem(LS_WALLET), null);
    if (!parsed || typeof parsed !== 'object') return;
    if (typeof parsed.coins === 'number') state.coins = parsed.coins;
    if (typeof parsed.gems === 'number') state.gems = parsed.gems;
  }

  function saveWallet() {
    try { localStorage.setItem(LS_WALLET, JSON.stringify({ coins: state.coins, gems: state.gems })); } catch { /* ignore */ }
  }

  function loadOwned() {
    const parsed = safeParse(localStorage.getItem(LS_OWNED), null);
    if (!parsed || typeof parsed !== 'object') return Object.create(null);
    const items = parsed.items && typeof parsed.items === 'object' ? parsed.items : parsed;
    const out = Object.create(null);
    Object.keys(items || {}).forEach(function (k) {
      const v = items[k];
      if (!k) return;
      out[String(k)] = {
        type: v && typeof v.type === 'string' ? v.type : 'other',
        ts: v && typeof v.ts === 'number' ? v.ts : Date.now(),
      };
    });
    return out;
  }

  function saveOwned(map) {
    try { localStorage.setItem(LS_OWNED, JSON.stringify({ v: 1, items: map })); } catch { /* ignore */ }
  }

  function loadEquip() {
    const parsed = safeParse(localStorage.getItem(LS_EQUIP), null);
    if (!parsed || typeof parsed !== 'object') return { dice: '', pawn: '' };
    return {
      dice: typeof parsed.dice === 'string' ? parsed.dice : '',
      pawn: typeof parsed.pawn === 'string' ? parsed.pawn : '',
    };
  }

  function saveEquip(equip) {
    try { localStorage.setItem(LS_EQUIP, JSON.stringify({ dice: String(equip.dice || ''), pawn: String(equip.pawn || '') })); } catch { /* ignore */ }
  }

  function hydrateFromStorage() {
    loadWallet();

    // Seed ownedMap with any items that are shipped as owned in the HTML.
    let seeded = false;
    document.querySelectorAll('.dice-item.owned, .token-card.owned, .pu-card.owned, .bundle-card.owned').forEach(function (card) {
      const name = card.dataset.item;
      if (!name) return;
      if (!ownedMap[name]) {
        ownedMap[name] = { type: inferType(card), ts: Date.now() };
        seeded = true;
      }
    });
    if (seeded) saveOwned(ownedMap);

    // Apply stored ownership to the UI before listeners bind.
    document.querySelectorAll('.dice-item, .token-card, .pu-card, .bundle-card').forEach(function (card) {
      const name = card.dataset.item;
      if (!name) return;
      if (ownedMap[name]) markOwned(card, name);
    });
  }

})();
