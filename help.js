(function () {
  'use strict';

  const searchEl = document.getElementById('helpSearch');
  const clearBtn = document.getElementById('clearSearch');
  const expandToggle = document.getElementById('expandToggle');
  const noResultsEl = document.getElementById('noResults');
  const toastEl = document.getElementById('helpToast');

  const contentEl = document.querySelector('.content');
  const sections = Array.from(document.querySelectorAll('[data-section]'));
  const items = Array.from(document.querySelectorAll('[data-item]'));

  contentEl.addEventListener('click', function (e) {
    const head = e.target.closest('.acc-head');
    if (!head) return;
    const item = head.closest('.acc-item');
    if (!item) return;
    setOpen(item, !item.classList.contains('open'));
  });

  document.querySelectorAll('[data-jump]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.getAttribute('data-jump');
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      flash(target);
    });
  });

  clearBtn.addEventListener('click', function () {
    searchEl.value = '';
    applyFilter('');
    toast('Cleared search', false);
    searchEl.focus();
  });

  searchEl.addEventListener('input', function () {
    applyFilter(searchEl.value);
  });

  expandToggle.addEventListener('click', function () {
    const visible = items.filter(isVisible);
    if (!visible.length) return;
    const allOpen = visible.every(x => x.classList.contains('open'));
    visible.forEach(x => setOpen(x, !allOpen));
    toast(allOpen ? 'Collapsed all' : 'Expanded all', false);
  });

  // Default: open the first item to make the page feel alive.
  const first = items[0];
  if (first) setOpen(first, true);

  function setOpen(item, open) {
    item.classList.toggle('open', open);
    const head = item.querySelector('.acc-head');
    if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function isVisible(el) {
    return el && el.style.display !== 'none';
  }

  function applyFilter(qRaw) {
    const q = String(qRaw || '').trim().toLowerCase();
    let any = false;

    items.forEach(function (item) {
      const text = item.innerText.toLowerCase();
      const hit = !q || text.includes(q);
      item.style.display = hit ? '' : 'none';
      if (hit) any = true;
    });

    sections.forEach(function (sec) {
      const visibleCount = Array.from(sec.querySelectorAll('[data-item]')).filter(isVisible).length;
      sec.style.display = visibleCount ? '' : 'none';
    });

    noResultsEl.hidden = any;
  }

  function flash(el) {
    el.style.transition = 'box-shadow 0.25s, filter 0.25s';
    el.style.filter = 'brightness(1.2)';
    el.style.boxShadow = '0 0 0 1px rgba(0,245,255,0.18), 0 0 30px rgba(0,245,255,0.08)';
    setTimeout(function () {
      el.style.filter = '';
      el.style.boxShadow = '';
    }, 500);
  }

  let tmr = null;
  function toast(msg, isErr) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove('show', 'error');
    if (isErr) toastEl.classList.add('error');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(tmr);
    tmr = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }
})();

