const REWARDS = [
  { icon: '💎', name: 'Diamond Pack', value: 'x5', color: '#00CFFF', glow: 'rgba(0,207,255,.35)', rarity: 'LEGENDARY', weight: 3 },
  { icon: '🏆', name: 'Trophy Chest', value: '50,000', color: '#FFD700', glow: 'rgba(255,215,0,.35)', rarity: 'EPIC', weight: 6 },
  { icon: '💰', name: 'Gold Coins', value: '10,000', color: '#FFA500', glow: 'rgba(255,165,0,.35)', rarity: 'RARE', weight: 12 },
  { icon: '⚡', name: 'Power Up', value: 'x3', color: '#7B2FF7', glow: 'rgba(123,47,247,.35)', rarity: 'RARE', weight: 10 },
  { icon: '🎁', name: 'Mystery Box', value: 'RANDOM', color: '#FF69B4', glow: 'rgba(255,105,180,.35)', rarity: 'COMMON', weight: 20 },
  { icon: '🌟', name: 'Star Token', value: 'x10', color: '#2ECC71', glow: 'rgba(46,204,113,.35)', rarity: 'UNCOMMON', weight: 15 },
  { icon: '💣', name: 'Bomb Blast', value: 'x2', color: '#FF4136', glow: 'rgba(255,65,52,.35)', rarity: 'UNCOMMON', weight: 14 },
  { icon: '🔑', name: 'Arena Key', value: 'x1', color: '#00E5CC', glow: 'rgba(0,229,204,.35)', rarity: 'EPIC', weight: 8 }
];

let spinning = false;
let freeSpin = 1;
let coins = 24650;
let spinHistory = [];
const SPIN_COST = 480;

function weightedRandom(rewards) {
  const total = rewards.reduce((sum, reward) => sum + reward.weight, 0);
  let roll = Math.random() * total;
  for (const reward of rewards) {
    roll -= reward.weight;
    if (roll <= 0) return reward;
  }
  return rewards[rewards.length - 1];
}

function formatNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function buildWheel() {
  const canvas = document.getElementById('wheelCanvas');
  const size = 240;
  const center = size / 2;
  const radius = 115;
  const innerRadius = 32;
  const count = REWARDS.length;
  const step = (2 * Math.PI) / count;

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:${size}px;height:${size}px">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="2.6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff176"/>
        <stop offset="50%" stop-color="#ffd700"/>
        <stop offset="100%" stop-color="#b8860b"/>
      </linearGradient>
    </defs>`;

  svg += `<circle cx="${center}" cy="${center}" r="${radius + 6}" fill="rgba(0,0,0,.4)"/>`;
  svg += `<circle cx="${center}" cy="${center}" r="${radius + 3}" fill="none" stroke="#b8860b" stroke-width="6"/>`;
  svg += `<circle cx="${center}" cy="${center}" r="${radius + 3}" fill="none" stroke="url(#goldRingGrad)" stroke-width="3"/>`;

  // Vivid sector base colors for better contrast
  const sectorColors = ['#0a2a3d','#1a0d30','#0d2a1a','#2a1a0d','#0d1a2a','#1f0a1a','#0d2a28','#2a0d16'];

  REWARDS.forEach((reward, i) => {
    const start = i * step - Math.PI / 2;
    const end = start + step;
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    const mid = start + step / 2;
    const iconR = radius * 0.78;
    const valR  = radius * 0.50;
    const ix = center + iconR * Math.cos(mid);
    const iy = center + iconR * Math.sin(mid);
    const vx = center + valR * Math.cos(mid);
    const vy = center + valR * Math.sin(mid);

    const gradId = `sg${i}`;
    svg += `<defs>
      <linearGradient id="${gradId}" x1="${center}" y1="${center}" x2="${center + radius * Math.cos(mid)}" y2="${center + radius * Math.sin(mid)}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${sectorColors[i % sectorColors.length]}"/>
        <stop offset="100%" stop-color="${reward.color}55"/>
      </linearGradient>
    </defs>`;

    svg += `<path d="M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z" fill="url(#${gradId})" stroke="${reward.color}99" stroke-width="1.5"/>`;
    svg += `<line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" stroke="${reward.color}66" stroke-width="0.8"/>`;

    // Icon — pushed to outer edge for clarity
    svg += `<text x="${ix}" y="${iy}" text-anchor="middle" dominant-baseline="central" font-size="22" filter="url(#glow)">${reward.icon}</text>`;

    // Value — bold, with dark stroke for contrast
    const rotDeg = mid * 180 / Math.PI + 90;
    const flip = rotDeg > 90 && rotDeg < 270 ? rotDeg - 180 : rotDeg;
    svg += `<text x="${vx}" y="${vy}" text-anchor="middle" dominant-baseline="central" font-size="10" font-family="Orbitron,sans-serif" font-weight="900" fill="#fff" stroke="#000" stroke-width="2.5" paint-order="stroke" transform="rotate(${flip}, ${vx}, ${vy})">${reward.value}</text>`;
  });

  svg += `<circle cx="${center}" cy="${center}" r="${innerRadius + 4}" fill="#0d1b2a" stroke="#b8860b66" stroke-width="2"/>`;
  svg += '</svg>';

  canvas.innerHTML = svg;
}

function updateCoinDisplay() {
  document.getElementById('coinDisplay').innerHTML = `<span>🪙</span>${formatNum(coins)}`;
}

function updateTicketStatus() {
  const freeBadge = document.getElementById('freeBadge');
  const ticketStatus = document.getElementById('ticketStatus');
  if (freeSpin > 0) {
    freeBadge.style.display = 'flex';
    ticketStatus.textContent = '1 FREE TODAY';
  } else {
    freeBadge.style.display = 'none';
    ticketStatus.textContent = '0 FREE TODAY';
  }
}

function renderHistory() {
  const strip = document.getElementById('historyStrip');
  if (!spinHistory.length) {
    strip.innerHTML = '<div style="color: var(--text-dim); font-size: 12px; padding: 8px 0; width: 100%; text-align: center;">No spins yet - hit SPIN!</div>';
    return;
  }

  strip.innerHTML = spinHistory.map((reward) => `
    <div class="history-item">
      <div class="history-icon">${reward.icon}</div>
      <div class="history-val">${reward.value}</div>
    </div>
  `).join('');
}

function addHistory(reward) {
  spinHistory.unshift(reward);
  if (spinHistory.length > 8) spinHistory.pop();
  renderHistory();
}

function buildRewardCards() {
  const grid = document.getElementById('rewardGrid');
  grid.innerHTML = REWARDS.map((reward, i) => `
    <div class="reward-card" style="--card-color:${reward.color};--card-glow:${reward.glow};animation-delay:${i * 0.06}s">
      <div class="reward-icon">${reward.icon}</div>
      <div class="reward-name">${reward.name}</div>
      <div class="reward-value">${reward.value}</div>
      <div class="reward-rarity">${reward.rarity}</div>
    </div>
  `).join('');
}

function highlightRewardCard(index) {
  const cards = document.querySelectorAll('.reward-card');
  cards.forEach((card) => card.classList.remove('highlight-pulse'));
  if (cards[index]) {
    cards[index].classList.add('highlight-pulse');
    setTimeout(() => cards[index].classList.remove('highlight-pulse'), 1000);
  }
}

function spawnSpinParticles() {
  const wheel = document.querySelector('.wheel-scene');
  const rect = wheel.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#FFD700', '#00E5CC', '#FF69B4', '#7B2FF7', '#FF851B', '#2ECC71', '#00CFFF'];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'spin-particle';
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const size = 4 + Math.random() * 6;
    particle.style.cssText = `
      left:${cx}px;top:${cy}px;
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      box-shadow:0 0 6px currentColor;
      --sp-x:${Math.cos(angle) * distance}px;
      --sp-y:${Math.sin(angle) * distance}px;
      --sp-dur:${0.6 + Math.random() * 0.8}s;
      --sp-delay:${Math.random() * 0.4}s;
    `;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1600);
  }
}

function spawnConfetti() {
  const colors = ['#FFD700', '#00E5CC', '#FF69B4', '#7B2FF7', '#FF851B', '#2ECC71', '#FF4136', '#00CFFF'];
  for (let i = 0; i < 54; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const shape = Math.random() > 0.5 ? '50%' : (Math.random() > 0.5 ? '0%' : '2px');
    piece.style.cssText = `
      left:${10 + Math.random() * 80}vw;
      border-radius:${shape};
      width:${6 + Math.random() * 9}px;
      height:${6 + Math.random() * 9}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      --cf-x:${(Math.random() - 0.5) * 120}px;
      --cf-r:${Math.random() * 720 - 360}deg;
      --cf-dur:${1.2 + Math.random() * 1.8}s;
      --cf-delay:${Math.random() * 0.5}s;
    `;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3600);
  }
}

function showWinModal(reward) {
  const overlay = document.getElementById('winModal');
  document.getElementById('modalEmoji').textContent = reward.icon;
  document.getElementById('modalRarity').textContent = reward.rarity;
  document.getElementById('modalPrize').textContent = `${reward.name} ${reward.value}`;
  document.getElementById('modalPrize').style.color = reward.color;
  document.getElementById('modalPrize').style.textShadow = `0 0 30px ${reward.color}`;
  overlay.classList.add('show');
}

function closeModal() {
  document.getElementById('winModal').classList.remove('show');
}

function spinWheel() {
  if (spinning) return;
  if (freeSpin <= 0 && coins < SPIN_COST) {
    const btn = document.getElementById('spinBtn');
    btn.style.transform = 'translateX(-8px)';
    setTimeout(() => btn.style.transform = 'translateX(8px)', 80);
    setTimeout(() => btn.style.transform = 'translateX(-5px)', 160);
    setTimeout(() => btn.style.transform = 'translateX(5px)', 240);
    setTimeout(() => btn.style.transform = '', 320);
    return;
  }

  if (freeSpin > 0) {
    freeSpin--;
  } else {
    coins -= SPIN_COST;
  }
  updateCoinDisplay();
  updateTicketStatus();

  spinning = true;
  const btn = document.getElementById('spinBtn');
  btn.disabled = true;

  const winner = weightedRandom(REWARDS);
  const winnerIndex = REWARDS.indexOf(winner);
  const sectorDeg = 360 / REWARDS.length;
  const targetSector = winnerIndex * sectorDeg + sectorDeg / 2;
  const fullSpins = 5 + Math.floor(Math.random() * 4);
  const totalDeg = fullSpins * 360 + (360 - targetSector);

  const canvas = document.getElementById('wheelCanvas');
  const currentRotation = parseFloat(canvas.dataset.rot || '0');
  const nextRotation = currentRotation + totalDeg;
  canvas.dataset.rot = String(nextRotation % 360);

  const spinDuration = 2.9 + Math.random() * 1.1;
  canvas.style.transition = `transform ${spinDuration}s cubic-bezier(0.17, 0.67, 0.12, 1)`;
  canvas.style.transform = `rotate(${nextRotation}deg)`;

  spawnSpinParticles();

  const wheel3d = document.querySelector('.wheel-3d');
  wheel3d.style.transform = 'translate(-50%, -50%) scale(0.97)';
  setTimeout(() => {
    wheel3d.style.transform = 'translate(-50%, -50%)';
  }, 1200);

  setTimeout(() => {
    spinning = false;
    btn.disabled = freeSpin <= 0 && coins < SPIN_COST;
    canvas.style.transition = '';
    showWinModal(winner);
    highlightRewardCard(winnerIndex);
    addHistory(winner);
    spawnConfetti();
  }, spinDuration * 1000 + 100);
}

document.addEventListener('DOMContentLoaded', () => {
  buildWheel();
  buildRewardCards();
  updateCoinDisplay();
  updateTicketStatus();
  renderHistory();

  document.getElementById('spinBtn').addEventListener('click', spinWheel);

  document.getElementById('claimBtn').addEventListener('click', () => {
    closeModal();
    coins += 100;
    updateCoinDisplay();
  });

  document.getElementById('winModal').addEventListener('click', function (event) {
    if (event.target === this) closeModal();
  });

  document.getElementById('getMoreBtn').addEventListener('click', () => {
    coins += 5000;
    updateCoinDisplay();
    const btn = document.getElementById('getMoreBtn');
    btn.style.background = 'rgba(0,229,204,.5)';
    btn.textContent = '+5000';
    setTimeout(() => {
      btn.style.background = '';
      btn.textContent = 'GET MORE';
    }, 1200);
  });

  const scene = document.querySelector('.wheel-scene');
  const wheel3d = document.querySelector('.wheel-3d');
  scene.addEventListener('mousemove', (event) => {
    if (spinning) return;
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    wheel3d.style.transform = `translate(-50%, -50%) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });

  scene.addEventListener('mouseleave', () => {
    if (!spinning) {
      wheel3d.style.transform = 'translate(-50%, -50%)';
    }
  });
});
