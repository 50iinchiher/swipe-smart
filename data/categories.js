// Ангиллын монгол нэр, дүрс, тохиргоо. Апп зөвхөн cards.js-д карттай ангиллыг харуулна.
// Энд байхгүй category cards.js-д гарвал нэр нь id-гаараа, ерөнхий дүрстэй харагдана.
//   name  — нүүр, чансаа, картын шошгон дээрх нэр
//   icon  — flame, cpu, ball, shield, heart, leaf, eye, book, flag, link, tag
//   board — true бол тусдаа долоо хоногийн чансаатай
//   need  — нээгдэхэд шаардлагатай XP (байхгүй бол шууд нээлттэй)
// Дараалал = нүүрэн дээрх дараалал.
window.CATEGORIES = {
  trend:  { name: 'Трэнд',       icon: 'flame',  board: true },
  tech:   { name: 'Тек',         icon: 'cpu',    board: true },
  sport:  { name: 'Спорт',       icon: 'ball',   board: true },
  scam:   { name: 'Луйвар',      icon: 'shield', need: 1000 },
  health: { name: 'Эрүүл мэнд',  icon: 'heart',  need: 2000 },
  myth:   { name: 'Домог',       icon: 'book',   need: 3000 },
  nature: { name: 'Байгаль',     icon: 'leaf',   need: 3000 }
};
