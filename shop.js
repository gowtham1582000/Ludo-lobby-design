/* ══════════════════════════════════════════════════════
   DAYA PASS ARENA — SHOP JS
   Handles: open/close, tab switching, purchases, toast
══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const LS_WALLET = 'dpa_wallet_v1';
  const LS_OWNED = 'dpa_shop_owned_v1';
  const LS_EQUIP = 'dpa_equipped_v1';

  /* ─── State ─── */
  const state = {
    coins: 24850,
    gems:  480,
  };

  const ownedMap = loadOwned();

  /* ─── DOM Refs ─── */
  const shopToast    = document.getElementById('shopToast');
  const coinsDisplay = document.getElementById('shopCoins');
  const gemsDisplay  = document.getElementById('shopGems');

  /* ═══════════════════════════════
     TAB SWITCHING
  ═══════════════════════════════ */
  const tabs = document.querySelectorAll('.stab');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetId = 'tab-' + tab.dataset.tab;

      /* Deactivate all tabs */
      tabs.forEach(function (t) { t.classList.remove('stab-active'); });

      /* Hide all panels */
      document.querySelectorAll('.shop-panel').forEach(function (panel) {
        panel.classList.add('hidden');
      });

      /* Activate clicked tab and show its panel */
      tab.classList.add('stab-active');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.remove('hidden');
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

  attachCardListeners();

  /* ═══════════════════════════════
     INJECT CARD-SHAKE KEYFRAMES
  ═══════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes card-shake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-6px); }
      40%     { transform: translateX( 6px); }
      60%     { transform: translateX(-4px); }
      80%     { transform: translateX( 4px); }
    }
  `;
  document.head.appendChild(style);

  /* ═══════════════════════════════
     Pawn preview skins (token cosmetics)
     All token cards used to share the same pawn silhouette. We inject a small
     SVG symbol library and swap previews per item for variety.
  ═══════════════════════════════ */
  const PAWN_SET_BY_ITEM = {
    'Classic Rounds': 'pawn-classic',
    'Skull Tokens': 'pawn-skull',
    'Crown Tokens': 'pawn-crown',
    'Dragon Tokens': 'pawn-dragon',
    'Eagle Sentinels': 'pawn-eagle',
    'Gem Crystals': 'pawn-gem',
    'Robot Bots': 'pawn-robot',
    'Neon Rims': 'pawn-neon',
    'Samurai Masks': 'pawn-samurai',
    'Pixel Hearts': 'pawn-heart',
    'Star Comets': 'pawn-comet',
    'Phantom Flames': 'pawn-flame',
    'Jungle Leaves': 'pawn-leaf',
  };

  function upgradeTokenPreviews() {
    injectPawnDefs();
    document.querySelectorAll('.token-card .token-preview').forEach(function (prev) {
      const card = prev.closest('.token-card');
      if (!card) return;
      const name = card.dataset.item || '';
      const sym = PAWN_SET_BY_ITEM[name] || 'pawn-classic';
      prev.innerHTML = pawnPreviewHTML(sym);
    });
  }

  function pawnPreviewHTML(symbolId) {
    const id = String(symbolId || 'pawn-classic');
    return [
      pawnUse('pawn-red', id),
      pawnUse('pawn-blue', id),
      pawnUse('pawn-green', id),
      pawnUse('pawn-yellow', id),
    ].join('');
  }

  function pawnUse(colorClass, symbolId) {
    const id = String(symbolId);
    return (
      '<svg class="pawn ' + colorClass + '" viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
      '<use href="#' + id + '" xlink:href="#' + id + '"></use>' +
      '</svg>'
    );
  }

  function injectPawnDefs() {
    if (document.getElementById('pawnDefsV1')) return;
    const defs = [
      '<svg id="pawnDefsV1" width="0" height="0" style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true" focusable="false">',
      '<defs>',
      symbolPawn('pawn-classic', '', ''),
      symbolPawn('pawn-skull', skullAddon(), skullEmblem()),
      symbolPawn('pawn-crown', crownAddon(), crownEmblem()),
      symbolPawn('pawn-dragon', dragonAddon(), dragonEmblem()),
      symbolPawn('pawn-eagle', eagleAddon(), eagleEmblem()),
      symbolPawn('pawn-gem', gemAddon(), gemEmblem()),
      symbolPawn('pawn-robot', robotAddon(), robotEmblem()),
      symbolPawn('pawn-neon', neonAddon(), neonEmblem()),
      symbolPawn('pawn-samurai', samuraiAddon(), samuraiEmblem()),
      symbolPawn('pawn-heart', heartAddon(), heartEmblem()),
      symbolPawn('pawn-comet', cometAddon(), cometEmblem()),
      symbolPawn('pawn-flame', flameAddon(), flameEmblem()),
      symbolPawn('pawn-leaf', leafAddon(), leafEmblem()),
      '</defs></svg>',
    ].join('');
    document.body.insertAdjacentHTML('afterbegin', defs);
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
