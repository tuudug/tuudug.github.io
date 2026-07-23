/* ============================================================
   SEEN — engine. runs the script, corrupts the phone, watches you.
   ============================================================ */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const phone = $('phone'), screenEl = $('screen'), msgEl = $('messages'),
        choicesEl = $('choices'), ibInput = $('ibInput'), ibSend = $('ibSend'),
        chName = $('chName'), chPresence = $('chPresence'), chAvatar = $('chAvatar'),
        sbTime = $('sbTime'), sbNet = $('sbNet'), sbBatt = $('sbBatt'), sbBattFill = $('sbBattFill'),
        noise = $('noise'), blackout = $('blackout'), flash = $('flash'),
        callEl = $('callscreen'), csName = $('csName'), csSub = $('csSub'),
        csWave = $('csWave'), csCaption = $('csCaption'), csAvatar = $('csAvatar'),
        csButtons = $('csButtons'), csDecline = $('csDecline'), csAnswer = $('csAnswer'),
        endcard = $('endcard'), muteBtn = $('muteBtn'),
        tjEl = $('timejump'), tjLabel = $('tjLabel'), tjDay = $('tjDay'), tjTime = $('tjTime');

  const A = window.SEEN_AUDIO;
  const REPLAY = (() => { try { return !!localStorage.getItem('seen_done'); } catch (e) { return false; } })();
  const HASH = location.hash;
  const TEST = HASH.indexOf('#test') === 0;
  const SEEK = (() => { const m = HASH.match(/seek=(\d+)/); return m ? +m[1] : null; })();
  const CALLTEST = HASH.indexOf('callscreen') !== -1;
  let INSTANT = false;
  const SPEED = TEST ? 5 : 1;
  if (TEST) { // debug/screenshot mode: kill entry animations so frames render settled
    const st = document.createElement('style');
    st.textContent = '.msg,.choice,.daystamp,.sysline,.typing{animation:none!important}' +
                     '#timejump{transition:none!important}';
    document.head.appendChild(st);
  }

  const S = {
    act: 0,
    battery: 23,
    clockMode: 'live',      // live | flicker | stuck
    clockStuck: '03:33',
    fict: 23 * 60 + 41,     // fictional story clock — Tuesday, 23:41
    bumpN: 0,               // half-speed clock: +1 min every 2nd bubble
    metaArmed: false,
    metaCount: 0,
    lastMeTicks: null,
    lastDay: null,          // most recent daystamp el — corruptday rewrites it
    dead: false
  };

  const sleep = ms => INSTANT ? Promise.resolve() : new Promise(r => setTimeout(r, ms / SPEED));
  const jit = (ms, j) => ms + Math.random() * (j || 250);
  function fmt(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    return String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
  }
  function storyTime() { return S.clockMode === 'stuck' ? S.clockStuck : fmt(S.fict); }
  function bumpClock() {
    // every other bubble — a bump per message raced act 0 past midnight
    // before her "it's almost midnight" line
    if (S.clockMode === 'stuck') return;
    S.bumpN = (S.bumpN + 1) % 2;
    if (S.bumpN === 0) { S.fict++; renderClock(); }
  }
  function fill(t) {
    return String(t).replace(/\{\{battery\}\}/g, S.battery).replace(/\{\{time\}\}/g, sbTime.textContent);
  }
  function scrollBottom() {
    requestAnimationFrame(() => msgEl.scrollTo({ top: msgEl.scrollHeight, behavior: 'smooth' }));
  }

  /* ================= status bar / clock / battery ================= */
  function renderClock() {
    sbTime.textContent = storyTime();
  }
  setInterval(() => {
    if (S.clockMode === 'flicker' && Math.random() < 0.35) {
      sbTime.textContent = S.clockStuck;
      sbTime.style.color = '#f15c6d';
      setTimeout(() => { sbTime.textContent = fmt(S.fict); sbTime.style.color = ''; }, 900);
    } else renderClock();
  }, 3000);

  function setBattery(v) {
    S.battery = v;
    sbBattFill.style.width = Math.max(v, 3) + '%';
    sbBatt.classList.toggle('low', v <= 20);
  }
  (function initBattery() {
    // fictional battery only — the 23% → 1% arc belongs to the script,
    // never let the real device battery sabotage act 4's dying phone
    setBattery(23);
  })();

  /* ================= noise / glitch fx ================= */
  const nx = noise.getContext('2d');
  let noiseTimer = null;
  function sizeNoise() {
    noise.width = Math.floor(phone.clientWidth / 2);
    noise.height = Math.floor(phone.clientHeight / 2);
    noise.style.imageRendering = 'pixelated';
  }
  function drawNoiseFrame() {
    const img = nx.createImageData(noise.width, noise.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    nx.putImageData(img, 0, 0);
  }
  function noiseOn(opacity) {
    sizeNoise();
    noise.style.opacity = opacity;
    if (!noiseTimer) noiseTimer = setInterval(drawNoiseFrame, 90);
  }
  function noiseOff() {
    noise.style.opacity = 0;
    if (noiseTimer) { clearInterval(noiseTimer); noiseTimer = null; }
  }

  async function glitch(lvl) {
    if (INSTANT) return;
    lvl = lvl || 1;
    if (lvl === 1) {
      phone.classList.add('glitching');
      noiseOn(0.16);
      A.staticBurst(0.28, 0.14);
      await sleep(320);
      phone.classList.remove('glitching');
      noiseOff();
    } else if (lvl === 2) {
      phone.classList.add('glitching', 'slicing');
      noiseOn(0.3);
      A.staticBurst(0.7, 0.26);
      await sleep(240);
      phone.classList.add('invert');
      await sleep(120);
      phone.classList.remove('invert');
      await sleep(420);
      phone.classList.remove('glitching', 'slicing');
      noiseOff();
    } else {
      phone.classList.add('glitching', 'slicing', 'invert');
      noiseOn(0.5);
      A.staticBurst(1.3, 0.4);
      A.vibrate([120, 60, 200]);
      await sleep(300);
      phone.classList.remove('invert');
      flashBlip(0.5);
      await sleep(500);
      phone.classList.add('invert');
      await sleep(140);
      phone.classList.remove('invert', 'glitching', 'slicing');
      await sleep(200);
      noiseOff();
    }
  }
  function flashBlip(op) {
    flash.style.transition = 'none';
    flash.style.opacity = op || 0.7;
    requestAnimationFrame(() => {
      flash.style.transition = 'opacity .5s';
      flash.style.opacity = 0;
    });
  }

  /* ================= chat primitives ================= */
  function setPresence(txt, bad) {
    chPresence.textContent = txt;
    chPresence.classList.toggle('online', txt === 'online' && !bad);
    chPresence.classList.toggle('bad', !!bad);
  }
  function setName(n) { chName.textContent = n; }

  /* flips the last outgoing ticks to read. returns true only when it
     actually changed — callers use that to insert the "she just read it"
     beat without slowing every consecutive her-message. */
  function markRead() {
    if (S.lastMeTicks && !S.lastMeTicks.classList.contains('read')) {
      S.lastMeTicks.classList.add('read');
      return true;
    }
    return false;
  }

  function bubble(cls) {
    const b = document.createElement('div');
    b.className = 'msg ' + cls;
    msgEl.appendChild(b);
    scrollBottom();
    return b;
  }
  function metaHTML(read) {
    return `<span class="meta">${storyTime()}${read ? ' <span class="ticks">' + window.SEEN_ICONS.ticks(16) + '</span>' : ''}</span>`;
  }

  async function addMe(text, opts) {
    opts = opts || {};
    const b = bubble('me');
    if (opts.launched) b.classList.add('launched');
    b.innerHTML = `<span class="txt"></span>${metaHTML(true)}`;
    b.querySelector('.txt').textContent = text;
    S.lastMeTicks = b.querySelector('.ticks');
    bumpClock();
    A.send();
    scrollBottom();
    if (opts.corrupt) {
      b.classList.add('corrupt');
      await sleep(1200);
      b.classList.remove('corrupt');
    }
    return b;
  }

  async function addHer(text, opts) {
    opts = opts || {};
    if (INSTANT) {
      markRead();
      const bb = bubble('her');
      bb.innerHTML = `<span class="txt"></span>${metaHTML(false)}`;
      bb.querySelector('.txt').textContent = fill(text);
      scrollBottom();
      return bb;
    }
    // she reads you first — ticks flip blue, a beat, THEN the typing starts
    if (markRead()) await sleep(jit(450, 250));
    const tp = document.createElement('div');
    tp.className = 'typing';
    tp.innerHTML = '<i></i><i></i><i></i>';
    msgEl.appendChild(tp);
    const prev = chPresence.dataset.prev || chPresence.textContent;
    if (!chPresence.classList.contains('bad')) setPresence('typing…');
    scrollBottom();
    A.vibrate(10);
    const dur = Math.min(750 + text.length * 26, 2400);
    await sleep(jit(dur, 350));
    tp.remove();
    if (!chPresence.classList.contains('bad')) setPresence(prev === 'typing…' ? 'online' : prev);

    A.receive();
    const b = bubble('her');
    b.innerHTML = `<span class="txt"></span>${metaHTML(false)}`;
    b.querySelector('.txt').textContent = fill(text);
    bumpClock();
    if (opts.corrupt) { b.classList.add('corrupt'); setTimeout(() => b.classList.remove('corrupt'), 1600); }
    scrollBottom();
    await sleep(jit(opts.p != null ? opts.p : 750, 300));
    return b;
  }

  function addSys(text, bad) {
    const d = document.createElement('div');
    d.className = 'sysline' + (bad ? ' bad' : '');
    d.textContent = fill(text);
    msgEl.appendChild(d);
    scrollBottom();
  }
  function addDay(text, wrong, jump) {
    const d = document.createElement('div');
    d.className = 'daystamp' + (wrong ? ' wrong' : '') + (jump ? ' jump' : '');
    d.textContent = text;
    msgEl.appendChild(d);
    S.lastDay = d;
    scrollBottom();
    return d;
  }

  /* ================= time jump — the scene break happens under cover =================
     one atomic transition: fade the card in, swap act/clock/battery/title while
     the screen is covered, drop the transcript divider, fade back. no more
     status bar contradicting the chat mid-scene. */
  function applyAct(n) {
    S.act = n;
    document.body.dataset.act = n;
    if (n === 2) S.clockMode = 'flicker';
    if (n >= 3) S.clockMode = 'stuck';
    if (n >= 2) S.metaArmed = true;   // she notices you leaving from friday on
    if (n === 4) sbNet.textContent = 'No Service';
  }
  async function runTimejump(step) {
    const apply = () => {
      if (step.act != null) applyAct(step.act);
      if (step.t) {
        const [hh, mm] = step.t.split(':').map(Number);
        S.fict = hh * 60 + mm;
        S.bumpN = 0;
      }
      if (step.battery != null) setBattery(step.battery);
      if (step.title) document.title = step.title;
      renderClock();
    };
    if (INSTANT) { apply(); addDay(step.stamp, false, true); return; }
    await sleep(700);                    // let the last beat land
    tjLabel.textContent = step.label || '';
    tjDay.textContent = step.day || '';
    tjTime.textContent = step.t || '';
    tjEl.classList.add('on');
    await sleep(450);                    // fade-in completes under this
    apply();                             // atomic swap while covered
    await sleep(1100);                   // readable hold
    addDay(step.stamp, false, true);     // divider is already there when we return
    tjEl.classList.remove('on');
    await sleep(450);                    // fade-out
    await sleep(250);
  }

  /* ================= choices ================= */
  function scrambleInto(el, target, dur) {
    return new Promise(res => {
      const chars = '!<>-_\\/[]{}—=+*^?#______♡';
      const t0 = Date.now();
      (function frame() {
        const p = Math.min((Date.now() - t0) / (dur / SPEED), 1);
        const n = Math.floor(p * target.length);
        let out = target.slice(0, n);
        for (let i = n; i < target.length; i++) {
          out += target[i] === ' ' ? ' ' : chars[Math.random() * chars.length | 0];
        }
        el.textContent = out;
        if (p < 1) setTimeout(frame, 42); else res();
      })();
    });
  }

  /* type the chosen reply into the input bar, keystroke by keystroke */
  async function typeIntoInput(text) {
    ibInput.disabled = false;
    ibInput.readOnly = true;
    ibInput.classList.add('live');
    ibInput.value = '';
    try { ibInput.focus({ preventScroll: true }); } catch (e) {}
    const per = Math.max(26, Math.min(70, 1500 / Math.max(text.length, 1)));
    for (let i = 1; i <= text.length; i++) {
      ibInput.value = text.slice(0, i);
      A.typeTick();
      await sleep(per);
    }
    await sleep(280);
  }
  function scrambleInputValue(target, dur) {
    return new Promise(res => {
      const chars = '!<>-_\\/[]{}—=+*^?#______♡';
      const t0 = Date.now();
      (function frame() {
        const p = Math.min((Date.now() - t0) / (dur / SPEED), 1);
        const n = Math.floor(p * target.length);
        let out = target.slice(0, n);
        for (let i = n; i < target.length; i++) {
          out += target[i] === ' ' ? ' ' : chars[Math.random() * chars.length | 0];
        }
        ibInput.value = out;
        if (p < 1) setTimeout(frame, 46); else res();
      })();
    });
  }
  function clearInputField() {
    ibInput.classList.add('sending');
    setTimeout(() => {
      ibInput.value = '';
      ibInput.classList.remove('live', 'sending');
      ibInput.readOnly = false;
      ibInput.disabled = true;
      ibInput.blur();
    }, 140 / SPEED);
  }

  /* resolves with the picked opt so exec can play its `re` reaction lines */
  function runChoice(step) {
    if (INSTANT) {
      const o = step.opts[0];
      if (step.action || o.action) return Promise.resolve(o);
      const lbl = (REPLAY && o.alt) ? o.alt : o.label;
      return addMe(o.sends || lbl).then(() => o);
    }
    return new Promise(resolve => {
      choicesEl.innerHTML = '';
      choicesEl.classList.add('on');
      // act 0 stays sweet: no countdown, no heartbeat — the dread earns its way in from act 1
      const timed = S.act >= 1;
      const LIMIT = step.t || 7000;
      let picked = false;
      const t0 = Date.now();
      let tick = null;

      step.opts.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice' + (step.doom ? ' doom' : '');
        btn.textContent = (REPLAY && o.alt) ? o.alt : o.label;
        btn.style.animationDelay = (i * 0.12) + 's';
        btn.onclick = () => select(o);
        choicesEl.appendChild(btn);
      });

      if (timed) {
        // countdown bar — she hates waiting
        const bar = document.createElement('div');
        bar.id = 'choiceTimer';
        bar.innerHTML = '<i></i>';
        const barFill = bar.firstChild;
        if (step.doom) A.heartbeat(true, 1050); // only doom choices start loud
        tick = setInterval(() => {
          const p = (Date.now() - t0) / LIMIT;
          barFill.style.width = Math.max(0, 100 - p * 100) + '%';
          if (p > 0.62 && !bar.classList.contains('late')) {
            bar.classList.add('late');
            A.heartbeat(true, 460); // panic tempo
          }
          if (p >= 1) select(step.opts[0]); // timeout auto-picks opts[0] — keep the passive option first
        }, 100);
        choicesEl.appendChild(bar);
      }
      if (TEST) setTimeout(() => { const b = choicesEl.querySelector('.choice'); if (b) b.click(); }, 300);
      scrollBottom();

      async function select(o) {
        if (picked) return;
        picked = true;
        if (tick) clearInterval(tick);
        A.stopHeartbeat();
        choicesEl.classList.remove('on');
        choicesEl.innerHTML = '';
        const label = (REPLAY && o.alt) ? o.alt : o.label;
        if (step.action || o.action) {         // an action, not a message
          await sleep(420);
          resolve(o);
          return;
        }
        const sends = o.sends || label;
        const rewritten = sends !== label;
        await typeIntoInput(label);            // watch yourself type it
        if (rewritten) {
          await glitch(step.glitch || 1);      // …then the phone disagrees
          await scrambleInputValue(sends, 620);
          await sleep(650);
        } else {
          await sleep(320);
        }
        clearInputField();
        await addMe(sends, { launched: true, corrupt: rewritten });
        await sleep(jit(500, 250));
        resolve(o);
      }
    });
  }

  /* free-input moment: whatever you type betrays you */
  function runInput(step) {
    if (INSTANT) return addMe(step.sends).then(() => {});
    return new Promise(resolve => {
      ibInput.disabled = false;
      ibInput.placeholder = 'Message';
      ibSend.hidden = false;
      ibInput.focus();
      let done = false, typed = '';
      ibInput.addEventListener('input', () => { typed = ibInput.value; });
      const finish = async () => {
        if (done) return; done = true;
        ibInput.disabled = true;
        ibSend.hidden = true;
        const theirs = typed.trim() || 'ok';
        ibInput.value = '';
        const b = await addMe(theirs);
        await sleep(900);
        await glitch(step.glitch || 2);
        await scrambleInto(b.querySelector('.txt'), step.sends, 700);
        b.classList.add('corrupt');
        setTimeout(() => b.classList.remove('corrupt'), 1500);
        await sleep(700);
        resolve();
      };
      ibSend.onclick = finish;
      ibInput.onkeydown = e => { if (e.key === 'Enter') finish(); };
      setTimeout(finish, TEST ? 700 : 15000); // she gets impatient
    });
  }

  /* ================= recall (she deletes a message) ================= */
  async function runRecall(step) {
    const b = await addHer(step.t, { p: 300 });
    await sleep(1500);
    b.classList.add('recalled');
    b.innerHTML = 'This message was deleted';
    A.vibrate(25);
    await sleep(jit(900, 300));
  }

  /* ================= call sequence ================= */
  function runCall(step) {
    if (INSTANT) return Promise.resolve();
    return new Promise(resolve => {
      callEl.hidden = false;
      callEl.classList.add('ringing');
      csButtons.style.display = 'flex';
      csWave.hidden = true;
      csCaption.textContent = '';
      csSub.className = 'cs-sub';
      csSub.textContent = 'mobile';
      A.ringStart();

      // she doesn't accept "ignore" — the call answers itself eventually
      const autoAnswer = setTimeout(() => csAnswer.click(), 14000);

      let declined = false;
      csDecline.onclick = async () => {
        if (declined) return;
        declined = true;
        glitch(1);
        csDecline.classList.add('dodged');
        csSub.textContent = 'don’t.';
        csSub.classList.add('bad');
        setTimeout(() => { if (!csWave.hidden) return; csSub.classList.remove('bad'); csSub.textContent = 'mobile'; }, 1600);
      };

      if (TEST) setTimeout(() => csAnswer.click(), 900);
      csAnswer.onclick = async () => {
        clearTimeout(autoAnswer);
        A.ringStop();
        callEl.classList.remove('ringing');
        csButtons.style.display = 'none';
        csWave.hidden = false;
        csSub.classList.remove('bad');
        const t0 = Date.now();
        const timer = setInterval(() => {
          const s = Math.floor((Date.now() - t0) / 1000);
          csSub.textContent = '0' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        }, 1000);
        const staticFx = A.callStatic(true);
        await sleep(1200);
        for (const cap of step.captions) {
          await scrambleInto(csCaption, cap, 500);
          if (/[a-z]/i.test(cap)) await A.whisper(cap);
          else await sleep(1900);
          await sleep(500);
        }
        csCaption.textContent = '';
        csSub.textContent = 'call ended';
        clearInterval(timer);
        if (staticFx) staticFx.stop();
        A.vibrate(15);
        await sleep(1600);
        callEl.hidden = true;
        resolve();
      };
    });
  }

  /* ================= meta: she notices when you leave ================= */
  // queued, not fired inline — a meta line mid-choice/mid-call would
  // interleave with the main loop (double typing indicators, presence races).
  // the run loop drains this between steps instead.
  const metaQueue = [];
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !S.metaArmed || S.dead) return;
    if (S.metaCount >= window.SEEN_META_LINES.length) return;
    metaQueue.push(window.SEEN_META_LINES[S.metaCount++]);
  });
  async function drainMeta() {
    while (metaQueue.length && !S.dead) {
      const line = metaQueue.shift();
      await sleep(600);
      await glitch(1);
      await addHer(line, { corrupt: true });
    }
  }
  // title tease when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && S.metaArmed && !S.dead) document.title = 'come back ♡';
    else if (!S.dead && S.act >= 2) document.title = S.act >= 3 ? "don't look" : 'Mira ♡';
  });

  /* ================= voice note ================= */
  const PLAY_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><polygon points="7 4 20 12 7 20 7 4"/></svg>';
  const MSG_ICON_SVG = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  async function addVoiceNote(step) {
    if (!INSTANT) {
      if (markRead()) await sleep(jit(450, 250)); // read first, then she records
      const tp = document.createElement('div');
      tp.className = 'typing';
      tp.innerHTML = '<i></i><i></i><i></i>';
      msgEl.appendChild(tp);
      scrollBottom();
      await sleep(jit(1700, 400));
      tp.remove();
    } else markRead();
    if (!INSTANT) A.receive();
    const b = bubble('her');
    const bars = Array.from({ length: 26 }, (_, i) =>
      `<i style="height:${18 + Math.abs(Math.sin(i * 1.63 + 0.7)) * 78 | 0}%"></i>`).join('');
    b.innerHTML = `<div class="vn"><span class="vn-play">${PLAY_SVG}</span><span class="vn-bars">${bars}</span><span class="vn-dur">${step.dur || '0:07'}</span></div>${metaHTML(false)}`;
    scrollBottom();
    if (INSTANT) return;
    await sleep(1400);
    const vn = b.querySelector('.vn');
    vn.classList.add('playing');
    A.staticBurst(1.1, 0.16);
    const line = step.say || 'look at the door';
    const spoken = await A.whisper(line);
    vn.classList.remove('playing');
    if (!spoken) {
      // TTS failed or muted — the line is plot-critical, surface a transcript
      const tx = document.createElement('span');
      tx.className = 'vn-tx';
      b.appendChild(tx);
      await scrambleInto(tx, '\u201C' + line + '\u201D', 420);
      scrollBottom();
    }
    await sleep(700);
  }

  /* ================= playlist embed (she made you something ♡) ================= */
  const SP_PLAY_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><polygon points="7 4 20 12 7 20 7 4"/></svg>';

  async function addPlaylist(step) {
    if (!INSTANT) {
      if (markRead()) await sleep(jit(450, 250)); // read first, then she shares
      const tp = document.createElement('div');
      tp.className = 'typing';
      tp.innerHTML = '<i></i><i></i><i></i>';
      msgEl.appendChild(tp);
      scrollBottom();
      await sleep(jit(1600, 400));
      tp.remove();
    } else markRead();
    if (!INSTANT) A.receive();
    const b = bubble('her embed');
    const rows = step.tracks.map((t, i) => {
      const n = i + 1, live = step.playing === n;
      return `<div class="sp-track${live ? ' playing' : ''}">` +
        `<span class="sp-num">${live ? '<span class="sp-eq"><i></i><i></i><i></i></span>' : n}</span>` +
        `<span class="sp-tmeta"><span class="sp-tname"></span><span class="sp-tartist"></span></span>` +
        `<span class="sp-tlen">${t.len}</span></div>`;
    }).join('');
    b.innerHTML = `<div class="sp-embed${step.playing ? ' live' : ''}">` +
      `<div class="sp-head"><span class="sp-cover">♡</span>` +
      `<span class="sp-headmeta"><span class="sp-title"></span><span class="sp-sub"></span></span>` +
      `<span class="sp-playbtn">${SP_PLAY_SVG}</span></div>` +
      `<div class="sp-tracks">${rows}</div></div>${metaHTML(false)}`;
    b.querySelector('.sp-title').textContent = step.title;
    b.querySelector('.sp-sub').textContent = step.sub;
    b.querySelectorAll('.sp-tname').forEach((el, i) => { el.textContent = step.tracks[i].name; });
    b.querySelectorAll('.sp-tartist').forEach((el, i) => { el.textContent = step.tracks[i].artist; });
    bumpClock();
    scrollBottom();
    if (!INSTANT) await sleep(jit(1200, 300));
  }

  /* ================= notification banners (you can't open them) ================= */
  async function showNotif(step) {
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `<div class="n-app"><span class="ln-icon">${MSG_ICON_SVG}</span> MESSAGES · now</div><div class="n-from"></div><div class="n-text"></div>`;
    n.querySelector('.n-from').textContent = step.from;
    n.querySelector('.n-text').textContent = step.text;
    screenEl.appendChild(n);
    if (!INSTANT) A.banner();
    requestAnimationFrame(() => n.classList.add('show'));
    await sleep(4400);
    n.classList.remove('show');
    await sleep(600);
    n.remove();
  }

  /* ================= glitch storm — the chat turns against itself ================= */
  async function runStorm() {
    if (INSTANT) return;
    const txts = Array.from(msgEl.querySelectorAll('.msg .txt'));
    const originals = txts.map(t => t.textContent);
    noiseOn(0.32);
    A.staticBurst(2.2, 0.3);
    phone.classList.add('glitching');
    // her name strobes
    const strobes = ['YOURS ♡', 'MIRA', 'mira', 'YOURS ♡', 'M̸I̸R̸A̸', 'yours'];
    let ni = 0;
    const strobe = setInterval(() => { chName.textContent = strobes[ni++ % strobes.length]; }, 210);
    // every message she ever sent decays into ♡
    for (let round = 0; round < 12; round++) {
      const i = Math.floor(Math.random() * txts.length);
      if (txts[i]) {
        txts[i].closest('.msg').classList.add('corrupt');
        scrambleInto(txts[i], originals[i].split('').map(c => Math.random() < 0.6 ? '♡' : c).join(''), 420);
      }
      if (round === 5) { phone.classList.add('invert'); await sleep(120); phone.classList.remove('invert'); }
      await sleep(640);
    }
    clearInterval(strobe);
    chName.textContent = 'YOURS ♡';
    phone.classList.remove('glitching');
    noiseOff();
  }

  /* ================= earlier messages — pull down if you must =================
     the thread has a past. available only at the very top of act 0, before the
     player's first reply exists — answer her and the moment is gone. one-shot.
     static history: rendered directly (never through addHer/addMe) so it can't
     touch the story clock, read-ticks state, or the running step loop. */
  const histPull = $('histPull'), histTxt = histPull.querySelector('.hp-txt');
  const HIST = { used: false, acc: 0, decay: null };
  const PULL_WHEEL = 130, PULL_TOUCH = 90;

  function histEligible() {
    return !HIST.used && S.act === 0 && !S.dead &&
           window.SEEN_HISTORY && !msgEl.querySelector('.msg.me');
  }
  function renderHistory() {
    const frag = document.createDocumentFragment();
    const tick = '<span class="ticks read">' + window.SEEN_ICONS.ticks(16) + '</span>';
    for (const it of window.SEEN_HISTORY) {
      const el = document.createElement('div');
      if (it.k === 'day') { el.className = 'daystamp old'; el.textContent = it.t; }
      else if (it.k === 'sys') { el.className = 'sysline old' + (it.bad ? ' bad' : ''); el.textContent = it.t; }
      else if (it.k === 'recalled') { el.className = 'msg her recalled old'; el.textContent = 'This message was deleted'; }
      else {
        el.className = 'msg ' + it.k + ' old';
        el.innerHTML = `<span class="txt"></span><span class="meta">${it.time}${it.k === 'me' ? ' ' + tick : ''}</span>`;
        el.querySelector('.txt').textContent = it.t;
      }
      frag.appendChild(el);
    }
    // prepend above the Tuesday divider, keep the viewport anchored
    const beforeH = msgEl.scrollHeight;
    msgEl.insertBefore(frag, msgEl.firstChild);
    msgEl.scrollTop += msgEl.scrollHeight - beforeH;
  }
  function histShow(p) {
    histPull.hidden = false;
    histPull.style.opacity = Math.min(p * 1.4, 1);
    histPull.style.transform = 'translate(-50%,' + Math.min(p, 1) * 10 + 'px)';
    histTxt.textContent = p >= 1 ? 'release to load earlier messages' : 'pull to load earlier messages';
    histPull.classList.toggle('ready', p >= 1);
  }
  function histHide() {
    HIST.acc = 0;
    clearTimeout(HIST.decay);
    if (HIST.used) return; // the load sequence owns the pill now
    histPull.style.opacity = 0;
    histPull.classList.remove('ready');
    setTimeout(() => { if (!HIST.used) histPull.hidden = true; }, 260);
  }
  async function histLoad() {
    if (HIST.used) return;
    HIST.used = true;
    clearTimeout(HIST.decay);
    histPull.hidden = false;
    histPull.classList.remove('ready');
    histPull.classList.add('loading');
    histPull.style.opacity = 1;
    histPull.style.transform = 'translate(-50%,10px)';
    histTxt.textContent = 'loading earlier messages…';
    await sleep(1050);
    renderHistory();
    A.staticBurst(0.2, 0.08);
    A.vibrate(10);
    histPull.classList.remove('loading');
    histTxt.textContent = 'chat history restored';
    await sleep(700);
    histPull.classList.add('bad');
    await scrambleInto(histTxt, 'no more. don’t dig ♡', 460);
    await sleep(1500);
    histPull.style.opacity = 0;
    await sleep(400);
    histPull.remove();
  }
  // wheel: overscroll at the top accumulates, decays when you give up
  msgEl.addEventListener('wheel', e => {
    if (!histEligible()) return;
    if (msgEl.scrollTop > 0) { if (HIST.acc) histHide(); return; }
    if (e.deltaY < 0) {
      HIST.acc += -e.deltaY;
      histShow(HIST.acc / PULL_WHEEL);
      clearTimeout(HIST.decay);
      if (HIST.acc >= PULL_WHEEL) histLoad();
      else HIST.decay = setTimeout(histHide, 550);
    } else if (HIST.acc) histHide();
  }, { passive: true });
  // touch: classic pull-to-refresh, triggers on release
  let tStartY = null, tDy = 0;
  msgEl.addEventListener('touchstart', e => {
    tDy = 0;
    tStartY = (histEligible() && msgEl.scrollTop <= 0) ? e.touches[0].clientY : null;
  }, { passive: true });
  msgEl.addEventListener('touchmove', e => {
    if (tStartY == null || !histEligible()) return;
    if (msgEl.scrollTop > 0) { tStartY = null; histHide(); return; }
    const dy = e.touches[0].clientY - tStartY;
    if (dy > 6) {
      tDy = dy;
      e.preventDefault(); // we rubber-band, not the browser
      histShow(dy / PULL_TOUCH);
    } else if (tDy) { tDy = 0; histHide(); }
  }, { passive: false });
  msgEl.addEventListener('touchend', () => {
    if (tStartY == null) return;
    tStartY = null;
    if (histEligible() && tDy >= PULL_TOUCH) histLoad();
    else histHide();
  });
  // mouse: click-drag the thread down — a fake phone should pull like one.
  // pointerType-gated so touch stays with the handlers above.
  let mStartY = null, mDy = 0;
  msgEl.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    mDy = 0;
    if (histEligible() && msgEl.scrollTop <= 0) {
      mStartY = e.clientY;
      e.preventDefault(); // suppresses text selection while pulling
    } else mStartY = null;
  });
  window.addEventListener('pointermove', e => {
    if (mStartY == null || e.pointerType === 'touch') return;
    if (!histEligible()) { mStartY = null; histHide(); return; }
    const dy = e.clientY - mStartY;
    if (dy > 6) { mDy = dy; histShow(dy / PULL_TOUCH); }
    else if (mDy) { mDy = 0; histHide(); }
  });
  window.addEventListener('pointerup', e => {
    if (mStartY == null || e.pointerType === 'touch') return;
    mStartY = null;
    if (histEligible() && mDy >= PULL_TOUCH) histLoad();
    else histHide();
    mDy = 0;
  });

  /* ================= step executor ================= */
  async function exec(step) {
    switch (step.d) {
      case 'act': applyAct(step.n); break;
      case 'timejump': await runTimejump(step); break;
      case 'corruptday': { // the divider was fine when you looked. then it wasn't
        if (!S.lastDay) break;
        if (INSTANT) { S.lastDay.classList.add('wrong'); S.lastDay.textContent = step.text; break; }
        A.staticBurst(0.3, 0.12);
        S.lastDay.classList.add('wrong');
        await scrambleInto(S.lastDay, step.text, 560);
        await sleep(600);
        break;
      }
      case 'day': addDay(step.text, step.wrong); await sleep(600); break;
      case 'sys': addSys(step.text, step.bad); await sleep(jit(900, 300)); break;
      case 'her': await addHer((REPLAY && step.alt) ? step.alt : step.t, { p: step.p }); break;
      case 'me': await addMe(step.t); await sleep(600); break;
      case 'choice': {
        const picked = await runChoice(step);
        // she reacts to what YOU said — then the script continues anyway.
        // replay labels (alt) carry their own reactions (altRe), so she
        // never answers words the player didn't actually send.
        const re = picked && ((REPLAY && picked.altRe) || picked.re);
        if (Array.isArray(re)) {
          for (const line of re) await addHer(line);
        }
        break;
      }
      case 'input': await runInput(step); break;
      case 'voice': await addVoiceNote(step); break;
      case 'playlist': await addPlaylist(step); break;
      case 'notif': await showNotif(step); break;
      case 'wait': await sleep(step.ms); break;
      case 'typing': {
        const tp = document.createElement('div');
        tp.className = 'typing';
        tp.innerHTML = '<i></i><i></i><i></i>';
        msgEl.appendChild(tp);
        setPresence('typing…');
        scrollBottom();
        await sleep(step.ms);
        tp.remove();
        if (!chPresence.classList.contains('bad')) setPresence('online');
        break;
      }
      case 'glitch': await glitch(step.lvl); break;
      case 'name':
        if (step.presence) setPresence(step.presence, step.presenceBad);
        if (step.to) {
          if (step.to !== 'Mira ♡' && !INSTANT) {
            A.staticBurst(0.25, 0.12);
            await scrambleInto(chName, step.to, 500);
          } else setName(step.to);
        }
        await sleep(700);
        break;
      case 'recall': await runRecall(step); break;
      case 'deleted': { // pre-deleted backlog stubs — she took them back before you opened the app
        for (let i = 0; i < (step.n || 1); i++) {
          const b = bubble('her recalled');
          b.textContent = 'This message was deleted';
          await sleep(150);
        }
        await sleep(600);
        break;
      }
      case 'knock':
        A.knock(3, step.slow ? 0.7 : 0.34);
        await sleep(step.slow ? 2400 : 1400);
        break;
      case 'call': await runCall(step); break;
      case 'battery': setBattery(step.v); await sleep(400); break;
      case 'clock':
        if (step.t) {
          const [hh, mm] = step.t.split(':').map(Number);
          S.fict = hh * 60 + mm;
          renderClock();
        }
        break;
      case 'title': document.title = step.t; break;
      case 'blackout':
        blackout.classList.add('on');
        await sleep(step.ms);
        if (!step.hard) blackout.classList.remove('on');
        await sleep(400);
        break;
      case 'heartbeat': step.on ? A.heartbeat(true) : A.stopHeartbeat(); break;
      case 'drone': step.on ? A.drone(true) : A.stopDrone(); break;
      case 'armMeta': S.metaArmed = true; break;
      case 'storm': await runStorm(); break;
      case 'end': await runEnd(); break;
    }
  }

  async function runEnd() {
    S.dead = true;
    document.title = 'SEEN';
    await sleep(1200);
    endcard.hidden = false;
    try { localStorage.setItem('seen_done', '1'); } catch (e) {}
  }

  /* ================= boot ================= */
  function bootLock() {
    $('lockDate').textContent = 'Tuesday, October 14';
    $('lockTime').textContent = '23:41';
    if (REPLAY) {
      document.querySelector('.ln-text').textContent = 'miss me? ♡';
      document.querySelector('.lock-hint').textContent = 'tap to open (again)';
    }
    const lock = $('lockscreen');
    lock.addEventListener('click', async () => {
      A.ensure();
      A.vibrate(12);
      lock.classList.add('away');
      screenEl.hidden = false;
      renderClock();
      setBattery(S.battery);
      await sleep(900);
      if (REPLAY) await glitch(1);
      run();
    }, { once: true });
    if (TEST && SEEK == null && !CALLTEST) setTimeout(() => lock.click(), 250);
    if (SEEK != null || CALLTEST) lock.style.display = 'none';
    if (SEEK != null) {
      screenEl.hidden = false;
      renderClock();
      run();
    }
    if (CALLTEST) {
      screenEl.hidden = true;
      callEl.hidden = false;
      callEl.classList.add('ringing');
    }
  }

  /* ================= dev jump — triple-tap the top-left of the lock screen =================
     opens an act picker: fast-forwards the script under INSTANT, then plays
     live from there. unlike #seek, nothing freezes. the tap zone swallows its
     clicks so it can't accidentally boot the game. */
  function initJumpMenu() {
    const lock = $('lockscreen');
    let taps = 0, tapTimer = null;
    const zone = document.createElement('div');
    zone.id = 'jumpZone';
    lock.appendChild(zone);
    zone.addEventListener('click', e => {
      e.stopPropagation();
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 900);
      if (taps >= 3) { taps = 0; openJumpMenu(); }
    });

    function jumpPoints() {
      const pts = [{ label: 'ACT 0 · Tuesday · 23:41', i: 0 }];
      let act = 0;
      window.SEEN_STORY.forEach((s, i) => {
        if (s.d === 'timejump') {
          if (s.act != null) act = s.act;
          pts.push({ label: 'ACT ' + act + ' · ' + s.stamp, i });
        } else if (s.d === 'act' && s.n === 4) {
          pts.push({ label: 'ACT 4 · inside', i });
        }
      });
      return pts;
    }
    function openJumpMenu() {
      if ($('jumpmenu')) return;
      const m = document.createElement('div');
      m.id = 'jumpmenu';
      m.addEventListener('click', e => e.stopPropagation());
      const h = document.createElement('div');
      h.className = 'jm-title';
      h.textContent = 'JUMP · dev';
      m.appendChild(h);
      jumpPoints().forEach(p => {
        const b = document.createElement('button');
        b.className = 'jm-btn';
        b.textContent = p.label;
        b.onclick = () => { m.remove(); startJump(p.i); };
        m.appendChild(b);
      });
      const x = document.createElement('button');
      x.className = 'jm-btn jm-close';
      x.textContent = 'close';
      x.onclick = () => m.remove();
      m.appendChild(x);
      phone.appendChild(m);
    }
    function startJump(idx) {
      A.ensure();               // the tap is our audio-unlock gesture
      lock.style.display = 'none';
      screenEl.hidden = false;
      run(idx);
    }
  }
  initJumpMenu();

  muteBtn.innerHTML = window.SEEN_ICONS.vol(20);
  muteBtn.addEventListener('click', e => {
    e.stopPropagation();
    const m = !A.muted;
    A.setMuted(m);
    muteBtn.innerHTML = m ? window.SEEN_ICONS.volX(20) : window.SEEN_ICONS.vol(20);
  });

  async function run(startAt) {
    const steps = window.SEEN_STORY;
    if (SEEK != null) {
      INSTANT = true;
      const upto = Math.min(SEEK, steps.length);
      for (let i = 0; i < upto; i++) {
        try { await exec(steps[i]); } catch (e) { console.warn('seek step failed', i, e); }
      }
      INSTANT = false;
      return; // freeze frame for screenshots
    }
    // dev jump: fast-forward under INSTANT, then continue playing live
    const start = Math.min(startAt || 0, steps.length);
    if (start > 0) {
      INSTANT = true;
      for (let i = 0; i < start; i++) {
        try { await exec(steps[i]); } catch (e) { console.warn('jump step failed', i, e); }
      }
      INSTANT = false;
      metaQueue.length = 0; // tab flips during the fast-forward don't count
      renderClock();
      setBattery(S.battery);
    }
    for (let i = start; i < steps.length; i++) {
      if (S.dead) break;
      try { await exec(steps[i]); }
      catch (e) { console.warn('step failed', steps[i], e); }
      if (!S.dead && metaQueue.length) {
        try { await drainMeta(); } catch (e) { console.warn('meta failed', e); }
      }
    }
  }

  $('ecRestart').addEventListener('click', () => {
    try { localStorage.setItem('seen_done', '1'); } catch (e) {}
    location.reload();
  });

  window.addEventListener('resize', () => { if (noiseTimer) sizeNoise(); });
  bootLock();
})();
