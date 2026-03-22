(function () {
  'use strict';

  const LS_OWNED = 'dpa_shop_owned_v1';
  const LS_EQUIP = 'dpa_equipped_v1';
  const LS_FAV = 'dpa_favorites_v1';

  const gridEl = document.getElementById('invGrid');
  const emptyEl = document.getElementById('invEmpty');
  const toastEl = document.getElementById('invToast');

  const eqDicePrev = document.getElementById('eqDicePrev');
  const eqDiceName = document.getElementById('eqDiceName');
  const eqPawnPrev = document.getElementById('eqPawnPrev');
  const eqPawnName = document.getElementById('eqPawnName');
  const copyBtn = document.getElementById('copyLoadout');

  const searchEl = document.getElementById('invSearch');
  const filterBtns = Array.from(document.querySelectorAll('[data-filter]'));
  const sortBtns = Array.from(document.querySelectorAll('[data-sort]'));

  const DICE = {
    'Classic Dice': { type: 'dice', dp: 'dp-classic', face: 6, title: 'Classic', sub: 'Standard white cube' },
    'Neon Surge Dice': { type: 'dice', dp: 'dp-neon', face: 5, title: 'Neon Surge', sub: 'Electric cyan glow' },
    'Inferno Dice': { type: 'dice', dp: 'dp-fire', face: 3, title: 'Inferno', sub: 'Volcanic lava skin' },
    'Crystal Frost Dice': { type: 'dice', dp: 'dp-ice', face: 4, title: 'Crystal Frost', sub: 'Ice kingdom edition' },
    'Royal Gold Dice': { type: 'dice', dp: 'dp-gold', face: 2, title: 'Royal Gold', sub: 'Luxury gold finish' },
    'Cosmic Void Dice': { type: 'dice', dp: 'dp-cosmic', face: 1, title: 'Cosmic Void', sub: 'Stellar nebula core' },
    'Emerald Pulse Dice': { type: 'dice', dp: 'dp-emerald', face: 6, title: 'Emerald Pulse', sub: 'Green neon energy' },
    'Shadow Hex Dice': { type: 'dice', dp: 'dp-shadow', face: 5, title: 'Shadow Hex', sub: 'Dark cursed aura' },
    'Sakura Bloom Dice': { type: 'dice', dp: 'dp-sakura', face: 2, title: 'Sakura Bloom', sub: 'Pink blossom glow' },
    'Sunrise Ember Dice': { type: 'dice', dp: 'dp-sunrise', face: 4, title: 'Sunrise Ember', sub: 'Warm ember gradient' },
    'Chrome Core Dice': { type: 'dice', dp: 'dp-neon', face: 3, title: 'Chrome Core', sub: 'Polished futuristic edge' },
    'Arctic Prism Dice': { type: 'dice', dp: 'dp-ice', face: 1, title: 'Arctic Prism', sub: 'Crystal blue shine' },
  };

  const PAWNS = {
    'Classic Rounds': { type: 'pawn', title: 'Classic Rounds', sub: 'Standard disc tokens' },
    'Skull Tokens': { type: 'pawn', title: 'Skull Set', sub: 'Gothic dark style' },
    'Crown Tokens': { type: 'pawn', title: 'Crown Set', sub: 'For champions only' },
    'Dragon Tokens': { type: 'pawn', title: 'Dragon Set', sub: 'Mythic fire beasts' },
    'Eagle Sentinels': { type: 'pawn', title: 'Eagle Sentinels', sub: 'Sky guardian crest' },
    'Gem Crystals': { type: 'pawn', title: 'Gem Crystals', sub: 'Shimmering facets' },
    'Robot Bots': { type: 'pawn', title: 'Robot Bots', sub: 'Cyber mechanical set' },
    'Neon Rims': { type: 'pawn', title: 'Neon Rims', sub: 'Bright edge lighting' },
    'Samurai Masks': { type: 'pawn', title: 'Samurai Masks', sub: 'Warrior spirit set' },
    'Pixel Hearts': { type: 'pawn', title: 'Pixel Hearts', sub: 'Retro arcade vibe' },
    'Star Comets': { type: 'pawn', title: 'Star Comets', sub: 'Streaking light trails' },
    'Phantom Flames': { type: 'pawn', title: 'Phantom Flames', sub: 'Haunted ember trails' },
    'Jungle Leaves': { type: 'pawn', title: 'Jungle Leaves', sub: 'Fresh wild camo' },
  };

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

  const state = {
    filter: 'all',
    sort: 'recent',
    q: '',
  };

  let owned = loadOwned();
  let equip = loadEquip();
  let favs = loadFavs();

  injectPawnDefs();

  const allItems = normalizeOwned(owned);
  ensureEquipValid();
  render();

  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      state.filter = b.dataset.filter || 'all';
      filterBtns.forEach(x => x.classList.toggle('active', x === b));
      render();
    });
  });

  sortBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      state.sort = b.dataset.sort || 'recent';
      sortBtns.forEach(x => x.classList.toggle('active', x === b));
      render();
    });
  });

  searchEl.addEventListener('input', function () {
    state.q = String(searchEl.value || '');
    render();
  });

  gridEl.addEventListener('click', function (e) {
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      const name = favBtn.getAttribute('data-fav');
      toggleFav(name);
      render();
      return;
    }

    const eqBtn = e.target.closest('[data-equip]');
    if (eqBtn) {
      const raw = eqBtn.getAttribute('data-equip') || '';
      const parts = raw.split('|');
      const type = parts[0] || '';
      const name = parts.slice(1).join('|');
      if (!name) return;
      if (type === 'dice') equip.dice = name;
      if (type === 'pawn') equip.pawn = name;
      saveEquip(equip);
      render();
      toast('Equipped: ' + name, false);
    }
  });

  copyBtn.addEventListener('click', function () {
    const text = 'Loadout: Dice=' + (equip.dice || 'None') + ', Pawns=' + (equip.pawn || 'None');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast('Copied loadout', false);
      }).catch(function () {
        toast(text, false);
      });
    } else {
      toast(text, false);
    }
  });

  function normalizeOwned(map) {
    const out = [];
    Object.keys(map).forEach(function (name) {
      const rec = map[name] || {};
      const meta = DICE[name] || PAWNS[name] || {};
      const type = meta.type || String(rec.type || 'other');
      out.push({
        name,
        type,
        ts: typeof rec.ts === 'number' ? rec.ts : Date.now(),
        title: meta.title || name,
        sub: meta.sub || '',
        dp: meta.dp || '',
        face: meta.face || 1,
      });
    });
    return out;
  }

  function ensureEquipValid() {
    const ownedNames = new Set(allItems.map(x => x.name));
    if (equip.dice && !ownedNames.has(equip.dice)) equip.dice = '';
    if (equip.pawn && !ownedNames.has(equip.pawn)) equip.pawn = '';

    if (!equip.dice) {
      const firstDice = allItems.find(x => x.type === 'dice');
      if (firstDice) equip.dice = firstDice.name;
    }
    if (!equip.pawn) {
      const firstPawn = allItems.find(x => x.type === 'pawn');
      if (firstPawn) equip.pawn = firstPawn.name;
    }
    saveEquip(equip);
  }

  function render() {
    emptyEl.hidden = allItems.length > 0;

    renderLoadout();

    const q = state.q.trim().toLowerCase();
    let list = allItems.slice();

    if (state.filter === 'dice') list = list.filter(x => x.type === 'dice');
    if (state.filter === 'pawn') list = list.filter(x => x.type === 'pawn');
    if (state.filter === 'other') list = list.filter(x => x.type !== 'dice' && x.type !== 'pawn');
    if (state.filter === 'fav') list = list.filter(x => favs.has(x.name));

    if (q) {
      list = list.filter(function (x) {
        return (x.name || '').toLowerCase().includes(q) ||
          (x.title || '').toLowerCase().includes(q) ||
          (x.sub || '').toLowerCase().includes(q);
      });
    }

    if (state.sort === 'az') {
      list.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
    } else {
      list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    }

    // Favorites float to top if not in "Recent" mode.
    list.sort(function (a, b) {
      const af = favs.has(a.name) ? 1 : 0;
      const bf = favs.has(b.name) ? 1 : 0;
      return bf - af;
    });

    gridEl.innerHTML = '';
    list.forEach(function (x) {
      gridEl.appendChild(cardEl(x));
    });
  }

  function renderLoadout() {
    const dice = allItems.find(x => x.name === equip.dice);
    const pawn = allItems.find(x => x.name === equip.pawn);

    eqDicePrev.innerHTML = '';
    eqPawnPrev.innerHTML = '';

    if (dice && dice.type === 'dice') {
      eqDicePrev.appendChild(makeDicePreview(dice.dp, dice.face));
      eqDiceName.textContent = dice.title || dice.name;
    } else {
      eqDiceName.textContent = 'None';
    }

    if (pawn && pawn.type === 'pawn') {
      eqPawnPrev.appendChild(makePawnPreview(pawn.name));
      eqPawnName.textContent = pawn.title || pawn.name;
    } else {
      eqPawnName.textContent = 'None';
    }
  }

  function cardEl(x) {
    const card = document.createElement('div');
    card.className = 'card';

    if ((x.type === 'dice' && equip.dice === x.name) || (x.type === 'pawn' && equip.pawn === x.name)) {
      card.classList.add('equipped');
    }

    const fav = document.createElement('button');
    fav.className = 'fav-btn' + (favs.has(x.name) ? ' on' : '');
    fav.type = 'button';
    fav.textContent = favs.has(x.name) ? '\u2605' : '\u2606';
    fav.setAttribute('data-fav', x.name);
    fav.setAttribute('aria-label', 'Favorite');
    card.appendChild(fav);

    if (x.type === 'dice') {
      const prev = document.createElement('div');
      prev.className = 'dice-preview ' + (x.dp || 'dp-classic');
      prev.appendChild(makeDiceCube(x.face || 1));
      card.appendChild(prev);
    } else if (x.type === 'pawn') {
      card.appendChild(makePawnPreview(x.name));
    } else {
      const prev = document.createElement('div');
      prev.className = 'dice-preview dp-shadow';
      prev.appendChild(makeDiceCube(1));
      card.appendChild(prev);
    }

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = x.title || x.name;
    card.appendChild(name);

    const sub = document.createElement('div');
    sub.className = 'subtxt';
    sub.textContent = x.sub || '';
    card.appendChild(sub);

    const meta = document.createElement('div');
    meta.className = 'meta';

    const tag = document.createElement('div');
    tag.className = 'tag ' + (x.type === 'dice' ? 'dice' : (x.type === 'pawn' ? 'pawn' : 'other'));
    tag.textContent = (x.type || 'other').toUpperCase();
    meta.appendChild(tag);

    const equipBtn = document.createElement('button');
    equipBtn.className = 'equip-btn';
    equipBtn.type = 'button';
    if (x.type === 'dice') {
      const on = equip.dice === x.name;
      if (on) equipBtn.classList.add('on');
      equipBtn.textContent = on ? 'EQUIPPED' : 'EQUIP';
      equipBtn.setAttribute('data-equip', 'dice|' + x.name);
    } else if (x.type === 'pawn') {
      const on = equip.pawn === x.name;
      if (on) equipBtn.classList.add('on');
      equipBtn.textContent = on ? 'EQUIPPED' : 'EQUIP';
      equipBtn.setAttribute('data-equip', 'pawn|' + x.name);
    } else {
      equipBtn.textContent = 'OWNED';
      equipBtn.disabled = true;
    }
    meta.appendChild(equipBtn);

    card.appendChild(meta);
    return card;
  }

  function makeDicePreview(dp, face) {
    const wrap = document.createElement('div');
    wrap.className = 'dice-preview ' + (dp || 'dp-classic');
    wrap.appendChild(makeDiceCube(face || 1));
    return wrap;
  }

  function makeDiceCube(face) {
    const cube = document.createElement('div');
    cube.className = 'dice-cube';
    cube.setAttribute('data-face', String(face || 1));
    ['tl', 'tr', 'ml', 'mm', 'mr', 'bl', 'br'].forEach(function (cls) {
      const p = document.createElement('span');
      p.className = 'pip ' + cls;
      cube.appendChild(p);
    });
    return cube;
  }

  function makePawnPreview(itemName) {
    const wrap = document.createElement('div');
    wrap.className = 'token-preview';
    const sym = PAWN_SET_BY_ITEM[String(itemName || '')] || 'pawn-classic';
    wrap.innerHTML = [
      pawnUse('pawn-red', sym),
      pawnUse('pawn-blue', sym),
      pawnUse('pawn-green', sym),
      pawnUse('pawn-yellow', sym),
    ].join('');
    return wrap;
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

  function skullAddon() { return '<path fill="currentColor" d="M8.6 6.8 6.2 5.2 7.1 8.4z"/><path fill="currentColor" d="M15.4 6.8 16.9 8.4 17.8 5.2z"/>'; }
  function crownAddon() { return '<path fill="currentColor" d="M7.4 9.4 6.2 6.7 8.4 7.9 12 5.9 15.6 7.9 17.8 6.7 16.6 9.4 7.4 9.4z"/>'; }
  function dragonAddon() { return '<path fill="currentColor" d="M8.8 6.7 6.6 5.4 7.4 8.0z"/><path fill="currentColor" d="M15.2 6.7 16.6 8.0 17.4 5.4z"/><path fill="currentColor" opacity="0.85" d="M12 8.2 10.8 9.8 12 10.4 13.2 9.8z"/>'; }
  function eagleAddon() { return '<path fill="currentColor" d="M5.0 13.6 2.3 12.2 5.3 10.2 7.2 11.8z"/><path fill="currentColor" d="M19.0 13.6 16.8 11.8 18.7 10.2 21.7 12.2z"/>'; }
  function gemAddon() { return '<path fill="currentColor" d="M12 2.8 15.2 5.2 12 7.6 8.8 5.2z"/>'; }
  function robotAddon() { return '<path fill="currentColor" d="M11.4 2.8h1.2v2.4h-1.2z"/><path fill="currentColor" d="M10.2 5.0h3.6v2.1h-3.6z"/>'; }
  function neonAddon() { return '<path fill="currentColor" d="M12 4.6c3.0 0 5.4 1 5.4 2.2S15 9 12 9 6.6 8 6.6 6.8 9 4.6 12 4.6z"/>'; }
  function samuraiAddon() { return '<path fill="currentColor" d="M6.6 10.2 4.8 8.3 7.6 8.9z"/><path fill="currentColor" d="M17.4 10.2 16.4 8.9 19.2 8.3z"/><path fill="currentColor" d="M11.2 5.5h1.6l-.8 2.1z"/>'; }
  function heartAddon() { return '<path fill="currentColor" d="M12 9.0c-1.9-1.7-4.2-.4-4.2 1.4 0 1.6 1.4 2.8 4.2 4.2 2.8-1.4 4.2-2.6 4.2-4.2 0-1.8-2.3-3.1-4.2-1.4z"/>'; }
  function cometAddon() { return '<path fill="currentColor" d="M12 4.8l1.1 2.3 2.5.3-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.3z"/><path fill="currentColor" opacity="0.8" d="M6.2 14.3c2.6-.6 4.7-1.7 6.3-3.6-.7 2.2-2.2 4.0-4.8 5.0z"/>'; }
  function flameAddon() { return '<path fill="currentColor" d="M12 4.8c1.7 2.2 2.8 3.6 2.8 5.2 0 1.7-1.3 3.0-2.8 3.4-1.5-.4-2.8-1.7-2.8-3.4 0-1.6 1.1-3 2.8-5.2z"/>'; }
  function leafAddon() { return '<path fill="currentColor" d="M8.1 9.1c4.9-1.1 7.8-4 8.9-8.8-4.9 1.1-7.8 4-8.9 8.8z"/>'; }

  function skullEmblem() {
    return [
      eFill('M9 10.5a3 3 0 0 1 6 0v1.1c0 .9-.4 1.6-1.1 2.1V15c0 .6-.4 1-1 1h-1v-1h-.8v1H10c-.6 0-1-.4-1-1v-1.3c-.7-.5-1.1-1.2-1.1-2.1v-1.1z'),
      eStroke('M10.6 11.8h.01'),
      eStroke('M13.4 11.8h.01'),
      eStroke('M11 14h2'),
    ].join('');
  }

  function crownEmblem() { return eFill('M8 13l1.6-4 2.4 2 2.4-2L16 13v2H8v-2z'); }
  function dragonEmblem() { return eStroke('M15.5 9.2c-2.1-2-6-.3-6 2.4 0 2.2 2.2 3.2 4.2 2.6-1 1.7-3.1 2.4-5 2.6') + eStroke('M15.6 9.1l1.3-1.1'); }
  function eagleEmblem() { return eStroke('M8.2 13.6c1.6-1.9 3-2.8 3.8-2.8s2.2.9 3.8 2.8') + eStroke('M7.4 12.4l1.7 1.4') + eStroke('M16.6 12.4l-1.7 1.4') + eStroke('M11.2 14.4l.8.8.8-.8'); }
  function gemEmblem() { return eFill('M12 8l3.2 3.3L12 16.8 8.8 11.3 12 8z') + eStroke('M8.8 11.3h6.4') + eStroke('M12 8v8.8'); }
  function robotEmblem() { return eStroke('M12 8.6v1.1') + eStroke('M9 10.2h6v5.1H9z') + eStroke('M10.7 12.3h.01') + eStroke('M13.3 12.3h.01') + eStroke('M10 15.3h4'); }
  function neonEmblem() { return '<circle cx="12" cy="12" r="3.4" fill="none" stroke="rgba(0,0,0,0.42)" stroke-width="1.8"/>' + eStroke('M12 8.3v.01') + eStroke('M12 15.7v.01'); }
  function samuraiEmblem() { return eStroke('M9 10.4c0-1.3 6-1.3 6 0v2c0 1.7-1.3 3-3 3s-3-1.3-3-3v-2z') + eStroke('M9 10.4l-1.2-1.6') + eStroke('M15 10.4l1.2-1.6'); }
  function heartEmblem() { return eFill('M12 16s-4-2.6-4-5a2.2 2.2 0 0 1 4-1 2.2 2.2 0 0 1 4 1c0 2.4-4 5-4 5z'); }
  function cometEmblem() { return eFill('M12 9l.9 1.9 2.1.3-1.5 1.5.3 2.1-1.8-1-1.8 1 .3-2.1-1.5-1.5 2.1-.3L12 9z') + eStroke('M6.5 15.3c2.3.4 4.1-.1 5.4-1.2'); }
  function flameEmblem() { return eStroke('M12 8.3c1.8 2.3 2.8 3.6 2.8 5.2a2.8 2.8 0 0 1-5.6 0c0-1.6 1-2.9 2.8-5.2z'); }
  function leafEmblem() { return eStroke('M8 14c5-1 8-4 9-9-5 1-8 4-9 9z') + eStroke('M8 14c1 2 3 4 6 5'); }

  function toggleFav(name) {
    if (!name) return;
    if (favs.has(name)) favs.delete(name); else favs.add(name);
    saveFavs(favs);
  }

  function safeParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }

  function loadOwned() {
    const parsed = safeParse(localStorage.getItem(LS_OWNED), null);
    if (!parsed || typeof parsed !== 'object') return Object.create(null);
    const items = parsed.items && typeof parsed.items === 'object' ? parsed.items : parsed;
    const out = Object.create(null);
    Object.keys(items || {}).forEach(function (k) {
      const v = items[k];
      out[String(k)] = {
        type: v && typeof v.type === 'string' ? v.type : 'other',
        ts: v && typeof v.ts === 'number' ? v.ts : Date.now(),
      };
    });
    return out;
  }

  function loadEquip() {
    const parsed = safeParse(localStorage.getItem(LS_EQUIP), null);
    if (!parsed || typeof parsed !== 'object') return { dice: '', pawn: '' };
    return {
      dice: typeof parsed.dice === 'string' ? parsed.dice : '',
      pawn: typeof parsed.pawn === 'string' ? parsed.pawn : '',
    };
  }

  function saveEquip(e) {
    try { localStorage.setItem(LS_EQUIP, JSON.stringify({ dice: String(e.dice || ''), pawn: String(e.pawn || '') })); } catch { /* ignore */ }
  }

  function loadFavs() {
    const parsed = safeParse(localStorage.getItem(LS_FAV), []);
    const set = new Set();
    if (Array.isArray(parsed)) parsed.forEach(x => set.add(String(x)));
    return set;
  }

  function saveFavs(set) {
    try { localStorage.setItem(LS_FAV, JSON.stringify(Array.from(set))); } catch { /* ignore */ }
  }

  let tmr = null;
  function toast(msg, isErr) {
    toastEl.textContent = msg;
    toastEl.classList.remove('show', 'error');
    if (isErr) toastEl.classList.add('error');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(tmr);
    tmr = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }
})();
