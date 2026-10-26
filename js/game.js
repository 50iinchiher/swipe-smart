// Тоглоомын логик: өдрийн багц, дараалал, оноо, streak, түүх. DOM-гүй. Дүрэм нь rules.js-д, чансаа нь серверт (api.js).
window.Game = (function () {
  'use strict';

  const EPOCH = Date.UTC(2026, 9, 26);   // 2026-10-26 = №1, багц 1
  const DAY = 864e5;
  const PER_DAY = window.RULES.PER_GAME;
  const DOT = { ok: '🟩', meh: '🟨', bad: '🟥' };

  const R = window.RULES, CARDS = window.CARDS || [];
  // Ангиллууд cards.js-д байгаа category-уудаас (карттай нь л)
  const CATS = R.categories(CARDS, window.CATEGORIES);

  const byId = {};
  CARDS.forEach(p => { byId[p.id] = p; });

  // ---------- Огноо ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function todayKey() { return dateKey(new Date()); }
  function dayIndex() {
    const d = new Date();
    return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH) / DAY);
  }
  function edition() { return Math.max(1, dayIndex() + 1); }
  // Өдрийн 10-ыг өдрийн дугаараар (№) сонгоно. ?set=N → N дэх өдрийн багц.
  function todaySet() { return edition(); }
  function msToMidnight() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) - d;
  }

  // ---------- Санамсаргүй дараалал (хоч дээр суурилсан seed) ----------
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function shuffle(arr, seed) {
    let a = seed || 1;
    const rnd = () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  // ---------- Тоглогч ----------
  function player() { return Store.get('player', null); }
  function defaultNick() { return 'Анчин-' + (1000 + Math.floor(Math.random() * 9000)); }
  function savePlayer(nick, cls) {
    const p = {
      nick: String(nick || '').trim().slice(0, 16) || defaultNick(),
      cls: String(cls || '').trim().toUpperCase().slice(0, 10),
      hidden: !!(player() || {}).hidden
    };
    Store.set('player', Object.assign({}, player(), p));
    return p;
  }
  // Серверээс ирсэн бүртгэл (id, token, nick, cls, hidden)-ийг хадгална
  function setIdentity(d) {
    const p = Object.assign({}, player(), d);
    Store.set('player', p);
    return p;
  }
  function setHidden(v) { const p = player(); if (p) { p.hidden = !!v; Store.set('player', p); } }

  // ---------- Тоглолт ----------
  function post(id) { return byId[id]; }
  const truth = R.truth, judge = R.judge;

  // Хадгалсан тоглолтын бүх карт cards.js-д байгаа эсэх (карт сольсны дараа хуучин тоглолтыг хаяна)
  function valid(game) { return !!(game && game.ids && game.ids.length && game.ids.every(id => byId[id])); }

  // Өдрийн багц: ангилал бүрээс ээлжлэн нэг нэгээр 10 карт (карт цөөн бол байгаа нь бүгд).
  // Хүн бүрт ижил картууд, харин дараалал нь хочоор санамсаргүй.
  function dailyIds(day) {
    const groups = {};
    CARDS.forEach(p => { (groups[p.category] = groups[p.category] || []).push(p.id); });
    const lists = shuffle(Object.keys(groups).sort(), hash('day|' + day)).map(k => {
      const l = shuffle(groups[k], hash(k)), off = (day * 2) % l.length;
      return l.slice(off).concat(l.slice(0, off));
    });
    const out = [];
    for (let r = 0; out.length < PER_DAY && r < 99; r++) {
      lists.forEach(l => { if (out.length < PER_DAY && r < l.length) out.push(l[r]); });
    }
    return out;
  }
  function newGame(set, practice) {
    const p = player() || { nick: '' };
    return {
      date: todayKey(), set, practice: !!practice,
      ids: shuffle(dailyIds(set), hash(p.nick + '|' + set)),
      answers: []
    };
  }

  // ---------- Ангилал ----------
  function catPool(c) { return R.catPool(CARDS, c.id); }
  // Ангилал бүрт өдрийн анхны тоглолт л тооцогдоно (чансаа, XP). Дахин тоглох = дадлага.
  // catLog: { 'YYYY-MM-DD': { trend: { ids, answers, pts, correct } } }
  function catLog() { return Store.get('catLog', {}); }
  function catPlayedToday(id) { const d = catLog()[todayKey()]; return !!(d && d[id]); }
  function cats() {
    const x = xp();
    return CATS.map(c => Object.assign({}, c, { locked: (c.need || 0) > x, played: catPlayedToday(c.id) }));
  }
  function boardCats() { return CATS.filter(c => c.board); }
  function catInfo(id) { return CATS.find(x => x.id === id) || { id, name: id || '', icon: 'tag' }; }
  function catName(id) { return catInfo(id).name; }
  function newCatGame(id) {
    const c = CATS.find(x => x.id === id), today = todayKey();
    const cur = Store.get('catCur', {})[id];
    if (cur && cur.date === today && valid(cur) && cur.answers.length < cur.ids.length) return cur;
    const practice = catPlayedToday(id);
    const p = player() || { nick: '' };
    const seed = practice ? (Math.random() * 4294967296) >>> 0 : hash(p.nick + '|' + id + '|' + today);
    return { date: today, cat: id, set: 0, practice, ids: shuffle(catPool(c), seed).slice(0, PER_DAY), answers: [] };
  }

  // Бүх албан тоглолт (өдрийн 10 + ангилал)
  function plays() {
    const h = history(), L = catLog(), out = [];
    Object.keys(h).forEach(d => out.push(h[d]));
    Object.keys(L).forEach(d => Object.keys(L[d]).forEach(c => out.push(L[d][c])));
    return out;
  }

  // XP = бүх албан тоглолтын онооны нийлбэр
  function xp() { return plays().reduce((s, g) => s + g.pts, 0); }
  // Түвшин: нээгдэх босго бүр нэг түвшин
  function level() {
    const x = xp(), locks = CATS.filter(c => c.need).sort((a, b) => a.need - b.need);
    const done = locks.filter(c => c.need <= x), next = locks.find(c => c.need > x);
    const prev = done.length ? done[done.length - 1].need : 0;
    if (!next) return { lv: done.length + 1, pct: 1, next: null };
    return { lv: done.length + 1, pct: (x - prev) / (next.need - prev), next: next.need, nextName: next.name };
  }

  // Профайл: тоглолт, нарийвчлал, шилдэг оноо, аргын төрөл бүрээр зөв/нийт
  function stats() {
    const all = plays(), tech = {};
    let correct = 0, n = 0, best = 0;
    all.forEach(g => {
      correct += g.correct; n += g.ids.length; best = Math.max(best, g.pts);
      g.answers.forEach(a => {
        const p = byId[a.id];
        if (!p) return;
        const t = tech[p.technique] = tech[p.technique] || { ok: 0, n: 0 };
        t.n++;
        if (judge(p, a.ans) === 'ok') t.ok++;
      });
    });
    return { plays: all.length, acc: n ? Math.round(correct / n * 100) : null, best, tech };
  }

  function current() { return Store.get('current', null); }
  function saveCurrent(game) {
    if (!game.cat) { Store.set('current', game); return; }
    if (game.practice) return;
    const c = Store.get('catCur', {});
    c[game.cat] = game;
    Store.set('catCur', c);
  }

  function score(game) { return R.score(game.answers, game.ids.length, byId); }

  function mistakes(game) {
    return game.answers
      .map(a => ({ ans: a.ans, post: byId[a.id] }))
      .filter(x => x.post && judge(x.post, x.ans) !== 'ok');
  }

  // Зөвхөн өдрийн анхны (албан) оролдлого түүхэнд орно
  function history() { return Store.get('history', {}); }
  function finish(game) {
    const s = score(game);
    game.gained = 0;
    if (game.cat) {
      if (game.practice) return;
      const L = catLog(), d = L[game.date] = L[game.date] || {};
      d[game.cat] = { ids: game.ids, answers: game.answers, pts: s.pts, correct: s.correct };
      Store.set('catLog', L);
      const c = Store.get('catCur', {});
      delete c[game.cat];
      Store.set('catCur', c);
      game.gained = s.pts;
      if (boardCats().some(x => x.id === game.cat)) game.sync = Api.submit(game).then(r => { if (r && r.ok) cacheRank(game.cat, r.data); return r; });
      return;
    }
    if (!game.practice) {
      const h = history();
      h[game.date] = { set: game.set, ids: game.ids, answers: game.answers, pts: s.pts, correct: s.correct };
      Store.set('history', h);
      game.gained = s.pts;
    }
    Store.set('current', null);
  }
  function todayRecord() {
    const r = history()[todayKey()];
    return r ? { date: todayKey(), set: r.set, ids: r.ids, answers: r.answers, practice: false } : null;
  }
  function playedToday() { return !!history()[todayKey()]; }

  function dayStreak() {
    const h = history(), d = new Date();
    if (!h[dateKey(d)]) d.setDate(d.getDate() - 1);
    let n = 0;
    while (h[dateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- Чансаа (сервер). Нүүрэнд харуулах байрыг энд хадгална ----------
  function msToMonday() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 - (d.getDay() + 6) % 7) - d;
  }
  function ranks() { return Store.get('ranks', {}); }
  function cacheRank(cat, r) { const all = ranks(); all[cat] = { rank: r.rank, total: r.total }; Store.set('ranks', all); }
  function refreshRanks() {
    return Api.ranks().then(r => { if (r.ok) Store.set('ranks', r.data); return ranks(); });
  }

  // Бүх албан тоглолт (+ дадлагын тоглолт) дотроос хамгийн их алдсан арга
  function weakness(extra) {
    const games = plays();
    if (extra && extra.practice) games.push(extra);
    const cnt = {}, tip = {};
    games.forEach(g => mistakes(g).forEach(m => {
      const t = m.post.technique;
      if (!t) return;
      cnt[t] = (cnt[t] || 0) + 1;
      if (m.post.tip) tip[t] = m.post.tip;
    }));
    let top = null;
    Object.keys(cnt).forEach(k => { if (!top || cnt[k] > cnt[top]) top = k; });
    if (!top) return null;
    return { label: top, tip: tip[top] || '', count: cnt[top] };
  }

  // Хариултыг ил гаргахгүй хуваалцах мөр
  function shareText(game) {
    const s = score(game);
    const url = /^https?:$/.test(location.protocol) ? ' ' + location.origin + location.pathname : '';
    const title = game.cat ? catName(game.cat) : 'Өдрийн 10 №' + edition();
    return 'Swipe Smart · ' + title + ' · ' + s.correct + '/' + s.total + ' 🔥' + s.best + '\n' +
      s.marks.map(m => DOT[m]).join('') + '\n' +
      'Чи хэд авах вэ?' + url;
  }

  // Профайлын "Чадварууд": cards.js-д байгаа бүх technique (давтагдашгүй, анх гарсан дарааллаар)
  function techniques() {
    const out = [];
    CARDS.forEach(c => { if (c.technique && out.indexOf(c.technique) < 0) out.push(c.technique); });
    return out;
  }

  return {
    DOT, PER_DAY, pad, edition, todaySet, todayKey, msToMidnight, msToMonday, hash,
    player, defaultNick, savePlayer, setIdentity, setHidden,
    post, valid, techniques, truth, judge, newGame, current, saveCurrent, score, mistakes, finish,
    cats, boardCats, catInfo, catName, newCatGame, xp, level, stats,
    todayRecord, playedToday, dayStreak, ranks, refreshRanks, weakness, shareText
  };
})();
