// Өдрийн 10 · Зар & Бараа (category: "ad") · одоогоор хоосон.
// Карт нэмэхэд энэ ангилал нүүр, чансаанд автоматаар гарч ирнэ. Нэр, дүрс, товчны нэр: data/categories.js.
// Бүтэц нь data/cards.js, data/cards-spam.js-тэй ижил. id-г "ad001", "ad002" ... гэж давтагдашгүй өг.
// post.kind: "facebook" | "messenger" | "sms" | "email" (байхгүй бол facebook). Зураг: images/ad/...
//
// {
//   id: "ad001", category: "ad", answer: "false",          // "true" | "false" | "unsure"
//   post: { kind: "facebook", page: { name: "...", ini: "..", color: "#2563EB", verified: false },
//           time: "2 цаг", privacy: "🌐", image: { src: "images/ad/ad001.svg", alt: "..." },
//           reactions: { total: "1K", top: ["😮", "👍", "❤️"] }, comments: "120", shares: "300" },
//   text: "...", highlight: "текст дотроос", why: "...", technique: "...", clue: "...", tip: "🛡 ...",
//   source: { name: "...", url: "https://..." }, sources: [{ name: "...", url: "https://..." }], spread: "..."
// }

window.CARDS = (window.CARDS || []).concat([
]);
