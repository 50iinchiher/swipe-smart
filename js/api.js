// Серверийн API (netlify/functions/api.mjs). file:// дээр сервер байхгүй тул офлайн гэж үзнэ.
window.Api = (function () {
  'use strict';

  const BASE = 'api/';
  const online = /^https?:$/.test(location.protocol);

  function authHeader() {
    const p = Store.get('player', null);
    return p && p.id && p.token ? { Authorization: 'Bearer ' + p.id + '.' + p.token } : {};
  }

  // { ok, status, data } буцаана; сүлжээний алдаа = status 0
  function call(method, path, body) {
    if (!online) return Promise.resolve({ ok: false, status: 0, data: { error: 'Офлайн' } });
    const opts = { method, headers: Object.assign({}, authHeader()) };
    if (body) { opts.headers['content-type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return fetch(BASE + path, opts)
      .then(r => r.json().catch(() => ({})).then(data => ({ ok: r.ok, status: r.status, data })))
      .catch(() => ({ ok: false, status: 0, data: { error: 'Сервертэй холбогдож чадсангүй' } }));
  }

  function registered() { const p = Store.get('player', null); return !!(p && p.token); }

  function register(nick, cls) { return call('POST', 'register', { nick, cls }); }
  function profile(fields) { return call('POST', 'profile', fields); }
  function board(cat, period) { return call('GET', 'board?cat=' + encodeURIComponent(cat) + '&period=' + period); }
  function ranks() { return registered() ? call('GET', 'ranks') : Promise.resolve({ ok: false, status: 401, data: {} }); }

  // Ангиллын албан тоглолт. Сүлжээгүй бол дараалалд үлдээж дараа илгээнэ.
  function submit(game) {
    const play = { cat: game.cat, date: game.date, ids: game.ids, answers: game.answers.map(a => ({ id: a.id, ans: a.ans })) };
    const q = Store.get('pending', []);
    q.push(play);
    Store.set('pending', q);
    return flush().then(res => res[res.length - 1] || null);
  }

  // Илгээгээгүй тоглолтуудыг дахин илгээнэ. 4xx бол (давхар, буруу) хаяна.
  let flushing = null;
  function flush() {
    if (flushing) return flushing;
    if (!registered()) return Promise.resolve([]);
    const out = [];
    flushing = (function next() {
      const q = Store.get('pending', []);
      if (!q.length) return Promise.resolve(out);
      return call('POST', 'submit', q[0]).then(r => {
        if (r.status === 0 || r.status >= 500) return out;
        Store.set('pending', Store.get('pending', []).slice(1));
        out.push(r);
        return next();
      });
    })().then(r => { flushing = null; return r; });
    return flushing;
  }

  return { online, registered, register, profile, board, ranks, submit, flush };
})();
