// Дэлгэцүүд. Screen бүр (root, nav, data) авч зурна, { key, destroy } буцаана.
window.Screens = (function () {
  'use strict';

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]); }
  function $(root, sel) { return root.querySelector(sel); }

  const ANS = {
    false: { icon: '✕', label: 'Худал', cls: 'f' },
    true: { icon: '✓', label: 'Үнэн', cls: 't' },
    unsure: { icon: '?', label: 'Эргэлзээтэй', cls: 'u' }
  };
  // ================================================== Карт (data/cards.js)
  // Текстийг escape хийж, хүсвэл highlight хэсгийг <mark>-аар шараар тодруулна
  function cardText(p, withMark) {
    const text = esc(p.text);
    if (!withMark || !p.highlight) return text;
    const hl = esc(p.highlight);
    const i = text.indexOf(hl);
    if (i < 0) return text;
    return text.slice(0, i) + '<mark>' + hl + '</mark>' + text.slice(i + hl.length);
  }

  // Зөвхөн http(s) холбоос, шинэ таб дээр
  function extLink(url, label) {
    if (!/^https?:\/\//.test(url || '')) return esc(label);
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>';
  }

  // card.post байвал Facebook пост шиг (design/fb-card-reference.html): аватар, нэр ✓, цаг · 🌐, ···,
  // текст, 16:10 зураг, реакц, сэтгэгдэл · хуваалцсан, товчнууд (дарагдахгүй)
  function fbPost(p, opts) {
    const fb = p.post, g = fb.page || {}, img = fb.image, re = fb.reactions || {};
    const meta = (fb.sponsored || g.sponsored ? 'Ивээн тэтгэсэн' : esc(fb.time || '')) + ' · ' + esc(fb.privacy || '🌐');
    // Зураг ачаалагдахгүй бол саарал placeholder үлдэнэ
    const pic = img && img.src ? '<div class="fb-pic"><img class="fb-img" src="' + esc(img.src) + '" alt="' + esc(img.alt || '') +
      '" loading="eager" draggable="false" onerror="this.style.visibility=\'hidden\'"></div>' : '';
    return '<article class="fb' + (opts.mini ? ' mini' : '') + '">' +
      '<div class="fb-head"><div class="fb-av" style="background:' + esc(g.color || '#65676B') + '">' + esc(g.ini || '') + '</div>' +
        '<div class="fb-who"><div class="fb-name">' + esc(g.name || '') + (g.verified ? '<span class="fb-ver">✓</span>' : '') + '</div>' +
        '<div class="fb-meta">' + meta + '</div></div><div class="fb-dots">···</div></div>' +
      '<div class="fb-text">' + cardText(p, opts.mini) + '</div>' +
      pic +
      '<div class="fb-stats"><div class="fb-rx"><span class="e">' + (re.top || []).map(e => '<i>' + esc(e) + '</i>').join('') + '</span>' + esc(re.total || '') + '</div>' +
        '<div>' + esc(fb.comments || '0') + ' сэтгэгдэл · ' + esc(fb.shares || '0') + ' хуваалцсан</div></div>' +
      '<div class="fb-act" aria-hidden="true"><div>👍 Таалагдсан</div><div>💬 Сэтгэгдэл</div><div>↗ Хуваалцах</div></div>' +
      '</article>';
  }

  // opts.mini: алдааны дүнгийн жижиг хувилбар (highlight-тай, "чирж хариулаарай"-гүй)
  function post(p, opts) {
    opts = opts || {};
    if (p.post) return fbPost(p, opts);
    const c = Game.catInfo(p.category);
    return '<article class="claim t-' + esc(c.id) + (opts.mini ? ' mini' : '') + '">' +
      '<span class="ctag">' + icon(c.icon) + esc(c.name) + '</span>' +
      '<p class="ctext' + (p.text.length > 100 ? ' long' : '') + (p.text.length > 180 ? ' xlong' : '') + '">' + cardText(p, opts.mini) + '</p>' +
      (p.spread ? '<span class="cspread">📅 Тархсан: ' + esc(p.spread) + '</span>' : '') +
      (opts.mini ? '' : '<small class="chint">Картыг чирж хариулаарай</small>') +
      '</article>';
  }

  // ================================================== Жижиг туслахууд
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.getElementById('app').appendChild(t);
    setTimeout(() => t.remove(), 1900);
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  function share(game) {
    const text = Game.shareText(game);
    const copy = () => {
      const p = navigator.clipboard ? navigator.clipboard.writeText(text).then(() => true, () => false) : Promise.resolve(false);
      p.then(ok => toast(ok || legacyCopy(text) ? 'Хуулагдлаа' : 'Хуулж чадсангүй'));
    };
    if (navigator.share) {
      navigator.share({ text }).catch(e => { if (!e || e.name !== 'AbortError') copy(); });
    } else {
      copy();
    }
  }

  function confetti(root) {
    const box = document.createElement('div');
    box.className = 'confetti';
    const colors = ['#F7B733', '#4ADE80', '#F87171', '#F2EFEA'];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % 4];
      c.style.setProperty('--x', (Math.random() * 120 - 60) + 'px');
      c.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
      c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      c.style.animationDelay = Math.random() * 0.5 + 's';
      box.appendChild(c);
    }
    root.appendChild(box);
    setTimeout(() => box.remove(), 3600);
  }

  function countUp(el, to) {
    const t0 = performance.now(), dur = 800;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  // ================================================== Дүрс (Lucide, ISC)
  const ICONS = {
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    ball: '<circle cx="12" cy="12" r="10"/><path d="m12 7 4.5 3.3-1.7 5.2H9.2l-1.7-5.2z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    menu: '<path d="M5 8h14M5 12h14M5 16h14"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    chevU: '<path d="m18 15-6-6-6 6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" fill="currentColor"/>',
    wave: '<path d="M2 10v4"/><path d="M6 6v12"/><path d="M10 3v18"/><path d="M14 8v8"/><path d="M18 5v14"/><path d="M22 10v4"/>'
  };
  function icon(name) {
    if (!ICONS[name]) name = 'tag';
    return '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  const LOGO = '<div class="logo" role="img" aria-label="Swipe Smart">' + icon('wave') + '<b>swipe<span>smart</span></b></div>';

  // Хочны эхний үсэг + хочоос тогтмол өнгө (чансаа)
  const AV_COLORS = ['#E0559A', '#8B5CF6', '#E8930C', '#3B82F6', '#22A06B', '#E5484D', '#14A3A3', '#F76B15'];
  function initial(nick) { return esc(String(nick || '?').trim().charAt(0).toUpperCase()); }
  function avColor(nick) { return AV_COLORS[Game.hash(String(nick)) % AV_COLORS.length]; }

  // Доод цэс: Чансаа · Нүүр · Профайл
  function dock(active) {
    const it = (id, ic, label) =>
      '<button class="dk' + (id === 'home' ? ' mid' : '') + (active === id ? ' on' : '') + '" data-nav="' + id + '">' +
        '<span class="dk-c">' + icon(ic) + '</span><small>' + label + '</small></button>';
    return '<nav class="dock">' + it('board', 'trophy', 'Чансаа') + it('home', 'home', 'Нүүр') + it('profile', 'user', 'Профайл') + '</nav>';
  }
  function bindDock(root, nav, active) {
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-nav]');
      if (!b || b.dataset.nav === active) return;
      if (b.dataset.nav === 'home') nav.home(); else nav.reset(b.dataset.nav);
    });
  }

  // Доороос гарч ирэх хуудас (цэс, заавар)
  function sheet(root, html) {
    const el = document.createElement('div');
    el.className = 'sheet';
    el.innerHTML = '<div class="sh-in">' + html + '</div>';
    const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 220); };
    el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]')) close(); });
    (root.querySelector('.screen') || root).appendChild(el);
    return { el, close };
  }

  function howTo(root, onClose) {
    const s = sheet(root, `
      <b class="sh-t">Яаж тоглох вэ?</b>
      <div class="how">
        <div class="howrow"><span class="ic f">${icon('chevL')}</span><div><b>Худал</b><small>Зүүн тийш шидэх</small></div></div>
        <div class="howrow"><span class="ic u">${icon('chevU')}</span><div><b>Эргэлзээтэй</b><small>Дээш шидэх · нотолгоо хангалтгүй</small></div></div>
        <div class="howrow"><span class="ic t">${icon('chev')}</span><div><b>Үнэн</b><small>Баруун тийш шидэх</small></div></div>
      </div>
      <div class="pts">
        <span><b class="t">+10</b>Зөв</span><span><b class="t">+15</b>🔥3+ дараалан</span>
        <span><b class="f">−5</b>Буруу</span><span><b class="u">0</b>Эргэлзээтэй</span>
      </div>
      <div class="hint">Бүгд зөв бол +20 · Хурд нөлөөгүй · 💡 Карт дээр дарвал сэжүүр</div>
      <button class="btn acc" data-close>Ойлголоо</button>`);
    if (onClose) new MutationObserver((m, o) => { if (!s.el.isConnected) { o.disconnect(); onClose(); } })
      .observe(s.el.parentNode, { childList: true });
    return s;
  }

  // Хочийг серверт бүртгэнэ / шинэчилнэ. Сервер байхгүй (file://, сүлжээгүй) бол зөвхөн энд хадгална.
  function saveIdentity(nick, cls) {
    nick = String(nick || '').trim() || Game.defaultNick();
    if (!Api.online) { Game.savePlayer(nick, cls); return Promise.resolve({ ok: true, offline: true }); }
    const req = Api.registered() ? Api.profile({ nick, cls }) : Api.register(nick, cls);
    return req.then(r => {
      if (r.ok) { Game.setIdentity(r.data); Api.flush(); return { ok: true }; }
      if (r.status === 0 && !Api.registered()) { Game.savePlayer(nick, cls); return { ok: true, offline: true }; }
      return { ok: false, error: r.data.error || 'Алдаа гарлаа' };
    });
  }

  // Илгээх үед товчийг түгжиж, алдааг талбарын доор харуулна
  function submitIdentity(btn, errEl, nick, cls) {
    btn.disabled = true;
    errEl.textContent = '';
    return saveIdentity(nick, cls).then(r => {
      btn.disabled = false;
      if (!r.ok) errEl.textContent = r.error;
      else if (r.offline && Api.online) toast('Офлайн · хоч дараа бүртгэгдэнэ');
      return r.ok;
    });
  }

  function editProfile(root, onSave, msg) {
    const p = Game.player() || { nick: '', cls: '' };
    const s = sheet(root, `
      <b class="sh-t">${Api.online && !Api.registered() ? 'Хочоо бүртгүүл' : 'Профайл засах'}</b>
      <label class="lbl" for="m-nick">Хоч</label>
      <input class="field" id="m-nick" maxlength="16" value="${esc(p.nick)}" placeholder="Нэрээ оруулна уу...">
      <label class="lbl" for="m-cls">Ангийн код <i>· заавал биш</i></label>
      <input class="field" id="m-cls" maxlength="10" value="${esc(p.cls)}" placeholder="11А-ШБ">
      <div class="err" data-err>${esc(msg || '')}</div>
      <button class="btn acc" data-save>Хадгалах</button>`);
    $(s.el, '[data-save]').addEventListener('click', e => {
      submitIdentity(e.currentTarget, $(s.el, '[data-err]'), $(s.el, '#m-nick').value, $(s.el, '#m-cls').value).then(ok => {
        if (!ok) return;
        s.close(); toast('Хадгалагдлаа');
        if (onSave) onSave();
      });
    });
  }

  // ================================================== 1 · Танилцуулга
  function intro(root, nav) {
    root.innerHTML = `
      <section class="screen intro">
        <div class="intro-hero">
          ${LOGO}
          <p class="tagline">Мэдээ үнэн үү, худал уу? Swipe хийгээд шалга.</p>
          <div class="fan" aria-hidden="true">
            <div class="fc l"></div><div class="fc r"></div>
            <div class="fc c"><span class="fq">${icon('search')}</span><b>Үнэн үү, худал уу?</b><code>← худал&nbsp;&nbsp;үнэн →</code></div>
          </div>
        </div>
        <form class="pad intro-form" autocomplete="off">
          <label class="lbl" for="nick">Хоч</label>
          <div class="fwrap">${icon('user')}<input class="field" id="nick" maxlength="16" placeholder="Нэрээ оруулна уу..."></div>
          <div class="err" data-err></div>
          <button class="btn acc lg" type="submit">${icon('play')} Эхлэх</button>
        </form>
      </section>`;
    $(root, 'form').addEventListener('submit', e => {
      e.preventDefault();
      submitIdentity($(root, '[type=submit]'), $(root, '[data-err]'), $(root, '#nick').value, '').then(ok => { if (ok) nav.afterIntro(); });
    });
    return {};
  }

  // ================================================== 2 · Нүүр
  function home(root, nav) {
    const played = Game.playedToday();
    const p = Game.player() || { nick: '' };
    const x = Game.xp(), lv = Game.level();
    const seen = Math.min(x, Store.get('xpSeen', x));
    Store.set('xpSeen', x);

    const rk = Game.ranks();
    const cats = Game.cats().map(c => c.locked
      ? '<button class="cat lock" data-need="' + c.need + '" data-name="' + esc(c.name) + '">' + icon('lock') +
          '<span>' + esc(c.name) + '</span><small>' + c.need + ' XP</small></button>'
      : '<button class="cat' + (c.played ? ' done' : ' new') + '" data-cat="' + c.id + '">' + icon(c.icon) + '<span>' + esc(c.name) + '</span>' +
          (c.board ? '<em data-rank="' + c.id + '">' + (rk[c.id] && rk[c.id].rank ? '#' + rk[c.id].rank : '') + '</em>' : '') + '</button>'
    ).join('');

    // Дээд мөр (гүйдэг): найдвартай эх сурвалжуудын нэр (data/sources.js). Дарахад холбоосын жагсаалт.
    const groups = (window.SOURCES || []).filter(g => g && g.items && g.items.length);
    const run = groups.map(g => g.items.map(x => '<span>' + esc(x.name) + '</span><i></i>').join('')).join('');

    root.innerHTML = `
      <section class="screen home">
        <div class="top hometop">
          <button class="news" data-act="sources">
            <span class="nw-l">${icon('link')}ЭХ СУРВАЛЖ</span>
            <span class="nw-t"><span class="mq">${run}${run}</span></span>
          </button>
          <button class="sq" data-act="menu" aria-label="Цэс">${icon('menu')}</button>
        </div>
        <div class="homemain">
          <button class="ava" data-nav="profile" aria-label="Профайл">${icon('user')}</button>
          <b class="pname">${esc(p.nick)}</b>
          <div class="xp"><b data-xp>${seen}</b><small>XP</small></div>
          <div class="lvbar"><i style="width:${Math.max(3, lv.pct * 100)}%"></i></div>
          <div class="lvtxt">${lv.next ? 'дараагийн түвшин · ' + lv.next + ' XP' : 'бүх ангилал нээгдсэн'}</div>
          <h3 class="sec">Ангилал</h3>
          <div class="cats">${cats}</div>
        </div>
        ${dock('home')}
      </section>`;

    if (x > seen) setTimeout(() => {
      const el = $(root, '[data-xp]'), t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / 900);
        el.textContent = Math.round(seen + (x - seen) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }, 250);

    // Найдвартай эх сурвалжууд: зөвхөн холбоос, шинэ таб дээр
    function sources() {
      sheet(root, `
        <b class="sh-t">Найдвартай эх сурвалж</b>
        <div class="hint" style="text-align:left">Мэдээ эргэлзээтэй санагдвал эндээс шалгаарай.</div>
        <div class="srcl">${groups.map(g => '<div class="srcg"><b>' + esc(g.group) + '</b>' +
          g.items.map(x => extLink(x.url, x.name)).join('') + '</div>').join('')}</div>
        <button class="btn ghost" data-close>Хаах</button>`);
    }

    function menu() {
      const s = sheet(root, `
        <b class="sh-t">Өдрийн 10 · №${Game.edition()}</b>
        <button class="btn acc" data-m="play">${icon('play')} ${played ? 'Дадлага хийх' : 'Өнөөдрийн 10'}</button>
        ${played ? '<button class="btn ghost" data-m="today">Өнөөдрийн дүн</button>' : ''}
        <button class="btn ghost" data-m="how">Яаж тоглох вэ?</button>
        <div class="hint">Ангилал бүрт өдрийн анхны тоглолт л чансаанд тооцогдоно.</div>`);
      s.el.addEventListener('click', e => {
        const b = e.target.closest('[data-m]');
        if (!b) return;
        if (b.dataset.m === 'play') nav.start(played);
        else if (b.dataset.m === 'today') nav.go('end', { game: Game.todayRecord() });
        else { s.close(); howTo(root); }
      });
    }

    root.addEventListener('click', e => {
      const c = e.target.closest('[data-cat]');
      if (c) { nav.startCat(c.dataset.cat); return; }
      const l = e.target.closest('[data-need]');
      if (l) { toast('🔒 ' + l.dataset.name + ' · ' + l.dataset.need + ' XP цуглуулбал нээгдэнэ'); return; }
      const b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'sources') sources();
      else if (b.dataset.act === 'menu') menu();
    });
    bindDock(root, nav, 'home');

    // Сервер: бүртгэлгүй бол бүртгэнэ, илгээгдээгүй тоглолтыг илгээж, байрыг шинэчилнэ
    let alive = true;
    const sync = () => Api.flush().then(() => Game.refreshRanks()).then(r => {
      if (!alive) return;
      root.querySelectorAll('[data-rank]').forEach(el => {
        const x = r[el.dataset.rank];
        el.textContent = x && x.rank ? '#' + x.rank : '';
      });
    });
    if (Api.online && !Api.registered()) {
      Api.register(p.nick, p.cls).then(r => {
        if (r.ok) { Game.setIdentity(r.data); sync(); }
        else if (alive && r.status === 409) editProfile(root, sync, r.data.error);
      });
    } else sync();
    return { destroy() { alive = false; } };
  }

  // ================================================== 3 · Тоглох
  function play(root, nav, data) {
    const game = data.game;
    const posts = game.ids.map(Game.post);
    // Тоглоом эхлэхэд бүх зургийг урьдчилан ачаална
    posts.forEach(p => { if (p && p.post && p.post.image && p.post.image.src) new Image().src = p.post.image.src; });
    const title = (game.cat ? Game.catName(game.cat) : 'Өдрийн 10') + (game.practice ? ' · Дадлага' : '');
    root.innerHTML = `
      <section class="screen play">
        <div class="top">
          <button class="sq" data-act="exit" aria-label="Гарах">${icon('x')}</button>
          <div class="prog"><b>${esc(title)} · <span data-n></span>/${posts.length}</b><div class="pbar"><i></i></div></div>
          <span class="spill">${icon('star')}<b data-pts>${Game.score(game).pts}</b></span>
        </div>
        <div class="deck"></div>
        <div class="btns">
          <button class="rb f" data-ans="false">${icon('chevL')}Худал</button>
          <button class="rb u" data-ans="unsure">${icon('chevU')}Эргэлзээтэй</button>
          <button class="rb t" data-ans="true">Үнэн${icon('chev')}</button>
        </div>
      </section>`;

    const deck = $(root, '.deck'), btns = $(root, '.btns');
    const num = $(root, '[data-n]'), fill = $(root, '.pbar i');
    const cards = {};
    let i = game.answers.length, locked = true, busy = false, coach = false, timer = 0, ctl = null;

    function makeCard(k) {
      const el = document.createElement('div');
      el.className = 'card';
      el.dataset.pos = '3';
      el.innerHTML =
        '<div class="flip">' +
          '<div class="face front">' + post(posts[k]) + '</div>' +
          '<div class="face back"><span class="bk-i">' + icon('search') + '</span><div class="bk-l">СЭЖҮҮР</div>' +
            '<div class="bk-t">' + esc(posts[k].clue || 'Хэн нийтэлсэн бэ? Хэзээ, хаана? Өөр эх сурвалж баталж байна уу?') + '</div>' +
            '<div class="bk-h">Дарж буцаана</div></div>' +
        '</div>' +
        '<div class="tint"></div>' +
        '<div class="stamp s-false">ХУДАЛ</div><div class="stamp s-true">ҮНЭН</div><div class="stamp s-unsure">ЭРГЭЛЗЭЭТЭЙ</div>';
      return el;
    }

    // ⏸ Карт гарснаас 1.2 сек товч, swipe идэвхгүй; товчнууд аажим тодорно
    function wait() {
      locked = true;
      clearTimeout(timer);
      btns.classList.remove('wake');
      void btns.offsetWidth;
      btns.classList.add('wake');
      timer = setTimeout(() => { locked = false; btns.classList.remove('wake'); }, 1200);
    }

    function progress(k) {
      num.textContent = Math.min(k + 1, posts.length);
      fill.style.width = (k / posts.length * 100) + '%';
    }

    function layout() {
      for (let k = i; k < Math.min(i + 3, posts.length); k++) {
        if (!cards[k]) { cards[k] = makeCard(k); deck.insertBefore(cards[k], deck.firstChild); }
      }
      void deck.offsetWidth;
      Object.keys(cards).forEach(k => { cards[k].dataset.pos = String(k - i); });
      progress(i);
      const top = cards[i];
      ctl = Swipe.attach(top, {
        canSwipe: () => !locked && !busy && !coach,
        onTap: () => top.classList.toggle('flipped'),
        onHot: (dir, p) => { btns.dataset.hot = dir && p >= 0.5 ? dir : ''; },
        onFling: dir => {
          busy = true;
          btns.dataset.hot = dir;
          const b = $(btns, '[data-ans="' + dir + '"]');
          b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
        },
        onCommit: commit
      });
      wait();
    }

    // Хариулсан даруйд авсан оноог (+10, +15, −5, 0) том тэмдгээр, дээд буланд нийт оноог харуулна
    const ptsEl = $(root, '[data-pts]'), pill = $(root, '.spill');
    const FX = { ok: 'Зөв', meh: 'Эргэлзээтэй', bad: 'Буруу' };
    // st: rules.js-ийн score().steps-ийн сүүлийн алхам { r, d, run }
    function flash(st, perfect) {
      const P = window.RULES.POINTS, r = st.r;
      let big = st.d > 0 ? '+' + st.d : st.d < 0 ? '−' + (-st.d) : r === 'bad' ? '✗' : '0';
      let sub = FX[r];
      if (r === 'ok' && st.run >= 2) sub += ' · 🔥' + st.run;
      if (r === 'ok' && st.run >= P.comboFrom) sub += ' · +' + P.combo + ' бонус';
      if (r === 'meh') sub += ' · 🔥 хадгалагдлаа';
      if (r === 'bad' && st.d === 0) sub += ' · 0-ээс доош буухгүй';
      const el = document.createElement('div');
      el.className = 'fx ' + r;
      el.innerHTML = '<b>' + big + '</b><span>' + sub + '</span>' +
        (perfect ? '<em>🎉 Бүгд зөв · +' + P.perfect + '</em>' : '');
      // Дэлгэц бүхэлдээ: оноо нэмэгдвэл ногоон, буруу бол цайвар улаан, эргэлзээтэй бол шар анивчина
      const wash = document.createElement('div');
      wash.className = 'wash ' + (r === 'bad' ? 'loss' : st.d > 0 ? 'gain' : 'even');
      const scr = $(root, '.screen');
      scr.appendChild(wash);
      scr.appendChild(el);
      setTimeout(() => wash.remove(), 900);
      setTimeout(() => el.remove(), 1100);
      pill.className = 'spill ' + r;
      void pill.offsetWidth;
      pill.classList.add('bump');
      ptsEl.textContent = Game.score(game).pts;
      Swipe.buzz(r === 'bad' ? [40, 50, 40] : 15);
    }

    function commit(dir) {
      game.answers.push({ id: posts[i].id, ans: dir });
      const after = Game.score(game);
      flash(after.steps[after.steps.length - 1], after.perfect);
      cards[i].remove();
      delete cards[i];
      i++;
      btns.dataset.hot = '';
      if (i >= posts.length) {
        fill.style.width = '100%';
        Game.finish(game);
        setTimeout(() => nav.reset('end', { game, fresh: true }), 1000);
        return;
      }
      Game.saveCurrent(game);
      busy = false;
      layout();
    }

    function answer(dir) { if (!locked && !busy && !coach) ctl.fling(dir); }
    function flip() { if (cards[i] && !busy) cards[i].classList.toggle('flipped'); }

    btns.addEventListener('click', e => {
      const b = e.target.closest('[data-ans]');
      if (b) answer(b.dataset.ans);
    });
    $(root, '[data-act=exit]').addEventListener('click', () => nav.home());

    Game.saveCurrent(game);
    layout();
    // Анх удаа тоглож байвал заавар харуулна
    if (!Store.get('coached', false)) {
      Store.set('coached', true);
      coach = true;
      howTo(root, () => { coach = false; wait(); });
    }

    const KEYS = { ArrowLeft: 'false', ArrowRight: 'true', ArrowUp: 'unsure' };
    return {
      key(e) {
        if (KEYS[e.key]) { e.preventDefault(); answer(KEYS[e.key]); }
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
        else if (e.key === 'Escape') nav.home();
      },
      destroy() { clearTimeout(timer); }
    };
  }

  function tag(game) {
    return game.practice ? '<span class="tag">ДАДЛАГА</span>' : '';
  }

  // ================================================== 4 · Төгсгөл
  function end(root, nav, data) {
    const game = data.game, s = Game.score(game), fresh = !!data.fresh;
    data.fresh = false;                                   // буцаж ирэхэд дахин анимэйшн хийхгүй
    const miss = s.total - s.correct;
    const perfect = s.total > 0 && miss === 0;
    const third = game.cat && Game.catName(game.cat) && Game.boardCats().some(c => c.id === game.cat)
      ? '<div><b data-rank>' + (game.practice ? '—' : '…') + '</b><small>' + esc(Game.catName(game.cat)) + ' чансаа</small></div>'
      : '<div><b>📅 ' + Game.dayStreak() + '</b><small>өдөр дараалан</small></div>';

    root.innerHTML = `
      <section class="screen end">
        <div class="top">
          <button class="sq" data-act="home" aria-label="Нүүр">${icon('x')}</button><span class="grow"></span>
          ${tag(game)}
        </div>
        <div class="pad endmain">
          <div class="muted cap">${game.cat ? esc(Game.catName(game.cat)) : 'Өдрийн 10 · №' + Game.edition()}</div>
          <div class="big${fresh ? ' anim' : ''}">${s.correct}<span class="muted">/${s.total}</span></div>
          <div class="dots${fresh ? ' anim' : ''}">${s.marks.map((m, k) => '<span style="animation-delay:' + (0.25 + k * 0.12) + 's">' + Game.DOT[m] + '</span>').join('')}</div>
          <div class="stat3">
            <div><b data-pts>${fresh ? 0 : s.pts}</b><small>${game.practice ? 'оноо · дадлага' : 'оноо'}</small></div>
            <div><b>🔥 ${s.best}</b><small>дараалсан</small></div>
            ${third}
          </div>
          ${game.gained ? '<span class="pill xpup">' + icon('star') + '+' + game.gained + ' XP</span>' : ''}
          ${perfect ? '<div class="perfect">Төгс! Бүгд зөв 🎉</div>' : ''}
        </div>
        <div class="pad endbtns">
          ${miss ? `<button class="btn acc" data-act="review">Алдаагаа харах (${miss}) →</button>`
                 : '<button class="btn acc" data-act="home">Нүүр →</button>'}
          <div class="row2">
            <button class="btn ghost" data-act="share">↗ Хуваалцах</button>
            <button class="btn ghost" data-act="board">${icon('trophy')} Чансаа</button>
          </div>
        </div>
      </section>`;

    const screen = $(root, '.screen');
    const rankEl = $(root, '[data-rank]');
    if (rankEl && !game.practice) {
      (game.sync || Promise.resolve(null)).then(r => {
        const x = r && r.ok ? r.data : Game.ranks()[game.cat];
        rankEl.textContent = x && x.rank ? '#' + x.rank : '—';
        if (r && !r.ok && r.status === 0) toast('Офлайн · дараа илгээгдэнэ');
      });
    }
    if (fresh) {
      setTimeout(() => countUp($(root, '[data-pts]'), s.pts), 300);
      if (perfect) { confetti(screen); Swipe.buzz([20, 60, 20]); }
    }

    screen.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const act = b.dataset.act;
      if (act === 'home') nav.home();
      else if (act === 'review') nav.go('review', { game });
      else if (act === 'share') share(game);
      else if (act === 'board') nav.reset('board', { cat: game.cat });
    });
    return { key(e) { if (e.key === 'Escape') nav.home(); } };
  }

  // ================================================== 5 · Алдааны дүн
  function review(root, nav, data) {
    const game = data.game;
    const items = Game.mistakes(game);
    const weak = Game.weakness(game);

    const slides = items.map(m => {
      const p = m.post, mine = ANS[m.ans], right = ANS[Game.truth(p)];
      const media = p.media || {};
      const tip = String(p.tip || '').replace(/^🛡\s*/, '');
      // sources (бүх эх сурвалж) байвал бүгдийг, үгүй бол source-ийг жагсаана
      const srcs = (Array.isArray(p.sources) && p.sources.length ? p.sources : p.source ? [p.source] : [])
        .filter(s => s && (s.name || s.url));
      // design/fb-card-reference.html-ийн загвар: пост (тодруулгатай) → Чи → Зөв нь, арга, яагаад, зөвлөгөө, ЭХ СУРВАЛЖ
      return `
        <div class="slide">
          ${post(p, { mini: true })}
          <div class="rev">
            <div class="rev-verdict">Чи: <span class="rev-pill ${mine.cls}">${mine.icon} ${mine.label}</span> → Зөв нь:
              <span class="rev-pill ${right.cls}">${right.icon} ${right.label}</span></div>
            ${p.technique ? '<span class="rev-tech">' + esc(p.technique) + '</span>' : ''}
            <div>${esc(p.why)}</div>
            ${tip ? '<div class="rev-tip">🛡 ' + esc(tip) + '</div>' : ''}
            ${srcs.length || media.url ? '<div class="rev-src"><b>Эх сурвалж</b>' +
              srcs.map(s => extLink(s.url, s.name || s.url)).join('') +
              (media.url ? extLink(media.url, media.label || 'Зураг/бичлэг') : '') + '</div>' : ''}
            ${p.spread ? '<div class="rev-spread">📅 Тархсан: ' + esc(p.spread) + '</div>' : ''}
          </div>
        </div>`;
    }).join('');

    root.innerHTML = `
      <section class="screen review">
        <div class="top">
          <button class="sq" data-act="back" aria-label="Буцах">${icon('chevL')}</button>
          <b class="ttl">Алдаа <span data-n>1</span> / ${items.length}</b>
          <button class="link" data-act="next">Дараах →</button>
        </div>
        <div class="slides">${slides}</div>
        ${weak ? `<div class="weak"><b>🎯 Таны сул тал:</b> ${esc(weak.label)} (${weak.count} удаа). ${esc(weak.tip)}</div>` : ''}
      </section>`;

    const box = $(root, '.slides'), n = $(root, '[data-n]'), next = $(root, '[data-act=next]');
    let idx = 0;
    function sync() {
      idx = Math.round(box.scrollLeft / Math.max(1, box.clientWidth));
      n.textContent = idx + 1;
      next.textContent = idx >= items.length - 1 ? 'Болсон ✓' : 'Дараах →';
    }
    function goTo(k) {
      if (k < 0) return;
      if (k >= items.length) { nav.back(); return; }
      box.scrollTo({ left: k * box.clientWidth, behavior: 'smooth' });
    }
    box.addEventListener('scroll', sync, { passive: true });
    $(root, '[data-act=back]').addEventListener('click', () => nav.back());
    next.addEventListener('click', () => goTo(idx + 1));
    sync();

    return {
      key(e) {
        if (e.key === 'ArrowRight') goTo(idx + 1);
        else if (e.key === 'ArrowLeft') goTo(idx - 1);
        else if (e.key === 'Escape') nav.back();
      }
    };
  }

  // ================================================== 6 · Чансаа (Трэнд · Тек · Спорт тус бүр тусдаа)
  function board(root, nav, data) {
    // Чансаатай (board) бөгөөд карттай ангиллууд л таб болно
    const bc = Game.boardCats();
    const has = id => bc.some(c => c.id === id);
    let cat = has(data.cat) ? data.cat : has(Store.get('boardCat', '')) ? Store.get('boardCat', '') : (bc[0] && bc[0].id);
    let period = data.period || 'week';

    const ms = Game.msToMonday(), hrs = Math.floor(ms / 36e5);
    const left = hrs >= 24 ? Math.floor(hrs / 24) + ' өдөр ' + hrs % 24 + ' цаг' : hrs + ' цаг ' + Math.floor(ms / 6e4) % 60 + ' мин';

    root.innerHTML = `
      <section class="screen board">
        <div class="bhead pad">
          <h1 class="h1">Чансаа</h1>
          <span class="cd">${icon('clock')}${left}</span>
        </div>
        <div class="pad bctl">
          ${bc.length ? '<div class="seg">' + bc.map(c => '<button data-cat="' + c.id + '">' + icon(c.icon) + esc(c.name) + '</button>').join('') + '</div>' +
            '<div class="seg sm"><button data-per="week">Энэ долоо хоног</button><button data-per="all">Бүх цаг</button></div>' : ''}
          <div class="lbnote">📌 «Өдрийн 10» чансаанд тооцогдохгүй. <b>Ангилал тоглож чансаанд орно.</b></div>
        </div>
        <div class="lbscroll"></div>
        <div class="mebar" hidden></div>
        ${dock('board')}
      </section>`;

    const box = $(root, '.lbscroll'), mebar = $(root, '.mebar');

    function ava(r, cls) {
      return '<span class="' + cls + '" style="--c:' + avColor(r.nick) + '">' + (r.me ? icon('user') : initial(r.nick)) + '</span>';
    }
    function name(r) { return esc(r.nick) + (r.me ? ' (Та)' : ''); }

    function render(d) {
      const rows = d.rows;
      const pod = [rows[1], rows[0], rows[2]].map((r, k) => {
        const n = [2, 1, 3][k];
        if (!r) return '<div class="pd p' + n + ' empty"><span class="pav2">?</span><b class="pn2">—</b><span class="ps">&nbsp;</span><div class="blk">' + n + '</div></div>';
        return '<div class="pd p' + n + (r.me ? ' me' : '') + '">' +
          (n === 1 ? '<span class="crown">' + icon('crown') + '</span>' : '') +
          ava(r, 'pav2') + '<b class="pn2">' + name(r) + '</b><span class="ps">' + r.score + ' XP</span>' +
          '<div class="blk">' + n + '</div></div>';
      }).join('');
      const rest = rows.slice(3).map(r =>
        '<div class="lr' + (r.me ? ' me' : '') + '"><span class="n">' + r.rank + '</span>' + ava(r, 'lav') +
        '<span class="nm">' + name(r) + (r.cls ? '<span class="cl">' + esc(r.cls) + '</span>' : '') + '</span>' +
        '<span class="sc">' + r.score + ' XP</span></div>').join('');
      box.innerHTML = '<div class="podium">' + pod + '</div>' +
        (rest ? '<div class="lbrest">' + rest + '</div>' : '') +
        (rows.length ? '' : '<div class="lbmsg">Энэ ангилалд одоогоор хэн ч тоглоогүй байна. Эхний нь болоорой!</div>') +
        '<div class="foot">' + d.total + ' тоглогч · Даваа гараг бүр шинэчлэгдэнэ · Ангилал бүрт өдрийн анхны тоглолт л тооцогдоно · Зөвхөн хоч хадгална</div>';

      const p = Game.player() || { nick: '' };
      const me = d.me || { rank: '—', nick: p.nick, score: 0, me: true };
      mebar.innerHTML = '<span class="n">' + me.rank + '</span>' + ava(me, 'lav') +
        '<span class="nm">' + name(me) + '</span><span class="sc">' + (d.me ? me.score + ' XP' : 'тоглоогүй') + '</span>';
      mebar.hidden = false;
    }

    let req = 0;
    function draw() {
      if (!cat) {
        box.innerHTML = '<div class="lbmsg">Чансаатай ангилалд одоогоор карт алга.</div>';
        return;
      }
      root.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === cat));
      root.querySelectorAll('[data-per]').forEach(b => b.classList.toggle('on', b.dataset.per === period));
      const my = ++req;
      box.innerHTML = '<div class="lbmsg">Ачаалж байна…</div>';
      box.scrollTop = 0;
      Api.board(cat, period).then(r => {
        if (my !== req) return;                       // хуучин хүсэлт
        if (r.ok) { render(r.data); return; }
        mebar.hidden = true;
        box.innerHTML = '<div class="lbmsg">' + (Api.online ? esc(r.data.error || 'Алдаа гарлаа') +
          '<br><button class="btn ghost" data-retry>Дахин оролдох</button>'
          : 'Чансаа серверээс ирдэг тул Netlify дээр байршуулсан хувилбарт л ажиллана.') + '</div>';
      });
    }

    root.addEventListener('click', e => {
      const c = e.target.closest('[data-cat]');
      if (c) { cat = data.cat = c.dataset.cat; Store.set('boardCat', cat); draw(); return; }
      const p = e.target.closest('[data-per]');
      if (p) { period = data.period = p.dataset.per; draw(); return; }
      if (e.target.closest('[data-retry]')) draw();
    });
    bindDock(root, nav, 'board');
    draw();
    return { key(e) { if (e.key === 'Escape') nav.home(); } };
  }

  // ================================================== 7 · Профайл (Миний ахиц)
  function profile(root, nav) {
    function draw() {
      const p = Game.player() || { nick: '', cls: '' };
      const x = Game.xp(), lv = Game.level(), st = Game.stats();
      // Чадварууд = cards.js-ийн technique бүр; нэг ч удаа зөв таньсан бол нээгдэнэ
      const skills = Game.techniques().map(k => {
        const t = st.tech[k] || { ok: 0, n: 0 }, on = t.ok > 0;
        return '<div class="sk' + (on ? ' on' : '') + '"><span class="skc">' + (on ? esc(k.trim().charAt(0).toUpperCase()) : icon('lock')) + '</span>' +
          '<b>' + esc(k) + '</b><small>' + (t.n ? t.ok + '/' + t.n + ' зөв' : '—') + '</small></div>';
      }).join('');

      root.innerHTML = `
        <section class="screen profile">
          <h1 class="h1 pad ptop">Профайл</h1>
          <div class="pscroll pad">
            <div class="prow">
              <button class="pava" data-act="edit" aria-label="Засах">${icon('user')}<span class="pen">${icon('pencil')}</span></button>
              <div class="pinfo">
                <b class="pnm">${esc(p.nick)}</b>
                <span class="chip">${Api.registered() ? '✓ Бүртгэлтэй' : 'Офлайн тоглогч'}</span>
                <button class="chip g" data-act="edit">${p.cls ? 'Анги · ' + esc(p.cls) : '+ Ангийн код'}</button>
              </div>
            </div>
            <div class="box lvcard">
              <div class="lvh"><b>Түвшин ${lv.lv}</b><span>${lv.next ? x + ' / ' + lv.next + ' XP' : x + ' XP'}</span></div>
              <div class="lvbar"><i style="width:${Math.max(3, lv.pct * 100)}%"></i></div>
              <small>${lv.next ? '«' + esc(lv.nextName) + '» ангилал нээгдэхэд ' + (lv.next - x) + ' XP үлдлээ' : 'Бүх ангилал нээгдсэн 🎉'}</small>
            </div>
            <div class="stat3">
              <div><b>${st.plays}</b><small>Тоглолт</small></div>
              <div><b class="g">${st.acc == null ? '—' : st.acc + '%'}</b><small>Нарийвчлал</small></div>
              <div><b class="a">${st.best}</b><small>Шилдэг оноо</small></div>
            </div>
            <h3 class="sec">Чадварууд</h3>
            <div class="skills">${skills}</div>
            <label class="box tgl">
              <div><b>Чансаанд нэрээ нуух</b><small>Бусдад "Нууц тоглогч" гэж харагдана</small></div>
              <input type="checkbox" data-hide${p.hidden ? ' checked' : ''}>
            </label>
          </div>
          ${dock('profile')}
        </section>`;
    }

    root.addEventListener('click', e => {
      if (e.target.closest('[data-act=edit]')) editProfile(root, draw);
    });
    root.addEventListener('change', e => {
      if (!e.target.matches('[data-hide]')) return;
      const v = e.target.checked;
      Game.setHidden(v);
      if (Api.registered()) Api.profile({ hidden: v }).then(r => { if (!r.ok) toast('Серверт хадгалж чадсангүй'); });
      toast(v ? 'Нэр нуугдлаа' : 'Нэр харагдана');
    });
    bindDock(root, nav, 'profile');
    draw();
    return { key(e) { if (e.key === 'Escape') nav.home(); } };
  }

  return { esc, post, toast, intro, home, play, end, review, board, profile };
})();
