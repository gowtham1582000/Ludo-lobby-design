/* ============================================================
   notifications.js — Daya Pass Arena · Notifications Page
   ============================================================ */

/* ── STATE ── */
let unreadCount = document.querySelectorAll('.notif-card.unread').length;

/* ── UNREAD PILL ── */

/**
 * Update the unread count pill in the top bar.
 */
function updatePill() {
  const pill = document.getElementById('unreadPill');
  if (!pill) return;
  unreadCount = document.querySelectorAll('.notif-card.unread').length;
  if (unreadCount > 0) {
    pill.textContent = `${unreadCount} NEW`;
    pill.style.display = 'inline-block';
  } else {
    pill.style.display = 'none';
  }
}

/* ── MARK SINGLE CARD AS READ ── */

/**
 * Mark a single notification card as read when clicked.
 * Removes the unread class, dot, and left-edge accent.
 * @param {HTMLElement} card - The .notif-card element
 */
function readNotif(card) {
  if (!card.classList.contains('unread')) return;

  card.classList.add('reading');

  setTimeout(() => {
    card.classList.remove('unread', 'reading');
    updatePill();
  }, 280);
}

/* ── MARK ALL AS READ ── */

/**
 * Mark every visible unread notification as read with a staggered animation.
 */
function markAllRead() {
  const unreadCards = document.querySelectorAll('.notif-card.unread:not([style*="display: none"])');
  if (unreadCards.length === 0) return;

  unreadCards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('reading');
      setTimeout(() => {
        card.classList.remove('unread', 'reading');
        updatePill();
      }, 280);
    }, i * 60);
  });
}

/* ── CLEAR ALL ── */

/**
 * Remove all visible notification cards with a staggered slide-out animation,
 * then show the empty state.
 */
function clearAll() {
  const activeFilter = document.querySelector('.filter-tab.active');
  const filterType   = activeFilter ? activeFilter.dataset.filter : 'all';

  let cards;
  if (filterType === 'all') {
    cards = document.querySelectorAll('.notif-card');
  } else {
    cards = document.querySelectorAll(`.notif-card[data-type="${filterType}"]`);
  }

  if (cards.length === 0) return;

  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.transition = 'opacity 0.25s, transform 0.25s, max-height 0.35s 0.15s, margin 0.35s 0.15s, padding 0.35s 0.15s';
      card.style.opacity    = '0';
      card.style.transform  = 'translateX(20px)';

      setTimeout(() => {
        card.style.maxHeight = '0';
        card.style.marginBottom = '0';
        card.style.paddingTop = '0';
        card.style.paddingBottom = '0';
        card.style.overflow = 'hidden';

        setTimeout(() => {
          card.remove();
          updatePill();
          checkEmptyGroups();
          checkGlobalEmpty(filterType);
        }, 380);
      }, 260);
    }, i * 50);
  });
}

/* ── HIDE EMPTY DAY GROUPS ── */

/**
 * Remove day-group containers that have no remaining notification cards.
 */
function checkEmptyGroups() {
  document.querySelectorAll('.day-group').forEach(group => {
    const remaining = group.querySelectorAll('.notif-card');
    if (remaining.length === 0) {
      group.style.transition = 'opacity 0.2s';
      group.style.opacity = '0';
      setTimeout(() => group.remove(), 200);
    }
  });
}

/* ── EMPTY STATE ── */

/**
 * Show the empty state panel if no cards match the current filter.
 * @param {string} filterType - Current active filter ('all' or a type key)
 */
function checkGlobalEmpty(filterType) {
  const emptyState = document.getElementById('emptyState');
  if (!emptyState) return;

  let remaining;
  if (filterType === 'all') {
    remaining = document.querySelectorAll('.notif-card');
  } else {
    remaining = document.querySelectorAll(`.notif-card[data-type="${filterType}"]`);
  }

  if (remaining.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }
}

/* ── FILTER TABS ── */

/**
 * Filter notifications by type when a tab is clicked.
 * Shows only cards matching the selected type (or all).
 * @param {HTMLElement} tab        - The clicked .filter-tab element
 * @param {string}      filterType - 'all' or a data-type value
 */
function filterNotifs(tab, filterType) {
  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  const allCards  = document.querySelectorAll('.notif-card');
  const allGroups = document.querySelectorAll('.day-group');

  // Show/hide cards
  allCards.forEach(card => {
    if (filterType === 'all' || card.dataset.type === filterType) {
      showCard(card);
    } else {
      hideCard(card);
    }
  });

  // Show/hide empty day groups
  allGroups.forEach(group => {
    const visibleInGroup = [...group.querySelectorAll('.notif-card')].filter(c => {
      return filterType === 'all' || c.dataset.type === filterType;
    });
    group.style.display = visibleInGroup.length > 0 ? '' : 'none';
  });

  // Check empty state
  checkGlobalEmpty(filterType);
}

/**
 * Animate a card into view.
 * @param {HTMLElement} card
 */
function showCard(card) {
  card.style.display    = '';
  card.style.opacity    = '';
  card.style.transform  = '';
  card.style.maxHeight  = '';
  card.style.margin     = '';
  card.style.padding    = '';
}

/**
 * Hide a card without removing it from the DOM.
 * @param {HTMLElement} card
 */
function hideCard(card) {
  card.style.display = 'none';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  updatePill();
});
