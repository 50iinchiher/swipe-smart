// Swipe Smart API (Netlify Functions + Netlify Blobs).
//   POST /api/register  { nick, cls }              → { id, token, nick, cls, hidden }
//   POST /api/profile   { nick?, cls?, hidden? }   → { nick, cls, hidden }        (Authorization: Bearer id.token)
//   POST /api/submit    { cat, ids, answers }      → { pts, correct, rank, total }
//   GET  /api/board?cat=tech&period=week|all       → { rows, me, total }
//   GET  /api/ranks                                → { trend: { rank, score, total }, ... }
// Оноог сервер data/cards.js-ээс өөрөө тооцно. Ангилал бүрт өдөрт нэг л тоглолт тооцогдоно.
import { getStore } from '@netlify/blobs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

// cards.js, categories.js, rules.js нь window.* тодорхойлдог браузерын скрипт. esbuild функцтэй хамт багцална.
globalThis.window = globalThis.window || {};
let season = '';   // 's2/' гэх мэт: чансаа, тоглолтын түлхүүрийн угтвар (rules.js-ийн SEASON)
const ready = import('../../data/cards.js').then(() => import('../../data/cards-spam.js')).then(() => import('../../data/categories.js')).then(() => import('../../js/rules.js')).then(() => {
  const cards = window.CARDS || [], byId = {};
  window.RULES.validate(cards).forEach(w => console.warn(w));
  cards.forEach(p => { byId[p.id] = p; });
  const cats = window.RULES.categories(cards, window.CATEGORIES), pools = {};
  cats.forEach(c => { pools[c.id] = new Set(window.RULES.catPool(cards, c.id)); });
  season = 's' + window.RULES.SEASON + '/';
  return { R: window.RULES, byId, pools, boardCats: cats.filter(c => c.board).map(c => c.id) };
});

const store = () => getStore({ name: 'swipesmart', consistency: 'strong' });
const ANS = new Set(['true', 'false', 'unsure']);
const TOP = 100;

// ---------- Огноо (Улаанбаатарын цаг, UTC+8) ----------
function ubDate(ms) { return new Date((ms ?? Date.now()) + 8 * 36e5); }
function dayKey() { return ubDate().toISOString().slice(0, 10); }
function weekKey() {
  const d = ubDate();
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
}

// ---------- Туслахууд ----------
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
const fail = (status, error) => json(status, { error });
const sha = s => createHash('sha256').update(s).digest('hex');

function cleanNick(s) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 16); }
function nickKey(n) { return 'nicks/' + encodeURIComponent(n.toLowerCase()); }
function cleanCls(s) { return String(s || '').trim().toUpperCase().slice(0, 10); }

async function auth(req, s) {
  const m = /^Bearer\s+([\w-]+)\.([\w-]+)$/.exec(req.headers.get('authorization') || '');
  if (!m) return null;
  const p = await s.get('players/' + m[1], { type: 'json' });
  return p && p.tokenHash === sha(m[2]) ? p : null;
}

// Нэг blob-ыг давхар бичилтээс хамгаалж (ETag) шинэчилнэ
async function update(s, key, fn) {
  for (let i = 0; i < 8; i++) {
    const cur = await s.getWithMetadata(key, { type: 'json' });
    const next = fn(cur ? cur.data : {});
    const res = cur ? await s.setJSON(key, next, { onlyIfMatch: cur.etag }) : await s.setJSON(key, next, { onlyIfNew: true });
    if (res.modified) return next;
    await new Promise(r => setTimeout(r, 30 + Math.random() * 120));
  }
  throw new Error('busy');
}

function ranked(board) {
  return Object.keys(board).map(id => Object.assign({ id }, board[id])).sort((a, b) => b.s - a.s || a.t - b.t);
}
function boardKey(cat, period) { return season + 'board/' + (period === 'all' ? 'all' : weekKey()) + '/' + cat; }

// ---------- Үйлдлүүд ----------
async function register(req, s) {
  const body = await req.json().catch(() => ({}));
  const nick = cleanNick(body.nick);
  if (nick.length < 2) return fail(400, 'Хоч дор хаяж 2 тэмдэгт байна');
  const id = randomUUID().replace(/-/g, '').slice(0, 16), token = randomBytes(24).toString('base64url');
  const res = await s.setJSON(nickKey(nick), { id }, { onlyIfNew: true });
  if (!res.modified) return fail(409, 'Энэ хоч бүртгэлтэй байна. Өөр хоч сонго.');
  const p = { id, nick, cls: cleanCls(body.cls), hidden: false, tokenHash: sha(token), created: Date.now() };
  await s.setJSON('players/' + id, p);
  return json(200, { id, token, nick: p.nick, cls: p.cls, hidden: p.hidden });
}

async function profile(req, s, me, ctx) {
  const body = await req.json().catch(() => ({}));
  const p = Object.assign({}, me);
  if (body.nick != null) {
    const nick = cleanNick(body.nick);
    if (nick.length < 2) return fail(400, 'Хоч дор хаяж 2 тэмдэгт байна');
    if (nick.toLowerCase() !== me.nick.toLowerCase()) {
      const res = await s.setJSON(nickKey(nick), { id: me.id }, { onlyIfNew: true });
      if (!res.modified) return fail(409, 'Энэ хоч бүртгэлтэй байна. Өөр хоч сонго.');
      await s.delete(nickKey(me.nick));
    }
    p.nick = nick;
  }
  if (body.cls != null) p.cls = cleanCls(body.cls);
  if (body.hidden != null) p.hidden = !!body.hidden;
  await s.setJSON('players/' + me.id, p);

  // Энэ 7 хоног ба бүх цагийн самбар дээрх нэр, ангийг шинэчилнэ
  for (const cat of ctx.boardCats) {
    for (const period of ['week', 'all']) {
      const key = boardKey(cat, period), b = await s.get(key, { type: 'json' });
      if (b && b[me.id]) await update(s, key, d => { if (d[me.id]) Object.assign(d[me.id], { n: p.nick, c: p.cls, h: p.hidden }); return d; });
    }
  }
  return json(200, { nick: p.nick, cls: p.cls, hidden: p.hidden });
}

async function submit(req, s, me, ctx) {
  const body = await req.json().catch(() => ({}));
  const cat = String(body.cat || ''), pool = ctx.pools[cat];
  if (!pool || !ctx.boardCats.includes(cat)) return fail(400, 'Буруу ангилал');
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
  const answers = Array.isArray(body.answers) ? body.answers : [];
  const n = Math.min(ctx.R.PER_GAME, pool.size);
  if (ids.length !== n || new Set(ids).size !== n || !ids.every(id => pool.has(id))) return fail(400, 'Буруу багц');
  if (answers.length !== n || !answers.every((a, i) => a && a.id === ids[i] && ANS.has(a.ans))) return fail(400, 'Буруу хариулт');

  const day = dayKey();
  const sc = ctx.R.score(answers.map(a => ({ id: a.id, ans: a.ans })), n, ctx.byId);
  const once = await s.setJSON(season + 'plays/' + me.id + '/' + day + '/' + cat, { ids, answers, pts: sc.pts, at: Date.now() }, { onlyIfNew: true });
  if (!once.modified) return fail(409, 'Өнөөдөр энэ ангиллыг тоглосон байна');

  const add = d => {
    const e = d[me.id] || { s: 0 };
    d[me.id] = { n: me.nick, c: me.cls, h: me.hidden, s: e.s + sc.pts, t: Date.now() };
    return d;
  };
  const week = await update(s, boardKey(cat, 'week'), add);
  await update(s, boardKey(cat, 'all'), add);
  const rows = ranked(week);
  return json(200, { pts: sc.pts, correct: sc.correct, rank: rows.findIndex(r => r.id === me.id) + 1, total: rows.length });
}

function view(r, k, meId) {
  return { rank: k + 1, nick: r.h && r.id !== meId ? 'Нууц тоглогч' : r.n, cls: r.h ? '' : r.c || '', score: r.s, me: r.id === meId };
}

async function board(url, s, me, ctx) {
  const cat = url.searchParams.get('cat'), period = url.searchParams.get('period') === 'all' ? 'all' : 'week';
  if (!ctx.boardCats.includes(cat)) return fail(400, 'Буруу ангилал');
  const rows = ranked((await s.get(boardKey(cat, period), { type: 'json' })) || {});
  const meId = me && me.id, k = meId ? rows.findIndex(r => r.id === meId) : -1;
  return json(200, {
    rows: rows.slice(0, TOP).map((r, i) => view(r, i, meId)),
    me: k >= 0 ? view(rows[k], k, meId) : null,
    total: rows.length
  });
}

async function ranks(s, me, ctx) {
  const out = {};
  for (const cat of ctx.boardCats) {
    const rows = ranked((await s.get(boardKey(cat, 'week'), { type: 'json' })) || {});
    const k = me ? rows.findIndex(r => r.id === me.id) : -1;
    out[cat] = { rank: k >= 0 ? k + 1 : null, score: k >= 0 ? rows[k].s : 0, total: rows.length };
  }
  return json(200, out);
}

export default async (req, context) => {
  try {
    const ctx = await ready, s = store(), url = new URL(req.url);
    const action = context.params && context.params.action;
    if (req.method === 'POST' && action === 'register') return await register(req, s);
    const me = await auth(req, s);
    if (req.method === 'GET' && action === 'board') return await board(url, s, me, ctx);
    if (req.method === 'GET' && action === 'ranks') return await ranks(s, me, ctx);
    if (req.method === 'POST' && (action === 'profile' || action === 'submit')) {
      if (!me) return fail(401, 'Бүртгэл олдсонгүй');
      return action === 'profile' ? await profile(req, s, me, ctx) : await submit(req, s, me, ctx);
    }
    return fail(404, 'Олдсонгүй');
  } catch (e) {
    console.error(e);
    return fail(e.message === 'busy' ? 503 : 500, 'Серверийн алдаа');
  }
};

export const config = { path: '/api/:action' };
