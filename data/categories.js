// Ангиллын монгол нэр, дүрс, тохиргоо. Апп зөвхөн карттай ангиллыг харуулна:
// доорх ангилалд карт нэмэхэд (data/cards-<id>.js) нүүр, чансаанд автоматаар гарч ирнэ.
// Энд байхгүй category карт дээр гарвал нэр нь id-гаараа, ерөнхий дүрстэй харагдана.
//   name   — нүүр, чансаа, картын шошгон дээрх нэр
//   icon   — SVG дүрс: flame, fish, bot, camera, link, pill, flask, coins, bag, ball, phone, flag, book, leaf, shield, eye, cpu, tag
//   board  — true бол тусдаа долоо хоногийн чансаатай
//   need   — нээгдэхэд шаардлагатай XP (байхгүй бол шууд нээлттэй)
//   labels — товч, тамга, алдааны дүнгийн нэр (байхгүй бол Худал / Үнэн / Эргэлзээтэй). Хариултын утга хэвээр.
// Дараалал = нүүрэн дээрх дараалал.
window.CATEGORIES = {
  // ---- Одоо карттай
  trend:    { name: 'Трэнд',           icon: 'flame', board: true },
  spam:     { name: 'Спам & Луйвар',   icon: 'fish',    board: true, labels: { false: 'Луйвар', true: 'Жинхэнэ', unsure: 'Шалгах' } },

  // ---- Ирээдүйд (карт нэмэхэд гарч ирнэ)
  ai:       { name: 'AI & Deepfake',   icon: 'bot',    board: true, labels: { false: 'AI / Хуурамч', true: 'Бодит', unsure: 'Шалгах' } },
  photo:    { name: 'Зураг & Бичлэг',  icon: 'camera',    board: true, labels: { false: 'Хуурамч', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  link:     { name: 'Хуурамч хаяг',    icon: 'link',    board: true, labels: { false: 'Хуурамч', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  health:   { name: 'Эрүүл мэнд',      icon: 'pill',    board: true },
  science:  { name: 'Шинжлэх ухаан',   icon: 'flask',    board: true },
  money:    { name: 'Санхүү & Крипто', icon: 'coins',    board: true, labels: { false: 'Луйвар', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  ad:       { name: 'Зар & Бараа',     icon: 'bag',    board: true, labels: { false: 'Хуурамч', true: 'Жинхэнэ', unsure: 'Шалгах' } },
  sport:    { name: 'Спорт',           icon: 'ball',    board: true },
  tech:     { name: 'Технологи',       icon: 'phone',    board: true },
  mongolia: { name: 'Монгол',          icon: 'flag',  board: true },
  myth:     { name: 'Домог',           icon: 'book',    board: true },
  nature:   { name: 'Байгаль орчин',   icon: 'leaf',    board: true }
};
