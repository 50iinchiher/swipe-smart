// Тоглоомын дүрэм: ангилал, зөв/буруу, оноо. Браузер (game.js) ба сервер (netlify/functions/api.mjs) хоёулаа ашиглана.
window.RULES = (function () {
  'use strict';

  const PER_GAME = 10;
  // Чансааны улирал. Дүрэм өөрчлөгдөхөд нэмэгдүүлбэл бүх чансаа тэгээс эхэлнэ (хоч хэвээр).
  // 2: 10 карт, буруу −5, 🔥3+ бол +15 (2026.10.26)
  // 3: шинэ картууд (Трэнд, Спам), чансааг тэглэсэн (2026.10.27)
  const SEASON = 3;
  const ANSWERS = ['true', 'false', 'unsure'];

  // Ангиллууд cards.js-ийн category-уудаас автоматаар. Нэр, дүрс, board, need нь categories.js-ээс.
  // Дараалал: categories.js-ийн дараалал, дараа нь тэнд байхгүй category-ууд.
  function categories(cards, meta) {
    meta = meta || {};
    const count = {};
    cards.forEach(c => { count[c.category] = (count[c.category] || 0) + 1; });
    const order = Object.keys(meta).concat(Object.keys(count).filter(k => !meta[k]));
    return order.filter(k => count[k]).map(k =>
      Object.assign({ name: k, icon: 'tag' }, meta[k], { id: k, count: count[k] }));
  }
  function catPool(cards, id) { return cards.filter(c => c.category === id).map(c => c.id); }

  function truth(p) { return p.answer === 'unverified' ? 'unsure' : p.answer; }
  // ok: зөв · meh: үнэн/худал картыг "Эргэлзээтэй" · bad: буруу
  function judge(p, ans) {
    if (ans === truth(p)) return 'ok';
    return ans === 'unsure' ? 'meh' : 'bad';
  }

  // cards.js-ийн алдааг жагсаана (консолд анхааруулга болгон гаргана)
  function validate(cards) {
    const out = [], seen = {};
    if (!Array.isArray(cards)) return ['window.CARDS массив биш байна'];
    cards.forEach((c, i) => {
      const at = 'cards.js #' + (i + 1) + ' (' + (c && c.id || 'id алга') + '): ';
      if (!c || typeof c !== 'object') { out.push(at + 'объект биш'); return; }
      if (!c.id) out.push(at + 'id хоосон');
      else if (seen[c.id]) out.push(at + 'id давхардсан');
      seen[c.id] = true;
      if (!c.category) out.push(at + 'category хоосон');
      if (!c.text) out.push(at + 'text хоосон');
      if (ANSWERS.indexOf(c.answer) < 0) out.push(at + 'answer нь "true", "false", "unsure"-ийн нэг байх ёстой (одоо: ' + JSON.stringify(c.answer) + ')');
      if (c.highlight && String(c.text || '').indexOf(c.highlight) < 0) out.push(at + 'highlight текст дотор алга: ' + JSON.stringify(c.highlight));
      if (!c.why) out.push(at + 'why хоосон');
      if (!c.technique) out.push(at + 'technique хоосон');
      if (!c.source || !c.source.url) out.push(at + 'source.url хоосон');
    });
    return out;
  }

  // Оноо: зөв +10 (🔥3-аас дээш дараалсан бол +15), буруу −5, эргэлзээтэй 0, бүгд зөв бол +20.
  // Тоглолтын оноо 0-ээс доош буухгүй. Хурд нөлөөгүй.
  const POINTS = { ok: 10, combo: 5, comboFrom: 3, bad: -5, meh: 0, perfect: 20 };

  // answers: [{ id, ans }], total: картын тоо, byId: { id: card }
  // steps[k]: k дахь хариултаар оноо яг хэдээр өөрчлөгдсөн (d), тэр үеийн streak (run)
  function score(answers, total, byId) {
    let pts = 0, run = 0, best = 0, correct = 0;
    const marks = [], steps = [];
    answers.forEach(a => {
      const p = byId[a.id];
      if (!p) return;
      const r = judge(p, a.ans);
      let d = POINTS.meh;                 // эргэлзээтэй: streak хадгална
      if (r === 'ok') {
        correct++; run++;
        if (run > best) best = run;
        d = POINTS.ok + (run >= POINTS.comboFrom ? POINTS.combo : 0);
      } else if (r === 'bad') {
        run = 0;
        d = POINTS.bad;
      }
      const before = pts;
      pts = Math.max(0, pts + d);
      marks.push(r);
      steps.push({ r, d: pts - before, run });
    });
    const perfect = total > 0 && correct === total;
    if (perfect) pts += POINTS.perfect;
    return { pts, correct, total, best, marks, steps, perfect };
  }

  return { PER_GAME, SEASON, POINTS, ANSWERS, categories, catPool, truth, judge, validate, score };
})();
