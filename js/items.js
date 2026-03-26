/* ═══════════════════════════════════════
   js/items.js  –  Daya Pass Arena
   Inventory · Loadout · Equip logic
═══════════════════════════════════════ */

/* ────────────────────────────────────
   1.  ITEM DATA  (simulates shop purchases)
──────────────────────────────────── */
const ITEM_DB = {
  dice: [
    { id: "d1",  name: "Classic Cube",    emoji: "🎲", rarity: "common",    desc: "The original six-sided die. Faithful companion since day one." },
    { id: "d2",  name: "Ice Shard",       emoji: "🧊", rarity: "rare",      desc: "Forged in the frozen north. Rolls leave a trail of frost." },
    { id: "d3",  name: "Flame Dice",      emoji: "🔥", rarity: "epic",      desc: "Burns with inner fire. High rolls guaranteed… sometimes." },
    { id: "d4",  name: "Galaxy Roller",   emoji: "🌌", rarity: "legendary", desc: "Pulls numbers from across the cosmos. Truly random?" },
    { id: "d5",  name: "Crystal Prism",   emoji: "💎", rarity: "epic",      desc: "Refracts luck into beautiful arcs of light." },
    { id: "d6",  name: "Neon Pulse",      emoji: "⚡", rarity: "rare",      desc: "Electrifying rolls that light up the board." },
  ],
  pawn: [
    { id: "p1",  name: "Default Pawn",    emoji: "♟️", rarity: "common",    desc: "The standard piece. Nothing fancy—but dependable." },
    { id: "p2",  name: "Crown Knight",    emoji: "👑", rarity: "legendary", desc: "A royal piece that commands respect on the board." },
    { id: "p3",  name: "Robot Unit",      emoji: "🤖", rarity: "epic",      desc: "Precision-engineered. Calculates the best path forward." },
    { id: "p4",  name: "Ghost Token",     emoji: "👻", rarity: "rare",      desc: "Phases through obstacles. Opponents blink twice." },
    { id: "p5",  name: "Dragon Scale",    emoji: "🐉", rarity: "legendary", desc: "Ancient power in miniature form. Fear it." },
    { id: "p6",  name: "Ninja Star",      emoji: "🌟", rarity: "rare",      desc: "Swift and silent. Arrives before it's seen." },
  ],
  board: [
    { id: "b1",  name: "Ice Kingdom",     emoji: "❄️", rarity: "epic",      desc: "Frost-covered paths and icy shortcuts await." },
    { id: "b2",  name: "Lava Land",       emoji: "🌋", rarity: "legendary", desc: "Molten rivers border every square. Don't slip." },
    { id: "b3",  name: "Forest Realm",    emoji: "🌿", rarity: "common",    desc: "Serene woodland paths. A classic Ludo experience." },
  ],
};

/* ────────────────────────────────────
   2.  GAME STATE  (persisted in localStorage)
──────────────────────────────────── */
function loadState() {
  try {
    const raw = localStorage.getItem("ludoItemsState");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  // Default state – player already owns some items
  return {
    owned: {
      dice:  ["d1", "d2", "d3"],
      pawn:  ["p1", "p2", "p4"],
      board: ["b1", "b3"],
    },
    equipped: {
      dice:  "d1",
      pawn:  "p1",
      board: "b1",
    },
  };
}

function saveState(state) {
  try { localStorage.setItem("ludoItemsState", JSON.stringify(state)); } catch (_) {}
}

let STATE = loadState();

/* ────────────────────────────────────
   3.  HELPERS
──────────────────────────────────── */
function rarityClass(r) { return "rarity-" + r; }

function buildCard(item, type, showLocked) {
  const owned    = STATE.owned[type].includes(item.id);
  const equipped = STATE.equipped[type] === item.id;
  const locked   = showLocked && !owned;

  const card = document.createElement("div");
  card.className = "item-card" + (equipped ? " equipped" : "") + (locked ? " locked" : "");
  card.dataset.rarity = item.rarity;
  card.dataset.id     = item.id;
  card.dataset.type   = type;

  card.innerHTML = `
    <span class="item-emoji">${item.emoji}${locked ? "<span class='lock-icon'>🔒</span>" : ""}</span>
    <div class="item-name">${item.name}</div>
    <div class="item-rarity ${rarityClass(item.rarity)}">${item.rarity.toUpperCase()}</div>
  `;

  if (!locked) {
    card.addEventListener("click", () => openModal(item, type));
  } else {
    card.style.opacity = ".45";
    card.style.filter  = "grayscale(.8)";
    card.title = "Visit shop to unlock";
  }

  return card;
}

/* ────────────────────────────────────
   4.  RENDER SECTIONS
──────────────────────────────────── */
function renderInventory() {
  ["dice", "pawn", "board"].forEach(type => {
    const gridId = `inv-${type}-grid`;
    const grid   = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = "";

    const ownedItems = ITEM_DB[type].filter(i => STATE.owned[type].includes(i.id));
    if (ownedItems.length === 0) {
      grid.innerHTML = `<p class="empty-msg">No ${type} skins owned yet. <a href="#" class="shop-link" onclick="goShop()">Visit the Shop!</a></p>`;
      return;
    }
    ownedItems.forEach(item => grid.appendChild(buildCard(item, type, false)));
  });
}

function renderEquipTab(type) {
  const gridId = `${type}-equip-grid`;
  const grid   = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  ITEM_DB[type].forEach(item => grid.appendChild(buildCard(item, type, true)));
}

function renderLoadout() {
  ["dice", "pawn", "board"].forEach(type => {
    const equipped = ITEM_DB[type].find(i => i.id === STATE.equipped[type]);
    if (!equipped) return;
    const previewEl = document.getElementById(`preview-${type}`);
    if (previewEl) {
      previewEl.querySelector(".slot-icon").textContent = equipped.emoji;
      previewEl.querySelector(".slot-name").textContent = equipped.name;
    }
  });
}

function renderCollectionStats() {
  const ownedCount = document.getElementById("ownedCount");
  const equippedCount = document.getElementById("equippedCount");
  const rareCount = document.getElementById("rareCount");
  if (!ownedCount || !equippedCount || !rareCount) return;

  const ownedItems = ["dice", "pawn", "board"].flatMap(type =>
    ITEM_DB[type].filter(item => STATE.owned[type].includes(item.id))
  );

  ownedCount.textContent = ownedItems.length;
  equippedCount.textContent = Object.keys(STATE.equipped).length;
  rareCount.textContent = ownedItems.filter(item => item.rarity !== "common").length;
}

/* ────────────────────────────────────
   5.  MODAL
──────────────────────────────────── */
let _modalItem = null;
let _modalType = null;

function openModal(item, type) {
  _modalItem = item;
  _modalType = type;

  document.getElementById("modalPreview").textContent = item.emoji;
  document.getElementById("modalName").textContent    = item.name;
  document.getElementById("modalDesc").textContent    = item.desc;

  const rarityEl = document.getElementById("modalRarity");
  rarityEl.textContent  = item.rarity.toUpperCase();
  rarityEl.className    = "modal-item-rarity " + rarityClass(item.rarity);

  const btn     = document.getElementById("modalEquipBtn");
  const isEq    = STATE.equipped[type] === item.id;
  btn.textContent = isEq ? "✅ EQUIPPED" : "⚔️ EQUIP";
  btn.className   = "modal-equip-btn" + (isEq ? " equipped-state" : "");

  document.getElementById("equipModal").classList.add("open");
}

function closeModal() {
  document.getElementById("equipModal").classList.remove("open");
  _modalItem = null;
  _modalType = null;
}

function equipItem() {
  if (!_modalItem || !_modalType) return;
  if (STATE.equipped[_modalType] === _modalItem.id) { closeModal(); return; }

  STATE.equipped[_modalType] = _modalItem.id;
  saveState(STATE);

  // Update button immediately
  const btn = document.getElementById("modalEquipBtn");
  btn.textContent = "✅ EQUIPPED";
  btn.className   = "modal-equip-btn equipped-state";

  // Refresh all rendered sections
  renderInventory();
  renderEquipTab("dice");
  renderEquipTab("pawn");
  renderLoadout();
  renderCollectionStats();

  // Show toast
  showToast(`${_modalItem.emoji} ${_modalItem.name} equipped!`);

  setTimeout(closeModal, 700);
}

/* ────────────────────────────────────
   6.  LOADOUT CHANGE BUTTONS
──────────────────────────────────── */
document.querySelectorAll(".slot-change-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    // Switch to the relevant tab
    activateTab(type === "board" ? "inventory" : type);
  });
});

/* ────────────────────────────────────
   7.  TAB SWITCHING
──────────────────────────────────── */
function activateTab(tabName) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === `panel-${tabName}`));
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

document.addEventListener("pointerdown", e => {
  const card = e.target.closest(".item-card");
  if (!card) return;
  card.classList.add("tapped");
  clearTimeout(card._tapTimer);
  card._tapTimer = setTimeout(() => card.classList.remove("tapped"), 180);
});

/* ────────────────────────────────────
   8.  SHOP BUTTON
──────────────────────────────────── */
function goShop() {
  window.location.href = "shop.html";
}
document.getElementById("shopBtn").addEventListener("click", goShop);

/* ────────────────────────────────────
   9.  MODAL EVENTS
──────────────────────────────────── */
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("equipModal").addEventListener("click", e => {
  if (e.target === document.getElementById("equipModal")) closeModal();
});
document.getElementById("modalEquipBtn").addEventListener("click", equipItem);

/* ────────────────────────────────────
   10.  TOAST NOTIFICATION
──────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById("ludo-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "ludo-toast";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "90px",
      left: "50%",
      transform: "translateX(-50%) translateY(20px)",
      background: "linear-gradient(135deg,#00ffc8,#00c4ff)",
      color: "#021014",
      fontFamily: "'Orbitron',sans-serif",
      fontWeight: "700",
      fontSize: "11px",
      letterSpacing: "1px",
      padding: "10px 20px",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,255,200,.4)",
      zIndex: "200",
      opacity: "0",
      transition: "opacity .25s, transform .25s",
      whiteSpace: "nowrap",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.style.opacity   = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2200);
}

/* ────────────────────────────────────
   11.  INIT
──────────────────────────────────── */
renderInventory();
renderEquipTab("dice");
renderEquipTab("pawn");
renderLoadout();
renderCollectionStats();

