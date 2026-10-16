/* Test-mode bootstrap, injected before any site script (page.addInitScript).
 * - window.YTEST: registry the site's games report into (the site only touches it when it exists).
 * - Seeded Math.random, so a run is reproducible.
 * - Audio "speaker" replaced: files still load for real (404s and metadata are real), but playback
 *   advances on timers instead of real sound, so a faked clock can fast-forward it.
 * - speechSynthesis replaced the same way (records what would be spoken).
 */
(function () {
  var cfg = window.__YT_CFG || {};
  var seed = (cfg.seed >>> 0) || 12345;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  Math.random = rnd;

  var Y = window.YTEST = { games: {}, played: [], spoken: [], log: [],
    reg: function (name, api) { Y.games[name] = api; },
    note: function (m) { Y.log.push(m); } };

  /* ---------- audio playback mock ---------- */
  var P = HTMLMediaElement.prototype, S = new WeakMap();
  var nat = {
    play: P.play, pause: P.pause,
    ct: Object.getOwnPropertyDescriptor(P, 'currentTime'),
    dur: Object.getOwnPropertyDescriptor(P, 'duration'),
    paused: Object.getOwnPropertyDescriptor(P, 'paused'),
    ended: Object.getOwnPropertyDescriptor(P, 'ended')
  };
  function st(el) { var s = S.get(el); if (!s) { s = { src: null, pos: 0, playing: false, ended: false, iv: 0, dur: NaN }; S.set(el, s); } return s; }
  function ev(el, n) { try { el.dispatchEvent(new Event(n)); } catch (e) {} }
  function natDur(el) { var d = nat.dur.get.call(el); return isFinite(d) && d > 0 ? d : NaN; }
  function stopTimer(s) { if (s.iv) { clearInterval(s.iv); s.iv = 0; } }
  P.play = function () {
    var el = this, s = st(el), src = el.currentSrc || el.src;
    if (s.src !== src) { s.src = src; s.pos = 0; s.ended = false; }
    if (s.ended) { s.pos = 0; s.ended = false; }
    if (el.error) return Promise.reject(new DOMException('load failed', 'NotSupportedError'));
    s.playing = true; stopTimer(s);
    if (!el.muted) Y.played.push(String(src).replace(/^.*\/audio\//, '').replace(/\?.*$/, ''));
    ev(el, 'play');
    var last = performance.now();
    s.iv = setInterval(function () {
      if (!s.playing) return stopTimer(s);
      var d = natDur(el); if (!isFinite(d)) { last = performance.now(); return; }  // still loading: no progress, like real life
      var now = performance.now(); s.pos += (now - last) / 1000; last = now;
      if (s.pos >= d) { s.pos = d; s.playing = false; s.ended = true; stopTimer(s); ev(el, 'timeupdate'); ev(el, 'pause'); ev(el, 'ended'); return; }
      ev(el, 'timeupdate');
    }, 50);
    setTimeout(function () { if (s.playing) ev(el, 'playing'); }, 0);
    return Promise.resolve();
  };
  P.pause = function () { var s = st(this); if (s.playing) { s.playing = false; stopTimer(s); ev(this, 'pause'); } };
  Object.defineProperty(P, 'paused', { configurable: true, get: function () { return !st(this).playing; } });
  Object.defineProperty(P, 'ended', { configurable: true, get: function () { return st(this).ended; } });
  Object.defineProperty(P, 'currentTime', { configurable: true,
    get: function () { var s = st(this), src = this.currentSrc || this.src; return s.src === src ? s.pos : 0; },
    set: function (v) { var s = st(this); s.pos = +v || 0; s.ended = false; } });

  /* ---------- speech synthesis mock ---------- */
  if ('speechSynthesis' in window) {
    var q = [], speaking = false, cur = null, tm = 0;
    var SS = window.speechSynthesis;
    function next() {
      if (speaking || !q.length) return; cur = q.shift(); speaking = true; Y.spoken.push(String(cur.text));
      try { cur.onstart && cur.onstart(new Event('start')); } catch (e) {}
      tm = setTimeout(function () { var u = cur; speaking = false; cur = null; try { u.onend && u.onend(new Event('end')); } catch (e) {} next(); }, 80 + 45 * String(cur.text).length);
    }
    var fake = {
      speak: function (u) { q.push(u); next(); },
      cancel: function () { q = []; if (cur) { clearTimeout(tm); speaking = false; cur = null; } },
      pause: function () {}, resume: function () {},
      getVoices: function () { return []; },
      addEventListener: function () {}, removeEventListener: function () {}
    };
    Object.defineProperty(fake, 'speaking', { get: function () { return speaking; } });
    Object.defineProperty(fake, 'pending', { get: function () { return q.length > 0; } });
    try { Object.defineProperty(window, 'speechSynthesis', { configurable: true, get: function () { return fake; } }); } catch (e) {}
  }
  try { navigator.vibrate = function () { return true; }; } catch (e) {}
})();
