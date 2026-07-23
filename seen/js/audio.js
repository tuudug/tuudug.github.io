/* ============================================================
   SEEN — audio synth (WebAudio, zero assets)
   ============================================================ */
window.SEEN_AUDIO = (function () {
  let ctx = null, master = null, muted = false;
  let heartTimer = null, droneNodes = null, ringTimer = null;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      return true;
    } catch (e) { return false; }
  }
  function now() { return ctx ? ctx.currentTime : 0; }
  function env(g, t0, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  }
  function noiseBuffer(sec) {
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  /* ---- UI sounds ---- */
  function typeTick() {
    if (!ensure() || muted) return;
    const t = now(), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = 1700 + Math.random() * 600;
    env(g, t, 0.003, 0.04, 0.028);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.05);
  }

  function send() {
    if (!ensure() || muted) return;
    const t = now(), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(740, t);
    o.frequency.exponentialRampToValueAtTime(1180, t + 0.09);
    env(g, t, 0.008, 0.14, 0.12);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.16);
  }

  function receive() {
    if (!ensure() || muted) return;
    const t = now();
    [0, 0.12].forEach(off => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(1320, t + off);
      o.frequency.exponentialRampToValueAtTime(880, t + off + 0.08);
      env(g, t + off, 0.006, 0.12, 0.1);
      o.connect(g).connect(master); o.start(t + off); o.stop(t + off + 0.14);
    });
    vibrate(35);
  }

  function banner() {
    if (!ensure() || muted) return;
    const t = now();
    [880, 1174, 1568].forEach((fr, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = fr;
      env(g, t + i * 0.09, 0.008, 0.09, 0.16);
      o.connect(g).connect(master); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.22);
    });
    vibrate(25);
  }

  /* ---- horror kit ---- */
  function staticBurst(sec, vol) {
    if (!ensure() || muted) return;
    sec = sec || 0.4; vol = vol == null ? 0.22 : vol;
    const t = now(), src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    src.buffer = noiseBuffer(sec + 0.1);
    f.type = 'bandpass'; f.frequency.value = 1600; f.Q.value = 0.6;
    env(g, t, 0.01, vol, sec);
    src.connect(f).connect(g).connect(master);
    src.start(t); src.stop(t + sec + 0.1);
    vibrate([20, 30, 20]);
  }

  function knock(n, gap) {
    if (!ensure() || muted) return;
    n = n || 3; gap = gap || 0.34;
    const t0 = now();
    for (let i = 0; i < n; i++) {
      const t = t0 + i * gap;
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      const src = ctx.createBufferSource(), ng = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(96, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.16);
      env(g, t, 0.004, 0.85, 0.22);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.3);
      // knuckle texture
      src.buffer = noiseBuffer(0.06);
      f.type = 'lowpass'; f.frequency.value = 420;
      env(ng, t, 0.002, 0.4, 0.05);
      src.connect(f).connect(ng).connect(master);
      src.start(t); src.stop(t + 0.08);
    }
    vibrate([60, 120, 60, 120, 60]);
  }

  function heartbeat(on, intervalMs) {
    if (!ensure()) return;
    stopHeartbeat();
    if (!on || muted) return;
    const beat = () => {
      if (muted) return;
      const t = now();
      [[0, 0.5], [0.18, 0.3]].forEach(([off, v]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(58, t + off);
        o.frequency.exponentialRampToValueAtTime(34, t + off + 0.14);
        env(g, t + off, 0.01, v, 0.2);
        o.connect(g).connect(master); o.start(t + off); o.stop(t + off + 0.32);
      });
    };
    beat();
    heartTimer = setInterval(beat, intervalMs || 950);
    return heartTimer;
  }
  function stopHeartbeat() { if (heartTimer) { clearInterval(heartTimer); heartTimer = null; } }

  function drone(on) {
    if (!ensure()) return;
    stopDrone();
    if (!on || muted) return;
    const t = now();
    const g = ctx.createGain(); g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.16, t + 3);
    const oscs = [36, 36.7, 73].map(fr => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 130;
      o.connect(f).connect(g); o.start(t); return o;
    });
    g.connect(master);
    droneNodes = { oscs, g };
  }
  function stopDrone() {
    if (!droneNodes) return;
    try {
      droneNodes.g.gain.exponentialRampToValueAtTime(0.0001, now() + 0.4);
      droneNodes.oscs.forEach(o => o.stop(now() + 0.6));
    } catch (e) {}
    droneNodes = null;
  }

  function ringStart() {
    if (!ensure()) return;
    ringStop();
    const seq = () => {
      if (muted) { vibrate([400, 200, 400]); return; }
      const t = now();
      [0, 0.28].forEach(off => {
        [1318, 1046].forEach((fr, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine'; o.frequency.value = fr;
          env(g, t + off + i * 0.12, 0.01, 0.1, 0.22);
          o.connect(g).connect(master);
          o.start(t + off + i * 0.12); o.stop(t + off + i * 0.12 + 0.3);
        });
      });
      vibrate([380, 120, 380]);
    };
    seq();
    ringTimer = setInterval(seq, 1600);
  }
  function ringStop() { if (ringTimer) { clearInterval(ringTimer); ringTimer = null; } }

  function callStatic(on) {
    if (!ensure()) return null;
    if (!on) return null;
    const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    src.buffer = noiseBuffer(4); src.loop = true;
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.4;
    g.gain.value = muted ? 0 : 0.06;
    src.connect(f).connect(g).connect(master);
    src.start();
    return { stop() { try { src.stop(); } catch (e) {} } };
  }

  /* flat phone-speaker whisper — the PHONE says it, so robotic is a feature.
     resolves true only if speech actually finished — callers can show a
     transcript fallback when TTS is missing, muted, or silently broken. */
  function whisper(text) {
    return new Promise(res => {
      let done = false;
      const finish = ok => { if (!done) { done = true; res(!!ok); } };
      const guard = setTimeout(() => finish(false), 4200);
      try {
        if (!('speechSynthesis' in window) || muted) return finish(false);
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.62; u.pitch = 0.05; u.volume = 0.85;
        const vs = speechSynthesis.getVoices();
        const v = vs.find(v => /en(-|_)/i.test(v.lang) && /female|samantha|zira|serena/i.test(v.name)) ||
                  vs.find(v => /en(-|_)/i.test(v.lang));
        if (v) u.voice = v;
        u.onend = () => { clearTimeout(guard); finish(true); };
        u.onerror = () => { clearTimeout(guard); finish(false); };
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch (e) { finish(false); }
    });
  }

  function setMuted(m) {
    muted = m;
    if (m) { stopHeartbeat(); ringStop(); stopDrone(); try { speechSynthesis.cancel(); } catch (e) {} }
    if (master) master.gain.value = m ? 0 : 0.9;
  }

  return {
    ensure, send, receive, banner, staticBurst, knock, typeTick,
    heartbeat, stopHeartbeat, drone, stopDrone,
    ringStart, ringStop, callStatic, whisper,
    setMuted, get muted() { return muted; },
    vibrate
  };
})();
