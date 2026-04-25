(function () {
  'use strict';

  const AUDIO_DIR = 'wetransfer_daya-arena_2026-04-21_0632/Daya%20Arena%20FX/';
  const STORAGE_KEY = 'dayaAudioState';
  const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

  const files = {};
  for (let i = 1; i <= 35; i += 1) {
    files['sound' + i] = AUDIO_DIR + 'Sound_' + i + '.mp3';
  }

  const trackConfig = {
    sound1: { volume: 0.52, channels: 4, cooldown: 35 },
    sound2: { volume: 0.58, channels: 3, cooldown: 45 },
    sound3: { volume: 0.58, channels: 3, cooldown: 65 },
    sound4: { volume: 0.6, channels: 3, cooldown: 55 },
    sound5: { volume: 0.56, channels: 2, cooldown: 55 },
    sound6: { volume: 0.28, channels: 2, cooldown: 90 },
    sound7: { volume: 0.7, channels: 2, cooldown: 120 },
    sound8: { volume: 0.76, channels: 1, cooldown: 160 },
    sound9: { volume: 0.62, channels: 1, cooldown: 160 },
    sound10: { volume: 0.58, channels: 2, cooldown: 65 },
    sound11: { volume: 0.72, channels: 1, cooldown: 170 },
    sound12: { volume: 0.72, channels: 1, cooldown: 220 },
    sound13: { volume: 0.72, channels: 1, cooldown: 220 },
    sound14: { volume: 0.7, channels: 1, cooldown: 220 },
    sound15: { volume: 0.72, channels: 1, cooldown: 260 },
    sound16: { volume: 0.64, channels: 1, cooldown: 180 },
    sound17: { volume: 0.64, channels: 1, cooldown: 180 },
    sound18: { volume: 0.64, channels: 1, cooldown: 180 },
    sound19: { volume: 0.6, channels: 1, cooldown: 160 },
    sound20: { volume: 0.6, channels: 1, cooldown: 160 },
    sound21: { volume: 0.6, channels: 1, cooldown: 160 },
    sound22: { volume: 0.6, channels: 1, cooldown: 160 },
    sound23: { volume: 0.64, channels: 1, cooldown: 180 },
    sound24: { volume: 0.66, channels: 1, cooldown: 200 },
    sound25: { volume: 0.66, channels: 1, cooldown: 200 },
    sound26: { volume: 0.66, channels: 1, cooldown: 200 },
    sound27: { volume: 0.66, channels: 1, cooldown: 200 },
    sound28: { volume: 0.72, channels: 1, cooldown: 220 },
    sound29: { volume: 0.58, channels: 3, cooldown: 70 },
    sound30: { volume: 0.62, channels: 2, cooldown: 120 },
    sound31: { volume: 0.68, channels: 2, cooldown: 140 },
    sound32: { volume: 0.68, channels: 2, cooldown: 140 },
    sound33: { volume: 0.62, channels: 2, cooldown: 130 },
    sound34: { volume: 0.62, channels: 2, cooldown: 130 },
    sound35: { volume: 0.62, channels: 1, cooldown: 180 }
  };

  const soundBank = {};
  Object.keys(files).forEach((key) => {
    soundBank[key] = Object.assign(
      { src: files[key], type: 'sfx', volume: 0.6, channels: 2, cooldown: 80 },
      trackConfig[key] || {}
    );
  });

  soundBank.musicLobby = Object.assign({}, soundBank.sound15, {
    type: 'music',
    volume: 0.45,
    channels: 1,
    loop: true,
    preload: false
  });

  const soundAliases = {
    click: 'sound1',
    clickAlt: 'sound2',
    open: 'sound3',
    back: 'sound4',
    toggle: 'sound5',
    toggleOn: 'sound5',
    hover: 'sound6',
    success: 'sound7',
    start: 'sound8',
    error: 'sound9',
    close: 'sound10',
    reward: 'sound11',
    dailyReward: 'sound12',
    claim: 'sound13',
    spin: 'sound14',
    bigStart: 'sound15',
    onlineMode: 'sound16',
    friendsMode: 'sound17',
    computerMode: 'sound18',
    mode1v1: 'sound19',
    mode2v2: 'sound20',
    mode3v3: 'sound21',
    mode4v4: 'sound22',
    mapClassic: 'sound23',
    mapNeon: 'sound24',
    mapVolcano: 'sound25',
    mapIce: 'sound26',
    mapTemple: 'sound27',
    tournament: 'sound28',
    coin: 'sound29',
    shop: 'sound30',
    buy: 'sound31',
    equip: 'sound32',
    profile: 'sound33',
    notification: 'sound34',
    danger: 'sound35',
    uiClick: 'sound1',
    button: 'sound1',
    menu: 'sound2',
    select: 'sound2',
    mode: 'sound2',
    map: 'sound23',
    cancel: 'sound4',
    previous: 'sound4',
    settings: 'sound5',
    toggleOff: 'sound10',
    play: 'sound8',
    startGame: 'sound8',
    rewardClaim: 'sound11'
  };

  const fallbackButtonSounds = Array.from({ length: 35 }, (_, index) => 'sound' + (index + 1));

  const state = loadState();
  const channels = {};
  const lastPlayed = {};
  const cursors = {};
  let unlocked = false;
  let uiBound = false;
  let currentMusic = null;

  const interactiveSelector = [
    'button',
    'a[href]',
    '[role="button"]',
    '[onclick]',
    '[data-audio]',
    'input[type="button"]',
    'input[type="submit"]',
    '.btn',
    '.back-btn',
    '.back-home',
    '.icon-btn',
    '.ico-btn',
    '.nav-btn',
    '.nav-it',
    '.global-nav-btn',
    '.nav-battle',
    '.setting-row',
    '.filter-tab',
    '.tab',
    '.tab-btn',
    '.scope-tab',
    '.ltab',
    '.stab',
    '.map-card',
    '.mode-picker-option',
    '.queue-pill',
    '.toggle-pill',
    '.bet-chip',
    '.select-chip',
    '.toggle',
    '.lang-opt',
    '.av-opt',
    '.reward-card',
    '.item-card',
    '.bundle-card',
    '.slot.empty',
    '.action',
    '.stage',
    '.bot-card',
    '.outcome'
  ].join(',');

  function loadState() {
    const defaults = {
      master: 0.8,
      sfx: 0.9,
      music: 0.6,
      muted: false,
      hover: true,
      sfxEnabled: true,
      musicEnabled: true
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      return Object.assign(defaults, JSON.parse(raw));
    } catch (error) {
      return defaults;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Storage can be blocked in private browsing; audio should still work.
    }
  }

  function clamp(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(1, number));
  }

  function getArenaAudioFlag(type) {
    try {
      const raw = localStorage.getItem('arenaSettings');
      if (!raw) return true;
      const settings = JSON.parse(raw);
      if (type === 'sfx' && settings.sfx === false) return false;
      if (type === 'music' && settings.music === false) return false;
    } catch (error) {
      return true;
    }
    return true;
  }

  function isTypeEnabled(type) {
    if (state.muted) return false;
    if (type === 'music') return state.musicEnabled !== false && getArenaAudioFlag('music');
    return state.sfxEnabled !== false && getArenaAudioFlag('sfx');
  }

  function getVolume(sound, overrideVolume) {
    const typeVolume = sound.type === 'music' ? state.music : state.sfx;
    const requested = overrideVolume == null ? 1 : clamp(overrideVolume);
    return clamp(state.master * typeVolume * sound.volume * requested);
  }

  function createAudio(src, sound) {
    const audio = new Audio();
    audio.preload = sound.preload === false ? 'metadata' : 'auto';
    audio.src = src;
    audio.loop = !!sound.loop;
    audio.volume = getVolume(sound);

    try {
      audio.load();
    } catch (error) {
      // A failed eager load should not break UI events.
    }

    return audio;
  }

  function ensureChannels(key) {
    const sound = soundBank[key];
    if (!sound) return [];
    if (channels[key]) return channels[key];

    const count = Math.max(1, sound.channels || 1);
    channels[key] = Array.from({ length: count }, () => createAudio(sound.src, sound));
    cursors[key] = 0;
    return channels[key];
  }

  function preload() {
    Object.keys(soundBank).forEach((key) => {
      if (soundBank[key].preload !== false) ensureChannels(key);
    });
  }

  function resolveSoundName(name) {
    let key = name;
    const seen = {};

    while (soundAliases[key] && !soundBank[key] && !seen[key]) {
      seen[key] = true;
      key = soundAliases[key];
    }

    return soundBank[key] ? key : null;
  }

  function getNextChannel(key, sound) {
    const list = ensureChannels(key);
    if (!list.length) return null;

    const idle = list.find((audio) => audio.paused || audio.ended);
    if (idle) return idle;

    cursors[key] = ((cursors[key] || 0) + 1) % list.length;
    return sound.interrupt === false ? null : list[cursors[key]];
  }

  function play(name, options) {
    const key = resolveSoundName(name);
    const sound = key && soundBank[key];
    if (!sound || !isTypeEnabled(sound.type)) return null;

    const now = performance.now();
    const cooldown = options && options.cooldown != null ? options.cooldown : sound.cooldown;
    if (cooldown && lastPlayed[key] && now - lastPlayed[key] < cooldown) return null;

    unlock();

    const audio = getNextChannel(key, sound);
    if (!audio) return null;

    lastPlayed[key] = now;
    audio.volume = getVolume(sound, options && options.volume);
    audio.loop = options && options.loop != null ? !!options.loop : !!sound.loop;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      // Some browsers reject currentTime before metadata is available.
    }

    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {});
    }

    return audio;
  }

  function stop(name) {
    const key = resolveSoundName(name);
    const list = key && channels[key];
    if (!list) return;

    list.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {}
    });
  }

  function stopAll() {
    Object.keys(channels).forEach(stop);
    currentMusic = null;
  }

  function startMusic(name) {
    const key = resolveSoundName(name || 'musicLobby');
    if (!key || !soundBank[key] || soundBank[key].type !== 'music') return null;
    if (currentMusic && currentMusic !== key) stop(currentMusic);
    currentMusic = key;
    return play(key, { loop: true, cooldown: 0 });
  }

  function stopMusic() {
    if (currentMusic) stop(currentMusic);
    currentMusic = null;
  }

  function setVolume(type, value) {
    if (!Object.prototype.hasOwnProperty.call(state, type)) return;
    state[type] = clamp(value);
    saveState();
    applyVolumes();
  }

  function applyVolumes() {
    Object.keys(channels).forEach((key) => {
      const sound = soundBank[key];
      channels[key].forEach((audio) => {
        audio.volume = getVolume(sound);
      });
    });
  }

  function setMuted(value) {
    state.muted = !!value;
    saveState();
    applyVolumes();
    if (state.muted) stopMusic();
  }

  function setHoverEnabled(value) {
    state.hover = !!value;
    saveState();
  }

  function register(key, config) {
    if (!key || !config || !config.src) return;
    soundBank[key] = Object.assign({ type: 'sfx', volume: 1, channels: 1, cooldown: 0 }, config);
    delete channels[key];
    if (soundBank[key].preload !== false) ensureChannels(key);
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;

    Object.keys(channels).forEach((key) => {
      const audio = channels[key][0];
      if (!audio) return;

      const previousMuted = audio.muted;
      audio.muted = true;
      const promise = audio.play();
      if (promise && typeof promise.then === 'function') {
        promise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = previousMuted;
          })
          .catch(() => {
            audio.muted = previousMuted;
          });
      } else {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = previousMuted;
      }
    });
  }

  function closestInteractive(target) {
    if (!target || target.nodeType !== 1) return null;
    return target.closest(interactiveSelector);
  }

  function isDisabled(element) {
    return !!(
      element.disabled ||
      element.getAttribute('aria-disabled') === 'true' ||
      element.classList.contains('disabled') ||
      element.classList.contains('is-disabled')
    );
  }

  function fingerprint(element) {
    return [
      element.dataset.audio || '',
      element.dataset.href || '',
      element.dataset.mode || '',
      element.dataset.map || '',
      element.dataset.mv || '',
      element.dataset.ml || '',
      element.getAttribute('href') || '',
      element.id || '',
      typeof element.className === 'string' ? element.className : '',
      element.getAttribute('aria-label') || '',
      element.getAttribute('title') || '',
      element.getAttribute('onclick') || '',
      element.textContent || ''
    ].join(' ').toLowerCase();
  }

  function hasAny(text, words) {
    return words.some((word) => text.indexOf(word) !== -1);
  }

  function stableHash(value) {
    const text = String(value || 'button');
    let hash = 0;

    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  }

  function soundFromPool(value, pool) {
    return pool[stableHash(value) % pool.length];
  }

  function closestAttr(element, attr) {
    const node = element.closest('[' + attr + ']');
    return node ? node.getAttribute(attr) : '';
  }

  function soundFromMode(value) {
    const text = String(value || '').toLowerCase();

    if (hasAny(text, ['online', 'play-online.html', 'live match'])) return 'onlineMode';
    if (hasAny(text, ['friend', 'play-with-friends.html', 'private room', 'private squad'])) return 'friendsMode';
    if (hasAny(text, ['computer', 'vs-computer.html', ' ai', 'bot', 'train'])) return 'computerMode';
    if (hasAny(text, ['1v1', 'quick duel'])) return 'mode1v1';
    if (hasAny(text, ['2v2', 'duo battle'])) return 'mode2v2';
    if (hasAny(text, ['3v3', 'trio clash'])) return 'mode3v3';
    if (hasAny(text, ['4v4', 'squad war'])) return 'mode4v4';

    return '';
  }

  function soundFromMap(value) {
    const text = String(value || '').toLowerCase();

    if (hasAny(text, ['classic', 'royal classic'])) return 'mapClassic';
    if (hasAny(text, ['neon', 'cyber'])) return 'mapNeon';
    if (hasAny(text, ['volcano', 'lava'])) return 'mapVolcano';
    if (hasAny(text, ['ice', 'frost'])) return 'mapIce';
    if (hasAny(text, ['temple', 'ancient'])) return 'mapTemple';

    return '';
  }

  function soundFromRoute(value) {
    const text = String(value || '').toLowerCase();

    if (hasAny(text, ['play-online.html'])) return 'onlineMode';
    if (hasAny(text, ['play-with-friends.html'])) return 'friendsMode';
    if (hasAny(text, ['vs-computer.html'])) return 'computerMode';
    if (hasAny(text, ['settings.html'])) return 'settings';
    if (hasAny(text, ['notifications.html', 'alerts'])) return 'notification';
    if (hasAny(text, ['shop.html'])) return 'shop';
    if (hasAny(text, ['profile.html'])) return 'profile';
    if (hasAny(text, ['items.html'])) return 'equip';
    if (hasAny(text, ['friends.html'])) return 'friendsMode';
    if (hasAny(text, ['trophies.html', 'trophy-rank.html', 'rank.html', 'global-rank.html'])) return 'reward';
    if (hasAny(text, ['tournament.html'])) return 'tournament';
    if (hasAny(text, ['daily-reward.html'])) return 'dailyReward';
    if (hasAny(text, ['lucky-spin.html'])) return 'spin';
    if (hasAny(text, ['index.html', 'home'])) return 'back';

    return '';
  }

  function soundForElement(element) {
    const explicit = element.closest('[data-audio]');
    if (explicit && explicit.dataset.audio === 'none') return null;
    if (explicit && explicit.dataset.audio) return explicit.dataset.audio;

    const text = fingerprint(element);
    const attrMode = closestAttr(element, 'data-mode');
    const attrMap = closestAttr(element, 'data-map') || closestAttr(element, 'data-mv') || closestAttr(element, 'data-ml');
    const mappedModeSound = soundFromMode(attrMode || text);
    const mappedMapSound = soundFromMap(attrMap || text);

    if (hasAny(text, ['logout', 'log out', 'delete account', 'danger', 'decline', 'clear all', 'break'])) {
      return 'danger';
    }

    if (hasAny(text, ['back', 'history.back', 'previous'])) {
      return 'back';
    }

    if (hasAny(text, ['close', 'cancel', 'dismiss'])) {
      return 'close';
    }

    if (element.matches('.spin-btn') || hasAny(text, ['spin', 'wheel'])) {
      return 'spin';
    }

    if (hasAny(text, ['claim reward', 'claim', 'daily reward', 'awesome'])) {
      return hasAny(text, ['daily']) ? 'dailyReward' : 'claim';
    }

    if (hasAny(text, ['reward', 'chest', 'trophy', 'xp', 'level', 'addxp'])) {
      return 'reward';
    }

    if (hasAny(text, ['buy now', 'confirm purchase', 'purchase', 'buy'])) {
      return 'buy';
    }

    if (hasAny(text, ['equip', 'skin', 'item', 'dice', 'pawn', 'power'])) {
      return 'equip';
    }

    if (hasAny(text, ['coin', 'diamond', 'gem', 'currency', 'bundle', 'get more'])) {
      return 'coin';
    }

    if (hasAny(text, ['shop.html', 'shop'])) {
      return 'shop';
    }

    if (hasAny(text, ['profile', 'avatar', 'username', 'sync', 'share profile', 'ghost mode'])) {
      return 'profile';
    }

    if (hasAny(text, ['notification', 'alerts', 'bell', 'mark all read'])) {
      return 'notification';
    }

    if (hasAny(text, ['tournament', 'qualifier', 'knockout', 'finals', 'stage', 'bracket', 'live'])) {
      return 'tournament';
    }

    if (element.matches('.play-now') || hasAny(text, ['play now', 'start game'])) {
      return 'bigStart';
    }

    if (hasAny(text, ['queue now', 'join now', 'join', 'start'])) {
      return mappedModeSound || 'start';
    }

    if (mappedModeSound && (
      element.matches('.mode-picker-option, .mode-battle-btn, .queue-pill, .toggle-pill, .nav-btn, .nav-it, .global-nav-btn') ||
      hasAny(text, ['online', 'friends', 'computer', ' ai', '1v1', '2v2', '3v3', '4v4'])
    )) {
      return mappedModeSound;
    }

    if (mappedMapSound && (
      element.matches('.map-card, .map-btn, .map-pill, .hero-arrow') ||
      hasAny(text, ['map', 'classic', 'neon', 'volcano', 'ice', 'frost', 'temple'])
    )) {
      return mappedMapSound;
    }

    const routeSound = soundFromRoute(text);
    if (routeSound) return routeSound;

    if (element.matches('.toggle')) {
      return element.classList.contains('on') ? 'toggleOff' : 'toggleOn';
    }

    if (element.matches('.select-chip, .bet-chip')) {
      return 'select';
    }

    if (element.matches('.filter-tab, .filter-chip')) {
      return 'clickAlt';
    }

    if (element.matches('.tab, .tab-btn, .scope-tab, .ltab, .stab, .tf-btn, .lb-filter')) {
      return 'menu';
    }

    if (element.matches('.lang-opt, .av-opt')) {
      return 'profile';
    }

    if (hasAny(text, ['copy', 'share', 'invite', 'add friend', 'requests', 'more', 'details', 'open'])) {
      return 'open';
    }

    if (hasAny(text, ['save', 'apply', 'confirm', 'ok', 'refresh', 'shuffle', 'randomize', 'boost', 'advance'])) {
      return 'success';
    }

    if (hasAny(text, ['settings', 'theme', 'volume', 'music', 'sound effects', 'vibration', 'timer', 'animations'])) {
      return 'settings';
    }

    return soundFromPool(text, fallbackButtonSounds);
  }

  function onClick(event) {
    const element = closestInteractive(event.target);
    if (!element || isDisabled(element)) return;

    const sound = soundForElement(element);
    if (!sound) return;
    play(sound);

    if (element.id === 'tSfx' || element.id === 'tMusic') {
      setTimeout(syncInlineSettingsToggles, 0);
    }
  }

  function onHover(event) {
    if (!state.hover || !window.matchMedia(HOVER_QUERY).matches) return;

    const element = closestInteractive(event.target);
    if (!element || isDisabled(element)) return;
    if (event.relatedTarget && element.contains(event.relatedTarget)) return;

    play('hover');
  }

  function bindUnlockEvents() {
    ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
      document.addEventListener(eventName, unlock, { capture: true, once: true, passive: true });
    });
  }

  function bindUI() {
    if (uiBound) return;
    uiBound = true;
    document.addEventListener('click', onClick, true);
    document.addEventListener('mouseenter', onHover, true);
    bindUnlockEvents();
    bindVolumeControls();
    syncInlineSettingsToggles();
  }

  function bindVolumeControls() {
    const volumeMap = {
      'vol-master': 'master',
      'vol-music': 'music',
      'vol-sfx': 'sfx'
    };

    Object.keys(volumeMap).forEach((labelId) => {
      const label = document.getElementById(labelId);
      const input = label && label.closest('.slider-wrap') && label.closest('.slider-wrap').querySelector('input[type="range"]');
      const stateKey = volumeMap[labelId];
      if (!input) return;

      input.value = Math.round(state[stateKey] * 100);
      label.textContent = input.value;
      if (typeof window.applySliderFill === 'function') window.applySliderFill(input);

      input.addEventListener('input', () => {
        const value = Number(input.value) / Number(input.max || 100);
        label.textContent = input.value;
        setVolume(stateKey, value);
      });

      input.addEventListener('change', () => {
        play('select', { cooldown: 0 });
      });
    });
  }

  function syncInlineSettingsToggles() {
    const sfxToggle = document.getElementById('tSfx');
    const musicToggle = document.getElementById('tMusic');

    if (sfxToggle) state.sfxEnabled = sfxToggle.classList.contains('on');
    if (musicToggle) state.musicEnabled = musicToggle.classList.contains('on');
    saveState();
  }

  function init() {
    preload();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindUI, { once: true });
    } else {
      bindUI();
    }
  }

  window.DayaAudio = {
    files,
    sounds: soundBank,
    aliases: soundAliases,
    buttonSoundPool: fallbackButtonSounds.slice(),
    init,
    play,
    stop,
    stopAll,
    startMusic,
    stopMusic,
    register,
    bindUI,
    setMasterVolume: (value) => setVolume('master', value),
    setSfxVolume: (value) => setVolume('sfx', value),
    setMusicVolume: (value) => setVolume('music', value),
    setMuted,
    setHoverEnabled,
    getState: () => Object.assign({}, state)
  };

  init();
})();
