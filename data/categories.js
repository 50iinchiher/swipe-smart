// Ангиллын монгол нэр, дүрс, тохиргоо. Апп зөвхөн карттай ангиллыг харуулна:
// доорх ангилалд карт нэмэхэд (data/cards-<id>.js) нүүр, чансаанд автоматаар гарч ирнэ.
// Энд байхгүй category карт дээр гарвал нэр нь id-гаараа, ерөнхий дүрстэй харагдана.
//   name   — нүүр, чансаа, картын шошгон дээрх нэр
//   icon   — flame, cpu, ball, shield, heart, leaf, eye, book, flag, link, tag, эсвэл emoji ("🎣")
//   board  — true бол тусдаа долоо хоногийн чансаатай
//   need   — нээгдэхэд шаардлагатай XP (байхгүй бол шууд нээлттэй)
//   labels — товч, тамга, алдааны дүнгийн нэр (байхгүй бол Худал / Үнэн / Эргэлзээтэй). Хариултын утга хэвээр.
// Дараалал = нүүрэн дээрх дараалал.
window.CATEGORIES = {
  // ---- Одоо карттай
  trend:    { name: 'Трэнд',           icon: 'flame', board: true },
  spam:     { name: 'Спам & Луйвар',   icon: '🎣',    board: true, labels: { false: 'Луйвар', true: 'Жинхэнэ', unsure: 'Шалгах' } },

  // ---- Ирээдүйд (карт нэмэхэд гарч ирнэ)
  ai:       { name: 'AI & Deepfake',   icon: '🤖',    board: true, labels: { false: 'AI / Хуурамч', true: 'Бодит', unsure: 'Шалгах' } },
  photo:    { name: 'Зураг & Бичлэг',  icon: '📸',    board: true, labels: { false: 'Хуурамч', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  link:     { name: 'Хуурамч хаяг',    icon: '🔗',    board: true, labels: { false: 'Хуурамч', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  health:   { name: 'Эрүүл мэнд',      icon: '💊',    board: true },
  science:  { name: 'Шинжлэх ухаан',   icon: '🔬',    board: true },
  money:    { name: 'Санхүү & Крипто', icon: '💰',    board: true, labels: { false: 'Луйвар', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  ad:       { name: 'Зар & Бараа',     icon: '🛍️',    board: true, labels: { false: 'Хуурамч', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  sport:    { name: 'Спорт',           icon: '⚽',    board: true },
  tech:     { name: 'Технологи',       icon: '📱',    board: true },
  mongolia: { name: 'Монгол',          icon: 'flag',  board: true },
  myth:     { name: 'Домог',           icon: '🧐',    board: true },
  nature:   { name: 'Байгаль орчин',   icon: '🌿',    board: true }
};
