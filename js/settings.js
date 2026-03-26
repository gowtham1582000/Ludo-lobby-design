/* ============================================================
   js/settings.js — Daya Pass Arena · Settings Page Logic
   ============================================================ */

/* ── SLIDER INIT & UPDATE ── */

/**
 * Update slider fill and display value on input.
 * @param {HTMLInputElement} el  - The range input element
 * @param {string}           id  - ID of the <span> that shows the value
 */
function updateSlider(el, id) {
  const val = el.value;
  document.getElementById(id).textContent = val;
  applySliderFill(el);
}

/**
 * Apply green fill gradient to a slider based on its current value.
 * @param {HTMLInputElement} el
 */
function applySliderFill(el) {
  const pct = (el.value / el.max) * 100;
  el.style.background = `linear-gradient(90deg, #00ffb4 ${pct}%, #1c1f28 ${pct}%)`;
}

/** Initialise all sliders on page load. */
function initSliders() {
  document.querySelectorAll('.slider').forEach(applySliderFill);
}

/* ── CYCLE CONTROLS ── */

const timerOptions = ['15s', '30s', '45s', '60s'];
let timerIdx = 1; // default: 30s

/**
 * Cycle through turn-timer options when the chip is clicked.
 * @param {HTMLElement} el - The .select-chip element
 */
function cycleTimer(el) {
  timerIdx = (timerIdx + 1) % timerOptions.length;
  el.childNodes[0].textContent = timerOptions[timerIdx];
}

const animOptions = ['LOW', 'MED', 'HIGH'];
let animIdx = 2; // default: HIGH

/**
 * Cycle through animation-quality options when the chip is clicked.
 * @param {HTMLElement} el - The .select-chip element
 */
function cycleAnim(el) {
  animIdx = (animIdx + 1) % animOptions.length;
  el.childNodes[0].textContent = animOptions[animIdx];
}

/* ── MODAL HELPERS ── */

/**
 * Open a modal overlay by ID.
 * @param {string} id - The modal overlay element's ID
 */
function showModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

/**
 * Close a modal overlay by ID.
 * @param {string} id - The modal overlay element's ID
 */
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

/**
 * Close a modal when the user clicks on the dark backdrop (outside the modal box).
 * @param {MouseEvent} e  - The click event
 * @param {string}     id - The modal overlay element's ID
 */
function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

/* ── LANGUAGE SELECTOR ── */

/**
 * Select a language option inside the language grid.
 * Deselects siblings and highlights the chosen item.
 * @param {HTMLElement} el - The .lang-opt element that was clicked
 */
function selectLang(el) {
  const grid = el.closest('.lang-grid');
  if (!grid) return;
  grid.querySelectorAll('.lang-opt').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
}

/* ── THEME SELECTOR ── */

/**
 * Select a board theme option and update the badge in the main UI.
 * @param {HTMLElement} el   - The .lang-opt element that was clicked
 * @param {string}      name - Short theme name to display in the badge
 */
function selectTheme(el, name) {
  const modal = el.closest('.modal');
  if (!modal) return;
  modal.querySelectorAll('.lang-opt').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');

  // Update the gold value badge in the Gameplay section
  document.querySelectorAll('.val-gold').forEach(badge => {
    if (badge.textContent.length < 10) badge.textContent = name;
  });
}

/* ── AVATAR SELECTOR ── */

/**
 * Select an avatar inside the profile edit modal.
 * @param {HTMLElement} el - The .av-opt element that was clicked
 */
function selectAvatar(el) {
  const picker = el.closest('.avatar-picker');
  if (!picker) return;
  picker.querySelectorAll('.av-opt').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', initSliders);
