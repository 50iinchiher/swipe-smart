// Тоглоомын дүрэм: ангилал, зөв/буруу, оноо. Браузер (game.js) ба сервер (netlify/functions/api.mjs) хоёулаа ашиглана.
window.RULES = (function () {
  'use strict';

  // need: нээгдэх XP. board: тусдаа чансаатай 3 ангилал.
  // Пул: topics (claims.js-ийн topic) + tag (posts.js-ийн cat) + ids + fbTop (хамгийн их хуваалцсан FB пост)
  const CATS = [
    { id: 'trend', name: 'Трэнд',       icon: 'flame',  board: true, topics: ['viral'], fbTop: 4 },
    { id: 'tech',  name: 'Тек',         icon: 'cpu',    board: true, topics: ['link'] },
    { id: 'sport', name: 'Спорт',       icon: 'ball',   board: true, topics: ['sport'], tag: 'sport' },
    { id: 'scam',  name: 'Луйвар',      icon: 'shield', need: 1000, topics: ['scam'], ids: ['p01', 'p11', 'p13', 'p06', 'p17', 's02'] },
    { id: 'eye',   name: 'Нүдний заль', icon: 'eye',    need: 2000, topics: ['eye'] },
    { id: 'facts', name: 'Баримт',      icon: 'book',   need: 3000, topics: ['myth', 'mongolia'] }
  ];
  const PER_GAME = 10;

  function catPool(posts, c) {
    const out = [], has = {};
    const add = p => { if (p && !has[p.id]) { has[p.id] = true; out.push(p.id); } };
    const byId = {};
    posts.forEach(p => { byId[p.id] = p; });
    posts.forEach(p => { if ((c.topics && c.topics.indexOf(p.topic) >= 0) || (c.tag && p.cat === c.tag)) add(p); });
    (c.ids || []).forEach(id => add(byId[id]));
    if (c.fbTop) posts.filter(p => p.set >= 1).slice().sort((a, b) => b.shares - a.shares).slice(0, c.fbTop).forEach(add);
    return out;
  }

  function truth(p) { return p.answer === 'unverified' ? 'unsure' : p.answer; }
  // ok: зөв · meh: үнэн/худал постыг "Эргэлзээтэй" · bad: буруу
  function judge(p, ans) {
    if (ans === truth(p)) return 'ok';
    return ans === 'unsure' ? 'meh' : 'bad';
  }

  // answers: [{ id, ans }], total: постын тоо, byId: { id: post }
  function score(answers, total, byId) {
    let pts = 0, run = 0, best = 0, correct = 0;
    const marks = [];
    answers.forEach(a => {
      const p = byId[a.id];
      if (!p) return;
      const r = judge(p, a.ans);
      marks.push(r);
      if (r === 'ok') {
        pts += 10; correct++; run++;
        if (run % 3 === 0) pts += 5;    // 3, 6, 9 дараалан зөв бүрд
        if (run > best) best = run;
      } else if (r === 'meh') {
        pts += 2;                       // streak тасрахгүй, нэмэгдэхгүй
      } else {
        run = 0;
      }
    });
    if (total && correct === total) pts += 10;
    return { pts, correct, total, best, marks };
  }

  return { CATS, PER_GAME, catPool, truth, judge, score };
})();
