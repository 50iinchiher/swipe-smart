// Өдрийн 10 · Хуурамч хаяг (category: "link") · одоогоор хоосон.
// Карт нэмэхэд энэ ангилал нүүр, чансаанд автоматаар гарч ирнэ. Нэр, дүрс, товчны нэр: data/categories.js.
// Бүтэц нь data/cards.js, data/cards-spam.js-тэй ижил. id-г "l001", "l002" ... гэж давтагдашгүй өг.
// post.kind: "facebook" | "messenger" | "sms" | "email" (байхгүй бол facebook). Зураг: images/link/...
//
// {
//   id: "l001", category: "link", answer: "false",          // "true" | "false" | "unsure"
//   post: { kind: "facebook", page: { name: "...", ini: "..", color: "#2563EB", verified: false },
//           time: "2 цаг", privacy: "🌐", image: { src: "images/link/l001.svg", alt: "..." },
//           reactions: { total: "1K", top: ["😮", "👍", "❤️"] }, comments: "120", shares: "300" },
//   text: "...", highlight: "текст дотроос", why: "...", technique: "...", clue: "...", tip: "🛡 ...",
//   source: { name: "...", url: "https://..." }, sources: [{ name: "...", url: "https://..." }], spread: "..."
// }

window.CARDS = (window.CARDS || []).concat([
]);
