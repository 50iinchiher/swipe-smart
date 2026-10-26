// Карт чирэх (Pointer Events): баруун = Үнэн, зүүн = Худал, дээш = Эргэлзээтэй.
window.Swipe = (function () {
  'use strict';

  const THRESHOLD = 100;

  function buzz(ms) {
    try {
      const ua = navigator.userActivation;
      if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate(ms);
    } catch (e) { /* дэмжихгүй */ }
  }

  function dirOf(dx, dy) {
    if (-dy > Math.abs(dx) && -dy > 12) return 'unsure';
    if (Math.abs(dx) > 12) return dx > 0 ? 'true' : 'false';
    return null;
  }
  function powerOf(dir, dx, dy) {
    if (!dir) return 0;
    return (dir === 'unsure' ? -dy : Math.abs(dx)) / THRESHOLD;
  }

  function paint(card, dx, dy, dir, p) {
    card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + dx / 20 + 'deg)';
    if (dir) card.dataset.dir = dir; else delete card.dataset.dir;
    card.style.setProperty('--p', Math.min(1, p).toFixed(3));
  }

  // o: canSwipe() · onTap() · onHot(dir, power) · onFling(dir) · onCommit(dir)
  function attach(card, o) {
    let pid = null, sx = 0, sy = 0, dx = 0, dy = 0, moved = false, armed = false, done = false;

    function springBack() {
      card.style.transition = 'transform .45s cubic-bezier(.2,1.5,.4,1)';
      paint(card, 0, 0, null, 0);
      card.style.transform = '';
      o.onHot(null, 0);
    }

    function fling(dir) {
      if (done) return;
      done = true;
      buzz(15);
      o.onFling(dir);
      const W = window.innerWidth, H = window.innerHeight;
      let tx, ty;
      if (dir === 'unsure') { tx = dx * 1.5; ty = -H * 1.1; }
      else { tx = (dir === 'true' ? 1 : -1) * Math.max(W, 420) * 1.3; ty = dy * 1.5 + 30; }
      card.style.transition = 'transform .28s ease-in';
      card.dataset.dir = dir;
      card.style.setProperty('--p', 1);
      card.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + Math.max(-30, Math.min(30, tx / 20)) + 'deg)';
      setTimeout(() => o.onCommit(dir), 260);
    }

    card.addEventListener('pointerdown', e => {
      if (done || pid !== null || (e.button && e.button !== 0)) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0; moved = false; armed = false;
      try { card.setPointerCapture(pid); } catch (err) { /* ignore */ }
      card.style.transition = 'none';
    });

    card.addEventListener('pointermove', e => {
      if (e.pointerId !== pid) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      if (!o.canSwipe()) { paint(card, dx * 0.15, dy * 0.15, null, 0); return; }  // түр зогсолт: бага зэрэг хөдөлж, буцна
      const dir = dirOf(dx, dy), p = powerOf(dir, dx, dy);
      paint(card, dx, dy, dir, p);
      o.onHot(dir, p);
      if ((p >= 1) !== armed) { armed = p >= 1; if (armed) buzz(8); }
    });

    function release(e) {
      if (e.pointerId !== pid) return;
      pid = null;
      if (!moved) {
        card.style.transition = '';
        if (e.type === 'pointerup') o.onTap();
        return;
      }
      const dir = dirOf(dx, dy);
      if (e.type === 'pointerup' && o.canSwipe() && dir && powerOf(dir, dx, dy) >= 1) fling(dir);
      else springBack();
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);

    return { fling: dir => { dx = 0; dy = 0; fling(dir); } };
  }

  return { attach, buzz };
})();
