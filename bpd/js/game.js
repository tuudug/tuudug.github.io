/* ============================================================
   SEEN — engine. runs the script, corrupts the phone, watches you.
   ============================================================ */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const phone = $('phone'), screenEl = $('screen'), msgEl = $('messages'),
        choicesEl = $('choices'), ibInput = $('ibInput'), ibSend = $('ibSend'),
        chName = $('chName'), chPresence = $('chPresence'), chAvatar = $('chAvatar'),
        sbTime = $('sbTime'), sbBatt = $('sbBatt'), sbBattFill = $('sbBattFill'),
        noise = $('noise'), blackout = $('blackout'), flash = $('flash'),
        callEl = $('callscreen'), csName = $('csName'), csSub = $('csSub'),
        csWave = $('csWave'), csCaption = $('csCaption'), csAvatar = $('csAvatar'),
        csButtons = $('csButtons'), csDecline = $('csDecline'), csAnswer = $('csAnswer'),
        endcard = $('endcard'), muteBtn = $('muteBtn');

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
    st.textContent = '.msg,.choice,.daystamp,.sysline,.typing{animation:none!important}';
    document.head.appendChild(st);
  }

  const S = {
    act: 0,
    battery: 23,
    clockMode: 'live',      // live | flicker | stuck
    clockStuck: '03:33',
    fict: 23 * 60 + 41,     // fictional story clock — Tuesday, 23:41
    metaArmed: false,
    metaCount: 0,
    lastMeTicks: null,
    dead: false
  };

  const sleep = ms => INSTANT ? Promise.resolve() : new Promise(r => setTimeout(r, ms / SPEED));
  const jit = (ms, j) => ms + Math.random() * (j || 250);
  function fmt(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    return String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
  }
  function storyTime() { return S.clockMode === 'stuck' ? S.clockStuck : fmt(S.fict); }
  function bumpClock() { if (S.clockMode !== 'stuck') { S.fict++; renderClock(); } }
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
    setBattery(23);
    try {
      if (navigator.getBattery) navigator.getBattery().then(b => setBattery(Math.round(b.level * 100))).catch(() => {});
    } catch (e) {}
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

  function markRead() {
    if (S.lastMeTicks) { S.lastMeTicks.classList.add('read'); }
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
    // typing indicator first
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

    markRead();
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
  function addDay(text, wrong) {
    const d = document.createElement('div');
    d.className = 'daystamp' + (wrong ? ' wrong' : '');
    d.textContent = text;
    msgEl.appendChild(d);
    scrollBottom();
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

  function runChoice(step) {
    if (INSTANT) {
      const o = step.opts[0];
      if (step.action || o.action) return Promise.resolve();
      return addMe(o.sends || o.label).then(() => {});
    }
    return new Promise(resolve => {
      choicesEl.innerHTML = '';
      choicesEl.classList.add('on');
      const LIMIT = step.t || 7000;
      let picked = false;
      const t0 = Date.now();

      // countdown bar — she hates waiting
      const bar = document.createElement('div');
      bar.id = 'choiceTimer';
      bar.innerHTML = '<i></i>';
      const fill = bar.firstChild;
      A.heartbeat(true, 1050);
      const tick = setInterval(() => {
        const p = (Date.now() - t0) / LIMIT;
        fill.style.width = Math.max(0, 100 - p * 100) + '%';
        if (p > 0.62 && !bar.classList.contains('late')) {
          bar.classList.add('late');
          A.heartbeat(true, 460); // panic tempo
        }
        if (p >= 1) select(step.opts[0]);
      }, 100);

      step.opts.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice' + (step.doom ? ' doom' : '');
        btn.textContent = (REPLAY && o.alt) ? o.alt : o.label;
        btn.style.animationDelay = (i * 0.12) + 's';
        btn.onclick = () => select(o);
        choicesEl.appendChild(btn);
      });
      choicesEl.appendChild(bar);
      if (TEST) setTimeout(() => { const b = choicesEl.querySelector('.choice'); if (b) b.click(); }, 300);
      scrollBottom();

      async function select(o) {
        if (picked) return;
        picked = true;
        clearInterval(tick);
        A.stopHeartbeat();
        choicesEl.classList.remove('on');
        choicesEl.innerHTML = '';
        const label = (REPLAY && o.alt) ? o.alt : o.label;
        if (step.action || o.action) {         // an action, not a message
          await sleep(420);
          resolve();
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
        resolve();
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
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden || !S.metaArmed || S.dead) return;
    if (S.metaCount >= window.SEEN_META_LINES.length) return;
    const line = window.SEEN_META_LINES[S.metaCount++];
    await sleep(600);
    await glitch(1);
    await addHer(line, { corrupt: true });
  });
  // title tease when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && S.metaArmed && !S.dead) document.title = 'come back ♡';
    else if (!S.dead && S.act >= 2) document.title = S.act >= 3 ? "don't look" : '(47) Mira ♡';
  });

  /* ================= voice note ================= */
  const PLAY_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><polygon points="7 4 20 12 7 20 7 4"/></svg>';
  const MSG_ICON_SVG = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  async function addVoiceNote(step) {
    if (!INSTANT) {
      const tp = document.createElement('div');
      tp.className = 'typing';
      tp.innerHTML = '<i></i><i></i><i></i>';
      msgEl.appendChild(tp);
      scrollBottom();
      await sleep(jit(1700, 400));
      tp.remove();
    }
    markRead();
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
    await A.whisper(step.say || 'look at the door');
    vn.classList.remove('playing');
    await sleep(700);
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

  /* ================= step executor ================= */
  async function exec(step) {
    switch (step.d) {
      case 'act': {
        S.act = step.n;
        document.body.dataset.act = step.n;
        if (step.n === 2) S.clockMode = 'flicker';
        if (step.n >= 3) S.clockMode = 'stuck';
        break;
      }
      case 'day': addDay(step.text, step.wrong); await sleep(600); break;
      case 'sys': addSys(step.text, step.bad); await sleep(jit(900, 300)); break;
      case 'her': await addHer((REPLAY && step.alt) ? step.alt : step.t, { p: step.p }); break;
      case 'me': await addMe(step.t); await sleep(600); break;
      case 'choice': await runChoice(step); break;
      case 'input': await runInput(step); break;
      case 'voice': await addVoiceNote(step); break;
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

  muteBtn.innerHTML = window.SEEN_ICONS.vol(20);
  muteBtn.addEventListener('click', e => {
    e.stopPropagation();
    const m = !A.muted;
    A.setMuted(m);
    muteBtn.innerHTML = m ? window.SEEN_ICONS.volX(20) : window.SEEN_ICONS.vol(20);
  });

  async function run() {
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
    for (const step of window.SEEN_STORY) {
      if (S.dead) break;
      try { await exec(step); }
      catch (e) { console.warn('step failed', step, e); }
    }
  }

  $('ecRestart').addEventListener('click', () => {
    try { localStorage.setItem('seen_done', '1'); } catch (e) {}
    location.reload();
  });

  window.addEventListener('resize', () => { if (noiseTimer) sizeNoise(); });
  bootLock();
})();
