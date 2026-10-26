// Тоглоомын дүрэм: ангилал, зөв/буруу, оноо. Браузер (game.js) ба сервер (netlify/functions/api.mjs) хоёулаа ашиглана.
window.RULES = (function () {
  'use strict';

  // need: нээгдэх XP. pool: постын id-ууд (эсвэл posts.js-ийн cat талбараар)
  // board: тусдаа чансаатай 3 ангилал
  const CATS = [
    { id: 'trend',  name: 'Трэнд',       icon: 'flame',  board: true },
    { id: 'tech',   name: 'Тек',         icon: 'cpu',    board: true, ids: ['p04', 'p06', 'p10', 'p11', 'p12', 'p14', 'p20'] },
    { id: 'sport',  name: 'Спорт',       icon: 'ball',   board: true, tag: 'sport' },
    { id: 'scam',   name: 'Луйвар',      icon: 'shield', need: 1000, ids: ['p01', 'p11', 'p13', 'p06', 'p17', 's02'] },
    { id: 'health', name: 'Эрүүл мэнд',  icon: 'heart',  need: 2000, ids: ['p07', 'p17', 'p03', 'p02', 'p05'] },
    { id: 'nature', name: 'Байгаль',     icon: 'leaf',   need: 3000, ids: ['p02', 'p03', 'p08', 'p16', 'p15'] }
  ];
  const PER_GAME = 5;

  function catPool(posts, c) {
    if (c.id === 'trend') {
      // Хамгийн их хуваалцсан 8 пост
      return posts.filter(p => p.set >= 1).slice().sort((a, b) => b.shares - a.shares).slice(0, 8).map(p => p.id);
    }
    if (c.tag) return posts.filter(p => p.cat === c.tag).map(p => p.id);
    const ok = {};
    posts.forEach(p => { ok[p.id] = true; });
    return c.ids.filter(id => ok[id]);
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
        if (run === 3) pts += 5;
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
