(function () {
  const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const root = document.querySelector('.phone') || document.body;
  if (!root) return;

  const routeGroups = {
    home: ['index.html'],
    friends: ['friends.html'],
    trophies: ['trophies.html'],
    items: ['items.html'],
    profile: ['profile.html']
  };

  const activeKey = Object.keys(routeGroups).find((key) => routeGroups[key].includes(page)) || null;

  const navItems = [
    { key: 'friends', label: 'Friends', icon: '&#128101;', href: 'friends.html' },
    { key: 'trophies', label: 'Trophies', icon: '&#127942;', href: 'trophies.html' },
    { key: 'home', label: 'Home', icon: '&#8962;', href: 'index.html' },
    { key: 'items', label: 'Items', icon: '&#127890;', href: 'items.html' },
    { key: 'profile', label: 'Profile', icon: '&#128100;', href: 'profile.html' }
  ];

  const styleId = 'global-bottom-nav-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      body.has-global-nav { overflow-x: hidden; }
      .has-global-nav .shell { padding-bottom: 112px !important; }
      .has-global-nav #clip { margin-bottom: 86px; }
      .has-global-nav .back-home { display: none !important; }
      .global-bottom-nav {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 60;
        padding: 10px 12px 14px;
        background: linear-gradient(180deg, rgba(8, 12, 20, 0.08), rgba(8, 12, 20, 0.96));
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(16px);
      }
      body > .global-bottom-nav.global-fixed {
        position: fixed;
        left: 50%;
        right: auto;
        width: min(390px, 100vw);
        transform: translateX(-50%);
      }
      .global-nav-row {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
        align-items: end;
      }
      .global-nav-btn {
        min-width: 0;
        min-height: 60px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.045);
        color: #e8f0ff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        transition: transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease;
        font: inherit;
      }
      .global-nav-btn:hover {
        transform: translateY(-2px);
        border-color: rgba(0, 229, 160, 0.28);
        box-shadow: 0 12px 28px rgba(0, 229, 160, 0.12);
      }
      .global-nav-btn:active { transform: scale(0.96); }
      .global-nav-btn.active {
        color: #00e5a0;
        border-color: rgba(0, 229, 160, 0.34);
        background: linear-gradient(180deg, rgba(0, 229, 160, 0.08), rgba(255, 255, 255, 0.03));
        box-shadow: 0 8px 18px rgba(0, 229, 160, 0.1);
      }
      .global-nav-ico {
        width: 28px;
        height: 28px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.04);
        font-size: 16px;
        line-height: 1;
      }
      .global-nav-btn.active .global-nav-ico {
        background: rgba(0, 229, 160, 0.12);
      }
      .global-nav-lbl {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .global-nav-btn.active::after {
        content: '';
        position: relative;
        display: block;
        width: 18px;
        height: 2px;
        margin-top: 2px;
        border-radius: 999px;
        background: currentColor;
        opacity: 0.9;
      }
      .global-nav-btn[data-href="index.html"] .global-nav-ico {
        background: linear-gradient(180deg, rgba(255, 184, 0, 0.1), rgba(255, 255, 255, 0.03));
        border: 1px solid rgba(255, 184, 0, 0.18);
      }
      .global-nav-btn[data-href="index.html"].active .global-nav-ico {
        background: linear-gradient(180deg, rgba(255, 184, 0, 0.18), rgba(0, 229, 160, 0.1));
        border-color: rgba(0, 229, 160, 0.3);
      }
    `;
    document.head.appendChild(style);
  }

  document.body.classList.add('has-global-nav');
  document.querySelectorAll('.bottom-nav, .footer-nav').forEach((nav) => nav.remove());

  const nav = document.createElement('div');
  nav.className = 'global-bottom-nav';
  nav.innerHTML = `<div class="global-nav-row">${navItems.map((item) => `
    <button class="global-nav-btn${item.key === activeKey ? ' active' : ''}" type="button" data-href="${item.href}">
      <span class="global-nav-ico">${item.icon}</span>
      <span class="global-nav-lbl">${item.label}</span>
    </button>
  `).join('')}</div>`;

  const hostIsBody = root === document.body;
  if (hostIsBody) nav.classList.add('global-fixed');
  root.appendChild(nav);

  nav.querySelectorAll('[data-href]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = button.dataset.href;
    });
  });
})();
