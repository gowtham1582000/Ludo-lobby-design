(function () {
  'use strict';

  const LS_KEY = 'dpa_notifications_v1';

  const listEl = document.getElementById('notifList');
  const toastEl = document.getElementById('notifToast');
  const clearBtn = document.getElementById('notifClear');
  const markAllBtn = document.getElementById('markAllRead');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const unreadBadge = document.getElementById('unreadBadge');

  const ICONS = {
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    friends: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 8v6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M23 11h-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v10H4V12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7h20v5H2z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 21h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 17v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 6h3v2a4 4 0 0 1-4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 6H4v2a4 4 0 0 0 4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6 5 3H2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor"/><path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor"/></svg>',
  };

  const ICON_COLORS = {
    bell: '#FF9500',
    friends: '#00F5FF',
    gift: '#FFD700',
    trophy: '#A855F7',
    cart: '#FF6B00',
  };

  const LEGACY_ICON_MAP = (function () {
    const m = Object.create(null);
    m[String.fromCodePoint(0x1F514)] = 'bell';
    m[String.fromCodePoint(0x1F465)] = 'friends';
    m[String.fromCodePoint(0x1F381)] = 'gift';
    m[String.fromCodePoint(0x1F3C6)] = 'trophy';
    m[String.fromCodePoint(0x1F6D2)] = 'cart';
    return m;
  })();

  let activeTab = 'all';
  let items = load();

  if (!items.length) {
    items = seed();
    save(items);
  }

  render();

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      activeTab = t.dataset.tab || 'all';
      tabs.forEach(x => x.classList.toggle('active', x === t));
      render();
    });
  });

  markAllBtn.addEventListener('click', function () {
    items = items.map(n => ({ ...n, read: true }));
    save(items);
    render();
    toast('Marked all as read', false);
  });

  clearBtn.addEventListener('click', function () {
    items = [];
    save(items);
    render();
    toast('Cleared', false);
  });

  listEl.addEventListener('click', function (e) {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = card.getAttribute('data-id');
    const idx = items.findIndex(x => x.id === id);
    if (idx === -1) return;
    items[idx].read = true;
    save(items);
    render();
  });

  function render() {
    const unread = items.filter(x => !x.read).length;
    if (unread > 0) {
      unreadBadge.hidden = false;
      unreadBadge.textContent = String(unread);
    } else {
      unreadBadge.hidden = true;
      unreadBadge.textContent = '';
    }

    const filtered = items.filter(function (n) {
      if (activeTab === 'unread') return !n.read;
      return true;
    });

    listEl.innerHTML = '';
    if (!filtered.length) {
      listEl.appendChild(empty());
      return;
    }

    filtered.forEach(function (n) {
      listEl.appendChild(card(n));
    });
  }

  function card(n) {
    const el = document.createElement('div');
    el.className = 'ncard';
    el.setAttribute('data-id', n.id);
    if (!n.read) {
      const dot = document.createElement('div');
      dot.className = 'unread-dot';
      el.appendChild(dot);
    }

    const icon = document.createElement('div');
    icon.className = 'nicon';
    const kind = (n.icon && ICONS[n.icon]) ? n.icon : 'bell';
    icon.innerHTML = ICONS[kind];
    icon.style.color = ICON_COLORS[kind] || '#FF9500';

    const body = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'ntitle';
    title.textContent = n.title;

    const msg = document.createElement('div');
    msg.className = 'nmsg';
    msg.textContent = n.message;

    const time = document.createElement('div');
    time.className = 'ntime';
    time.textContent = timeAgo(n.ts);

    body.appendChild(title);
    body.appendChild(msg);
    body.appendChild(time);

    el.appendChild(icon);
    el.appendChild(body);
    return el;
  }

  function empty() {
    const el = document.createElement('div');
    el.className = 'empty';
    el.innerHTML = [
      '<div class="empty-ico">INBOX</div>',
      '<div class="empty-title">No notifications</div>',
      '<div class="empty-sub">You are all caught up.</div>',
    ].join('');
    return el;
  }

  function seed() {
    const now = Date.now();
    return [
      { id: 'n1', icon: 'friends', title: 'Friend Request', message: 'Zoya#1190 sent you a friend request.', ts: now - 12 * 60 * 1000, read: false },
      { id: 'n2', icon: 'gift', title: 'Daily Reward', message: 'Your daily reward is ready to claim.', ts: now - 2 * 60 * 60 * 1000, read: false },
      { id: 'n3', icon: 'trophy', title: 'Tournament', message: 'Tournament starts in 1 hour. Join early for bonus XP.', ts: now - 8 * 60 * 60 * 1000, read: true },
      { id: 'n4', icon: 'cart', title: 'Shop Deal', message: 'Limited deal: 20% off selected dice skins.', ts: now - 26 * 60 * 60 * 1000, read: true },
    ];
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.map(function (x) {
        const iconRaw = String(x.icon || 'bell');
        const icon = LEGACY_ICON_MAP[iconRaw] || iconRaw;
        return {
          id: String(x.id || Math.random().toString(16).slice(2)),
          icon,
          title: String(x.title || 'Notification'),
          message: String(x.message || ''),
          ts: typeof x.ts === 'number' ? x.ts : Date.now(),
          read: Boolean(x.read),
        };
      });
    } catch {
      return [];
    }
  }

  function save(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch { /* ignore */ }
  }

  function timeAgo(ts) {
    const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (s < 60) return s + 's ago';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    return d + 'd ago';
  }

  let tmr = null;
  function toast(msg, isErr) {
    toastEl.textContent = msg;
    toastEl.classList.remove('show', 'error');
    if (isErr) toastEl.classList.add('error');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(tmr);
    tmr = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
})();
