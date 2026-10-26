// localStorage-ийн нимгэн давхарга. Хөтөч хориглосон бол санах ойд үргэлжилнэ.
window.Store = (function () {
  'use strict';

  const PREFIX = 'odriin5:';
  const mem = {};
  let ls = null;
  try {
    localStorage.setItem(PREFIX + 't', '1');
    localStorage.removeItem(PREFIX + 't');
    ls = localStorage;
  } catch (e) { ls = null; }

  function get(key, fallback) {
    let raw = null;
    if (key in mem) raw = mem[key];
    else if (ls) { try { raw = ls.getItem(PREFIX + key); } catch (e) { raw = null; } }
    if (raw == null) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function set(key, value) {
    const raw = JSON.stringify(value);
    mem[key] = raw;
    if (ls) { try { ls.setItem(PREFIX + key, raw); } catch (e) { /* санах ойд л үлдэнэ */ } }
  }

  function clear() {
    Object.keys(mem).forEach(k => delete mem[k]);
    if (!ls) return;
    try {
      for (let i = ls.length - 1; i >= 0; i--) {
        const k = ls.key(i);
        if (k && k.indexOf(PREFIX) === 0) ls.removeItem(k);
      }
    } catch (e) { /* ignore */ }
  }

  return { get, set, clear };
})();
