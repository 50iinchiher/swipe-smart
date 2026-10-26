// Router ба эхлүүлэх. ?reset=1 бүгдийг цэвэрлэнэ, ?set=N нь N дэх өдрийн 10 постыг анхны оролдлогоор тоглуулна.
(function () {
  'use strict';

  const app = document.getElementById('app');
  if (!window.POSTS || !window.POSTS.length) {
    app.innerHTML = '<p class="fatal">data/posts.js ачаалагдсангүй.</p>';
    return;
  }

  const q = new URLSearchParams(location.search);
  if (q.get('reset')) Store.clear();
  // Шинэ улирал: тоглолт, оноо, чансааны өгөгдлийг цэвэрлэнэ. Хоч (бүртгэл) үлдэнэ.
  if (Store.get('season', 1) !== RULES.SEASON) {
    ['history', 'current', 'catLog', 'catCur', 'pending', 'ranks', 'xpSeen'].forEach(Store.remove);
    Store.set('season', RULES.SEASON);
  }
  let forcedSet = parseInt(q.get('set'), 10) || 0;
  if (forcedSet < 1) forcedSet = 0;
  if (q.has('reset') || q.has('set')) {
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* file:// дээр болохгүй байж болно */ }
  }

  let screen = null;
  let stack = [];

  // Дэлгэц бүр шинэ контейнер авна: хуучин дэлгэцийн listener-үүд хамт устана
  function render(name, data) {
    if (screen && screen.destroy) screen.destroy();
    app.innerHTML = '';
    const host = document.createElement('div');
    host.className = 'host';
    app.appendChild(host);
    screen = Screens[name](host, nav, data) || {};
  }

  const nav = {
    go(name, data) { stack.push([name, data || {}]); render(name, data || {}); },
    back() {
      stack.pop();
      if (!stack.length) stack.push(['home', {}]);
      const prev = stack[stack.length - 1];
      render(prev[0], prev[1]);
    },
    // Түүхийг "Нүүр"-ээр эхлүүлээд шинэ дэлгэц нээнэ (тоглолт руу буцахгүй)
    reset(name, data) { stack = [['home', {}]]; if (name === 'home') render('home', {}); else nav.go(name, data); },
    home() { nav.reset('home'); },
    start(practice) {
      let game;
      if (forcedSet) {
        game = Game.newGame(forcedSet, false);
        forcedSet = 0;
      } else {
        const set = Game.todaySet(), cur = Game.current();
        if (cur && cur.date === Game.todayKey() && cur.set === set && !!cur.practice === !!practice && cur.answers.length < cur.ids.length) {
          game = cur;
        } else {
          game = Game.newGame(set, practice);
        }
      }
      nav.reset('play', { game });
    },
    startCat(id) { nav.reset('play', { game: Game.newCatGame(id) }); },
    // Хоч оруулсны дараа: шүүгчийн ?set= байвал шууд тоглоно, үгүй бол Нүүр
    afterIntro() { if (forcedSet) nav.start(false); else nav.home(); }
  };

  document.addEventListener('keydown', e => {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (screen && screen.key) screen.key(e);
  });

  if (!Game.player()) nav.reset('intro');
  else if (forcedSet) nav.start(false);
  else nav.home();
})();
