// data/questions.csv → data/claims.js
// Ажиллуулах: node tools/csv-to-claims.mjs
// Асуулт нэмэх/засахдаа CSV-гээ засаад энэ скриптийг дахин ажиллуул. claims.js-ийг гараар бүү засаарай.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

// Сэдэв → topic id (rules.js-ийн CATS эдгээрээр шүүнэ)
const TOPICS = {
  'Энэ 7 хоногийн вирал': 'viral',
  'Хуурамч хаяг': 'link',
  'Луйврын мессеж': 'scam',
  'Нүдний заль': 'eye',
  'Түгээмэл домог': 'myth',
  'NBA ба спорт': 'sport',
  'Монголын баримт': 'mongolia'
};

// Чадвар → TECHNIQUES-ийн id, ерөнхий сануулга (tip), картын ар талын сэжүүр (clue)
const SKILLS = {
  'AI контент таних':          ['ai',       'Анх хэн нийтэлснийг, AI шошго байгаа эсэхийг шалга.',         'Анх хэн нийтэлсэн бэ? AI шошго, хачин хуруу, гэрэл сүүдэр байна уу?'],
  'Хуучин/өөр бичлэг таних':   ['oldvideo', 'Урвуу зураг хайлтаар хаана, хэзээ бичигдсэнийг ол.',           'Энэ бичлэг яг хаана, хэзээ бичигдсэн бэ?'],
  'Эх сурвалж шалгах':         ['source',   'Албан ёсны эсвэл итгэлтэй хэд хэдэн эх сурвалжаас шалга.',     'Хэн хэлсэн бэ? Албан ёсны эх сурвалж баталж байна уу?'],
  'Үсэг тулгах':               ['letters',  'Үсэг бүрийг уншаарай: rn↔m, 0↔o, 1↔l↔I, кирилл↔латин.',       'Үсэг бүрийг нэг нэгээр нь уншаарай. rn↔m, 0↔o, 1↔l↔I?'],
  'Домэйн унших':              ['domain',   'Хаягийн жинхэнэ эзэн бол .com/.net-ийн яг өмнөх хэсэг.',       'Хаягийн төгсгөлийг хар. Жинхэнэ эзэн нь хэн бэ?'],
  'Код хамгаалах':             ['code',     'Баталгаажуулах кодоо хэнд ч, хэзээ ч бүү өг.',                  'Баталгаажуулах кодыг хэн асууж болох вэ?'],
  'Өөр сувгаар шалгах':        ['channel',  'Мөнгө гуйвал утсаар эсвэл биечлэн баталгаажуул.',              'Өөр сувгаар (утсаар, биечлэн) шалгаж болох уу?'],
  'Мөнгө/мэдээлэл нэхэх шинж': ['ask',      'Урьдчилж мөнгө, код, хувийн мэдээлэл нэхвэл луйвар.',          'Танаас мөнгө, код, хувийн мэдээлэл нэхэж байна уу?'],
  'Яаруулах шинж':             ['hurry',    'Цаг тоолж яаруулбал зогсоод бод.',                              'Яаруулж байна уу? Яагаад?'],
  'Анхааралтай унших':         ['read',     'Үг бүрийг яаралгүй уншаарай.',                                  'Үг бүрийг яаралгүй, дахин нэг уншаарай.'],
  'Яаралгүй бодох':            ['slow',     'Анх бодогдсон хариултаа нэг удаа давтан шалга.',                'Анх бодогдсон хариулт зөв үү? Дахин бод.'],
  'Домгийг шалгах':            ['myth',     'Олон давтагдсан нь үнэн гэсэн үг биш. Судалгааг хар.',          'Олон хүн хэлдэг нь үнэн гэсэн үг үү?'],
  'Шинэчлэгдсэн мэдээлэл':     ['update',   'Мэдээлэл одоо ч хүчинтэй эсэхийг шалга.',                       'Энэ мэдээлэл одоо ч хүчинтэй юу?'],
  'Нарийн ширийнийг анзаарах': ['detail',   'Тоо, нэр, огноо, «хамгийн» гэдэг үгийг нарийн шалга.',          'Тоо, нэр, огноо яг зөв үү?']
};

// RFC 4180 CSV (ишлэл доторх таслал, мөр шилжилт, "" дэмжинэ)
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(x => x !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some(x => x !== '')) rows.push(row);
  return rows;
}

const [head, ...rows] = parseCsv(readFileSync(root + 'data/questions.csv', 'utf8').replace(/^﻿/, ''));
const col = name => { const i = head.indexOf(name); if (i < 0) throw new Error('Багана алга: ' + name); return i; };
const C = {
  id: col('id'), topic: col('Сэдэв'), text: col('Асуулт'), show: col('Харуулах бичээс'), answer: col('Хариулт'),
  why: col('Тайлбар'), tip: col('Хамгаалах сургамж'), skill: col('Чадвар'), source: col('Эх сурвалж'),
  link: col('Эх сурвалжийн линк'), media: col('Зураг/бичлэг'), mediaLink: col('Зураг/бичлэгийн линк')
};

const seen = new Set();
const claims = rows.map((r, n) => {
  const g = k => (r[C[k]] || '').trim();
  const where = 'мөр ' + (n + 2) + ' (' + g('id') + ')';
  const topic = TOPICS[g('topic')], skill = SKILLS[g('skill')];
  if (!g('id') || seen.has(g('id'))) throw new Error(where + ': id хоосон эсвэл давхардсан');
  if (!topic) throw new Error(where + ': үл мэдэх сэдэв «' + g('topic') + '»');
  if (!skill) throw new Error(where + ': үл мэдэх чадвар «' + g('skill') + '»');
  const answer = { 'Үнэн': 'true', 'Худал': 'false' }[g('answer')];
  if (!answer) throw new Error(where + ': Хариулт нь Үнэн/Худал байх ёстой');
  seen.add(g('id'));
  const o = { id: g('id'), set: 0, kind: 'claim', topic, answer, technique: skill[0], text: g('text') };
  if (g('show')) o.show = g('show');
  Object.assign(o, { clue: skill[2], why: g('why'), tip: g('tip'), source: g('source') });
  if (g('link')) o.link = g('link');
  if (g('media')) o.media = g('media');
  if (g('mediaLink')) o.mediaLink = g('mediaLink');
  return o;
});

const techniques = {};
Object.keys(SKILLS).forEach(name => { techniques[SKILLS[name][0]] = { label: '🏷 ' + name, tip: SKILLS[name][1] }; });

const out = `// АВТОМАТААР ҮҮСГЭСЭН: node tools/csv-to-claims.mjs (эх: data/questions.csv). Гараар бүү засаарай.
// Баталгаат эх сурвалжтай "үнэн үү, худал уу" картууд. posts.js-ийн дараа ачаална.
(function () {
  var T = ${JSON.stringify(techniques, null, 2).replace(/\n/g, '\n  ')};
  Object.keys(T).forEach(function (k) { window.TECHNIQUES[k] = T[k]; });
  window.POSTS.push.apply(window.POSTS, [
${claims.map(c => '    ' + JSON.stringify(c)).join(',\n')}
  ]);
})();
`;
writeFileSync(root + 'data/claims.js', out);
const by = {};
claims.forEach(c => { by[c.topic] = (by[c.topic] || 0) + 1; });
console.log(claims.length + ' карт →', by);
