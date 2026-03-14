/* Friends page: demo social system with friend requests + account directory (localStorage). */
(function () {
  'use strict';

  const LS_FRIENDS = 'dpa_friends_v1';
  const LS_PLAYERS = 'dpa_players_v1';
  const LS_REQ_IN = 'dpa_friend_requests_in_v1';
  const LS_REQ_OUT = 'dpa_friend_requests_out_v1';
  const ME = { name: 'You', tag: '0001' };

  const addInput = document.getElementById('addFriendInput');
  const addBtn = document.getElementById('addFriendBtn');
  const searchEl = document.getElementById('friendSearch');

  const friendsWrap = document.getElementById('friendsWrap');
  const requestsWrap = document.getElementById('requestsWrap');

  const listEl = document.getElementById('friendsList');
  const requestsEl = document.getElementById('requestsList');

  const playerResultsWrap = document.getElementById('playerResultsWrap');
  const playerResultsEl = document.getElementById('playerResults');
  const playerResultsSub = document.getElementById('playerResultsSub');

  const totalEl = document.getElementById('friendsTotal');
  const onlineEl = document.getElementById('friendsOnline');
  const refreshBtn = document.getElementById('friendsRefresh');
  const toastEl = document.getElementById('friendsToast');
  const reqBadgeEl = document.getElementById('reqBadge');
  const filtersWrap = document.getElementById('friendsFilters');

  const viewBtns = Array.from(document.querySelectorAll('.view-chip'));
  const filterBtns = Array.from(document.querySelectorAll('.filter-chip'));

  let activeView = 'friends';
  let activeFilter = 'all';

  let players = loadPlayers();
  let friends = loadFriends();
  let reqIn = loadRequests(LS_REQ_IN);
  let reqOut = loadRequests(LS_REQ_OUT);

  if (!players.length) {
    players = seedPlayers();
    saveJson(LS_PLAYERS, players);
  }

  if (!friends.length) {
    friends = seedFriendsFromPlayers(players);
    saveJson(LS_FRIENDS, friends);
  }

  if (!reqIn.length && !reqOut.length) {
    reqIn = seedIncomingRequests(players, friends);
    saveJson(LS_REQ_IN, reqIn);
  }

  wireEvents();
  render();

  function wireEvents() {
    addBtn.addEventListener('click', onSendRequestFromInput);
    addInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') onSendRequestFromInput();
    });

    searchEl.addEventListener('input', render);

    refreshBtn.addEventListener('click', function () {
      randomizeOnline();
      maybeGenerateIncoming();
      persistAll();
      render();
      showToast('Updated', false);
    });

    viewBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeView = btn.dataset.view || 'friends';
        viewBtns.forEach(b => b.classList.toggle('active', b === btn));
        render();
      });
    });

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.dataset.filter || 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b === btn));
        render();
      });
    });

    document.addEventListener('click', function (e) {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const action = target.getAttribute('data-action');
      if (!action) return;

      const tag = target.getAttribute('data-tag') || '';
      if (!tag) return;

      if (action === 'match') return onMatch(tag);
      if (action === 'remove') return onRemoveFriend(tag);
      if (action === 'request') return onSendRequest(tag);
      if (action === 'cancel') return onCancelRequest(tag);
      if (action === 'accept') return onAccept(tag);
      if (action === 'reject') return onReject(tag);
    });
  }

  function render() {
    syncBadge();

    const query = normalize(searchEl.value || '');
    const onlineCount = friends.reduce((n, f) => n + (f.online ? 1 : 0), 0);
    totalEl.textContent = String(friends.length);
    onlineEl.textContent = String(onlineCount);

    const showFriends = activeView === 'friends';
    friendsWrap.classList.toggle('hidden', !showFriends);
    requestsWrap.classList.toggle('hidden', showFriends);
    if (filtersWrap) filtersWrap.classList.toggle('hidden', !showFriends);

    filterBtns.forEach(function (b) {
      b.disabled = !showFriends;
      b.style.opacity = showFriends ? '' : '0.5';
    });

    if (showFriends) {
      renderFriendsList(query);
      renderPlayerResults(query);
    } else {
      playerResultsWrap.classList.add('hidden');
      renderRequestsList(query);
    }
  }

  function renderFriendsList(query) {
    const filtered = friends.filter(function (f) {
      if (activeFilter === 'online' && !f.online) return false;
      if (!query) return true;
      return normalize(f.name).includes(query) || normalize(f.tag).includes(query);
    });

    listEl.innerHTML = '';

    if (!filtered.length) {
      listEl.appendChild(renderEmpty('🛰️', 'No friends found', 'Search players to send requests, or change your filter.'));
      return;
    }

    filtered.forEach(function (f) {
      listEl.appendChild(renderFriendRow(f));
    });
  }

  function renderPlayerResults(query) {
    const q = String(query || '').trim();
    const hasQuery = q.length >= 2 || /^\d{3,6}$/.test(q) || /^#\d{3,6}$/.test(q);

    if (!hasQuery) {
      playerResultsWrap.classList.add('hidden');
      playerResultsEl.innerHTML = '';
      playerResultsSub.textContent = 'Type to find players with accounts';
      return;
    }

    const matches = findPlayers(q).slice(0, 6).filter(p => p.tag !== ME.tag);
    playerResultsWrap.classList.remove('hidden');
    playerResultsEl.innerHTML = '';

    if (!matches.length) {
      playerResultsSub.textContent = 'No in-game account found for "' + q + '"';
      playerResultsEl.appendChild(renderMiniEmpty('No players found'));
      return;
    }

    playerResultsSub.textContent = 'Tap REQUEST to send a friend request';
    matches.forEach(function (p) {
      playerResultsEl.appendChild(renderPlayerRow(p));
    });
  }

  function renderRequestsList(query) {
    const q = normalize(query || '');

    const inFiltered = reqIn.filter(function (r) {
      if (!q) return true;
      return normalize(r.fromName).includes(q) || normalize(r.fromTag).includes(q);
    });

    const outFiltered = reqOut.filter(function (r) {
      if (!q) return true;
      return normalize(r.toName).includes(q) || normalize(r.toTag).includes(q);
    });

    requestsEl.innerHTML = '';

    requestsEl.appendChild(renderSectionHead('Incoming Requests', inFiltered.length));
    if (!inFiltered.length) {
      requestsEl.appendChild(renderInlineEmpty('No incoming requests'));
    } else {
      inFiltered.forEach(function (r) {
        requestsEl.appendChild(renderRequestRow({ name: r.fromName, tag: r.fromTag }, 'incoming'));
      });
    }

    requestsEl.appendChild(renderSectionHead('Sent Requests', outFiltered.length));
    if (!outFiltered.length) {
      requestsEl.appendChild(renderInlineEmpty('No sent requests'));
    } else {
      outFiltered.forEach(function (r) {
        requestsEl.appendChild(renderRequestRow({ name: r.toName, tag: r.toTag }, 'sent'));
      });
    }
  }

  function onSendRequestFromInput() {
    const raw = (addInput.value || '').trim();
    if (!raw) return;

    const parsed = parsePlayerInput(raw);
    if (!parsed) {
      showToast('Enter a valid name or tag', true);
      return;
    }

    const p = resolvePlayer(parsed);
    if (!p) {
      showToast('Player not found (no account)', true);
      return;
    }

    addInput.value = '';
    onSendRequest(p.tag);
  }

  function onSendRequest(tag) {
    if (tag === ME.tag) {
      showToast('Cannot request yourself', true);
      return;
    }

    const p = players.find(x => x.tag === tag);
    if (!p) {
      showToast('Player not found (no account)', true);
      return;
    }

    if (friends.some(f => f.tag === tag)) {
      showToast('Already friends', true);
      return;
    }

    if (reqOut.some(r => r.toTag === tag)) {
      showToast('Request already sent', true);
      return;
    }

    if (reqIn.some(r => r.fromTag === tag)) {
      showToast('Request already received (accept it)', false);
      setView('requests');
      return;
    }

    reqOut.unshift({
      id: cryptoSafeId(),
      fromName: ME.name,
      fromTag: ME.tag,
      toName: p.name,
      toTag: p.tag,
      ts: Date.now(),
    });

    persistAll();
    render();
    showToast('Request sent to ' + p.name, false);
  }

  function onCancelRequest(tag) {
    const idx = reqOut.findIndex(r => r.toTag === tag);
    if (idx === -1) return;
    const r = reqOut[idx];
    reqOut.splice(idx, 1);
    persistAll();
    render();
    showToast('Cancelled request to ' + r.toName, false);
  }

  function onAccept(tag) {
    const idx = reqIn.findIndex(r => r.fromTag === tag);
    if (idx === -1) return;
    const r = reqIn[idx];
    reqIn.splice(idx, 1);

    if (!friends.some(f => f.tag === tag)) {
      friends.unshift({
        id: 'f_' + tag,
        name: r.fromName,
        tag: r.fromTag,
        online: true,
        lastSeen: Date.now(),
      });
    }

    persistAll();
    render();
    showToast('Added ' + r.fromName, false);
  }

  function onReject(tag) {
    const idx = reqIn.findIndex(r => r.fromTag === tag);
    if (idx === -1) return;
    const r = reqIn[idx];
    reqIn.splice(idx, 1);
    persistAll();
    render();
    showToast('Rejected ' + r.fromName, false);
  }

  function onMatch(tag) {
    const f = friends.find(x => x.tag === tag);
    if (!f || !f.online) return;
    showToast('Invite sent to ' + f.name, false);
  }

  function onRemoveFriend(tag) {
    const idx = friends.findIndex(f => f.tag === tag);
    if (idx === -1) return;
    const removed = friends[idx];
    friends.splice(idx, 1);
    persistAll();
    render();
    showToast('Removed ' + removed.name, false);
  }

  function setView(v) {
    activeView = v;
    viewBtns.forEach(function (b) {
      b.classList.toggle('active', (b.dataset.view || '') === v);
    });
    render();
  }

  function syncBadge() {
    const n = reqIn.length;
    if (n > 0) {
      reqBadgeEl.hidden = false;
      reqBadgeEl.textContent = String(n);
    } else {
      reqBadgeEl.hidden = true;
      reqBadgeEl.textContent = '';
    }
  }

  function persistAll() {
    saveJson(LS_FRIENDS, friends);
    saveJson(LS_REQ_IN, reqIn);
    saveJson(LS_REQ_OUT, reqOut);
  }

  function randomizeOnline() {
    const now = Date.now();
    friends = friends.map(function (f) {
      const nextOnline = Math.random() > 0.55;
      return { ...f, online: nextOnline, lastSeen: nextOnline ? f.lastSeen : (f.online ? now : f.lastSeen) };
    });
  }

  function maybeGenerateIncoming() {
    if (Math.random() > 0.33) return;

    const candidates = players.filter(function (p) {
      if (p.tag === ME.tag) return false;
      if (friends.some(f => f.tag === p.tag)) return false;
      if (reqIn.some(r => r.fromTag === p.tag)) return false;
      if (reqOut.some(r => r.toTag === p.tag)) return false;
      return true;
    });

    if (!candidates.length) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    reqIn.unshift({
      id: cryptoSafeId(),
      fromName: pick.name,
      fromTag: pick.tag,
      toName: ME.name,
      toTag: ME.tag,
      ts: Date.now(),
    });
  }

  function resolvePlayer(parsed) {
    if (parsed.tag) {
      const t = parsed.tag.replace(/^#/, '');
      return players.find(p => p.tag === t) || null;
    }
    const n = normalize(parsed.name);
    return players.find(p => normalize(p.name) === n) || null;
  }

  function findPlayers(qRaw) {
    const q = normalize(qRaw).replace(/^#/, '');
    const digits = q.replace(/[^\d]/g, '');
    return players.filter(function (p) {
      if (digits && digits.length >= 3 && String(p.tag).includes(digits)) return true;
      return normalize(p.name).includes(q) || normalize(p.tag).includes(q);
    });
  }

  function renderFriendRow(f) {
    const row = document.createElement('div');
    row.className = 'friend-row';
    row.setAttribute('data-id', f.tag);

    const av = document.createElement('div');
    av.className = 'av';
    av.textContent = initials(f.name);

    const meta = document.createElement('div');
    meta.className = 'meta';

    const nameRow = document.createElement('div');
    nameRow.className = 'name-row';

    const name = document.createElement('div');
    name.className = 'fname';
    name.textContent = f.name;

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = '#' + String(f.tag).replace(/^#/, '');

    nameRow.appendChild(name);
    nameRow.appendChild(tag);

    const statusRow = document.createElement('div');
    statusRow.className = 'status-row';

    const dot = document.createElement('span');
    dot.className = 'dot' + (f.online ? ' online' : '');

    const status = document.createElement('span');
    status.textContent = f.online ? 'Online now' : ('Last seen ' + timeAgo(f.lastSeen));

    statusRow.appendChild(dot);
    statusRow.appendChild(status);

    meta.appendChild(nameRow);
    meta.appendChild(statusRow);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const matchBtn = document.createElement('button');
    matchBtn.className = 'act match';
    matchBtn.type = 'button';
    matchBtn.setAttribute('data-action', 'match');
    matchBtn.setAttribute('data-tag', f.tag);
    matchBtn.textContent = 'MATCH-UP';
    if (!f.online) matchBtn.disabled = true;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'act remove';
    removeBtn.type = 'button';
    removeBtn.setAttribute('data-action', 'remove');
    removeBtn.setAttribute('data-tag', f.tag);
    removeBtn.textContent = 'REMOVE';

    actions.appendChild(matchBtn);
    actions.appendChild(removeBtn);

    row.appendChild(av);
    row.appendChild(meta);
    row.appendChild(actions);

    return row;
  }

  function renderPlayerRow(p) {
    const row = document.createElement('div');
    row.className = 'mini-row';

    const av = document.createElement('div');
    av.className = 'av';
    av.textContent = initials(p.name);

    const meta = document.createElement('div');
    meta.className = 'meta';

    const nameRow = document.createElement('div');
    nameRow.className = 'name-row';

    const name = document.createElement('div');
    name.className = 'fname';
    name.textContent = p.name;

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = '#' + p.tag;

    nameRow.appendChild(name);
    nameRow.appendChild(tag);

    const statusRow = document.createElement('div');
    statusRow.className = 'status-row';
    const status = document.createElement('span');
    status.textContent = 'Account found';
    statusRow.appendChild(status);

    meta.appendChild(nameRow);
    meta.appendChild(statusRow);

    const actions = document.createElement('div');
    actions.className = 'mini-actions';

    if (friends.some(f => f.tag === p.tag)) {
      actions.appendChild(renderStateBtn('FRIENDS'));
    } else if (reqIn.some(r => r.fromTag === p.tag)) {
      actions.appendChild(renderActionBtn('ACCEPT', 'accept', p.tag));
      actions.appendChild(renderActionBtn('REJECT', 'reject', p.tag));
    } else if (reqOut.some(r => r.toTag === p.tag)) {
      actions.appendChild(renderStateBtn('SENT'));
      actions.appendChild(renderActionBtn('CANCEL', 'cancel', p.tag));
    } else {
      actions.appendChild(renderActionBtn('REQUEST', 'request', p.tag, 'request'));
    }

    row.appendChild(av);
    row.appendChild(meta);
    row.appendChild(actions);
    return row;
  }

  function renderRequestRow(p, kind) {
    const row = document.createElement('div');
    row.className = 'mini-row';

    const av = document.createElement('div');
    av.className = 'av';
    av.textContent = initials(p.name);

    const meta = document.createElement('div');
    meta.className = 'meta';

    const nameRow = document.createElement('div');
    nameRow.className = 'name-row';

    const name = document.createElement('div');
    name.className = 'fname';
    name.textContent = p.name;

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = '#' + p.tag;

    nameRow.appendChild(name);
    nameRow.appendChild(tag);

    const statusRow = document.createElement('div');
    statusRow.className = 'status-row';
    const status = document.createElement('span');
    status.textContent = kind === 'incoming' ? 'Wants to be friends' : 'Pending approval';
    statusRow.appendChild(status);

    meta.appendChild(nameRow);
    meta.appendChild(statusRow);

    const actions = document.createElement('div');
    actions.className = 'mini-actions';

    if (kind === 'incoming') {
      actions.appendChild(renderActionBtn('ACCEPT', 'accept', p.tag));
      actions.appendChild(renderActionBtn('REJECT', 'reject', p.tag));
    } else {
      actions.appendChild(renderStateBtn('SENT'));
      actions.appendChild(renderActionBtn('CANCEL', 'cancel', p.tag));
    }

    row.appendChild(av);
    row.appendChild(meta);
    row.appendChild(actions);
    return row;
  }

  function renderActionBtn(label, action, tag, cls) {
    const b = document.createElement('button');
    b.className = 'act ' + (cls || action);
    b.type = 'button';
    b.setAttribute('data-action', action);
    b.setAttribute('data-tag', tag);
    b.textContent = label;
    return b;
  }

  function renderStateBtn(label) {
    const b = document.createElement('button');
    b.className = 'act state';
    b.type = 'button';
    b.disabled = true;
    b.textContent = label;
    return b;
  }

  function renderSectionHead(title, count) {
    const head = document.createElement('div');
    head.className = 'section-head';

    const t = document.createElement('div');
    t.className = 'section-title';
    t.textContent = title;

    const c = document.createElement('div');
    c.className = 'section-count';
    c.textContent = String(count);

    head.appendChild(t);
    head.appendChild(c);
    return head;
  }

  function renderInlineEmpty(text) {
    const d = document.createElement('div');
    d.className = 'empty';
    d.style.padding = '10px 14px 18px';
    d.innerHTML = '<div class="empty-sub">' + escapeHtml(text) + '</div>';
    return d;
  }

  function renderMiniEmpty(text) {
    const d = document.createElement('div');
    d.className = 'empty';
    d.style.padding = '10px 14px';
    d.innerHTML = '<div class="empty-sub">' + escapeHtml(text) + '</div>';
    return d;
  }

  function renderEmpty(ico, title, sub) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.innerHTML = [
      '<div class="empty-ico">' + escapeHtml(ico) + '</div>',
      '<div class="empty-title">' + escapeHtml(title) + '</div>',
      '<div class="empty-sub">' + escapeHtml(sub) + '</div>',
    ].join('');
    return empty;
  }

  function loadFriends() {
    const arr = loadJsonArray(LS_FRIENDS);
    return arr.map(function (x) {
      return {
        id: String(x.id || ('f_' + String(x.tag || makeTag()))),
        name: String(x.name || 'Player'),
        tag: String(x.tag || makeTag()).replace(/^#/, ''),
        online: Boolean(x.online),
        lastSeen: typeof x.lastSeen === 'number' ? x.lastSeen : Date.now(),
      };
    });
  }

  function loadPlayers() {
    const arr = loadJsonArray(LS_PLAYERS);
    return arr
      .filter(x => x && typeof x === 'object')
      .map(function (x) {
        return { name: String(x.name || 'Player').slice(0, 18), tag: String(x.tag || makeTag()).replace(/^#/, '') };
      });
  }

  function loadRequests(key) {
    const arr = loadJsonArray(key);
    return arr
      .filter(x => x && typeof x === 'object')
      .map(function (x) {
        return {
          id: String(x.id || cryptoSafeId()),
          fromName: String(x.fromName || 'Player'),
          fromTag: String(x.fromTag || '').replace(/^#/, ''),
          toName: String(x.toName || 'Player'),
          toTag: String(x.toTag || '').replace(/^#/, ''),
          ts: typeof x.ts === 'number' ? x.ts : Date.now(),
        };
      })
      .filter(r => r.fromTag && r.toTag);
  }

  function seedPlayers() {
    return [
      { name: ME.name, tag: ME.tag },
      { name: 'Riya', tag: '1042' },
      { name: 'Vikram', tag: '7719' },
      { name: 'Neha', tag: '8820' },
      { name: 'Arjun', tag: '2301' },
      { name: 'Sana', tag: '6127' },
      { name: 'Rahul', tag: '4408' },
      { name: 'Ishaan', tag: '9055' },
      { name: 'Meera', tag: '3184' },
      { name: 'Kiran', tag: '5261' },
      { name: 'Aanya', tag: '7902' },
      { name: 'Zoya', tag: '1190' },
      { name: 'Dev', tag: '6631' },
      { name: 'Ananya', tag: '2450' },
      { name: 'Kabir', tag: '9088' },
      { name: 'Fatima', tag: '3017' },
      { name: 'Siddharth', tag: '5570' },
      { name: 'Priya', tag: '7722' },
    ];
  }

  function seedFriendsFromPlayers(pl) {
    const baseTags = ['1042', '8820', '6127', '9055', '7902'];
    const now = Date.now();
    return baseTags
      .map(t => pl.find(p => p.tag === t))
      .filter(Boolean)
      .map(function (p, i) {
        const online = i % 2 === 0;
        return { id: 'seed_' + String(i), name: p.name, tag: p.tag, online, lastSeen: online ? now : (now - (i + 2) * 60 * 60 * 1000) };
      });
  }

  function seedIncomingRequests(pl, fr) {
    const taken = new Set(fr.map(x => x.tag));
    const candidates = pl.filter(p => p.tag !== ME.tag && !taken.has(p.tag));
    const a = candidates.find(p => p.tag === '1190') || candidates[0];
    const b = candidates.find(p => p.tag === '6631') || candidates[1];
    const now = Date.now();
    return [a, b].filter(Boolean).map(function (p, i) {
      return { id: 'req_seed_' + String(i), fromName: p.name, fromTag: p.tag, toName: ME.name, toTag: ME.tag, ts: now - (i + 1) * 15 * 60 * 1000 };
    });
  }

  function parsePlayerInput(raw) {
    const s = String(raw || '').trim();
    if (!s) return null;

    const tagOnly = s.match(/^#?\s*(\d{3,6})\s*$/);
    if (tagOnly) return { name: '', tag: tagOnly[1] };

    const nameTag = s.match(/^(.+?)\s*#\s*(\d{3,6})\s*$/);
    if (nameTag) return { name: String(nameTag[1]).trim().slice(0, 18), tag: String(nameTag[2]).trim() };

    return { name: s.slice(0, 18), tag: '' };
  }

  function loadJsonArray(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  function normalize(s) {
    return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0] ? parts[0][0] : 'P';
    const b = parts.length > 1 ? parts[1][0] : '';
    return (a + b).toUpperCase();
  }

  function timeAgo(ts) {
    const t = typeof ts === 'number' ? ts : Date.now();
    const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
    if (s < 60) return s + 's ago';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    return d + 'd ago';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c;
    });
  }

  let toastTimer = null;
  function showToast(message, isError) {
    toastEl.textContent = message;
    toastEl.classList.remove('show', 'error');
    if (isError) toastEl.classList.add('error');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  function makeTag() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  function cryptoSafeId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'id_' + Math.random().toString(16).slice(2) + '_' + Date.now();
  }
})();
