// Өдрийн 10 · ТРЭНД · 10 карт (Facebook пост хэлбэртэй, зурагтай)
// Бүгд сошиалд бодитоор тархсан, баримт шалгагч / албан эх сурвалжаар шалгагдсан мэдээлэл.
// 4 худал · 4 үнэн · 2 эргэлзээтэй · 6 нь Монголд тархсан, 4 нь гадаадын.
// post.page = ЗОХИОМОЛ хуудасны нэр. Реакцын тоо жишээ.
// post.image.src = апп дотор хадгалсан дүрслэл (анхны зураг биш). Анхны постыг sources-оос үзнэ.
// source = гол эх сурвалж (хуучин кодтой нийцнэ), sources = бүх эх сурвалж (алдааны дүн дээр бүгдийг харуул).

window.CARDS = [
  {
    id: "c001", category: "trend", answer: "false",
    post: {
      page: { name: "Монгол Мэдээ Live", ini: "ММ", color: "#B91C1C", verified: false },
      time: "2 цаг", privacy: "🌐",
      image: { src: "images/trend/c001.svg", type: "video", alt: "Түймрээс зугтаж буй зээрүүд, хилийн тор" },
      reactions: { total: "3.4K", top: ["😢", "😡", "😮"] }, comments: "412", shares: "1.1K"
    },
    text: "Нөмрөгийн дархан цаазат газарт гарсан түймрээс цагаан зээр сүргээрээ зугтаж, хилийн торонд тулаад амьдаараа шатжээ 💔 Энэ бичлэг одоо Хятадын WeChat-аар тарж байна.",
    highlight: "Энэ бичлэг",
    why: "2026 оны 10 сард Нөмрөгт түймэр үнэхээр гарсан. Гэхдээ бичлэг нь 2023 оны 4 сард Сүхбаатар аймгийн Эрдэнэцагаан сумд гарсан өөр түймрийнх. MFCC бичлэгийн кадрыг Google Lens-ээр хайж олсон.",
    technique: "Хуучин бичлэгийг шинэ мэт",
    clue: "Түймэр гарсан нь үнэн байж болно. Гэхдээ бичлэг яг энэ түймрийнх үү? Кадрыг зургаар хайвал хаанаас гарах вэ?",
    tip: "🛡 Үнэн мэдээн дээр хуучин бичлэг наах нь хамгийн түгээмэл заль. Зургаар хайх (Google Lens) нь 10 секунд л болно.",
    source: { name: "Монголын баримт шалгах төв (MFCC)", url: "https://mfcc.mn/factcheck-2106/" },
    sources: [
      { name: "MFCC · 2023 оны түймрийн бичлэгийг төөрөгдүүлсэн тайлбартай түгээж байна", url: "https://mfcc.mn/factcheck-2106/" }
    ],
    spread: "2026 оны 10 сар · Facebook"
  },
  {
    id: "c002", category: "trend", answer: "true",
    post: {
      page: { name: "Эрүүл Мэнд Мэдээлэл", ini: "ЭМ", color: "#DB2777", verified: false },
      time: "5 цаг", privacy: "🌐",
      image: { src: "images/trend/c002.svg", type: "photo", alt: "Toki тураах чихрийн хайрцаг, анхааруулга" },
      reactions: { total: "2.7K", top: ["😮", "👍", "😢"] }, comments: "380", shares: "960"
    },
    text: "АНУ-ын Хүнс, эмийн захиргаа (FDA) анхааруулж байна: сошиалаар зарагддаг «Toki» тураах чихэрт шошгонд нь бичээгүй sibutramine гэдэг эмийн бодис илэрсэн. Энэ бодисыг 2010 онд зүрхний эрсдэлээс болж зах зээлээс татсан.",
    highlight: "шошгонд нь бичээгүй sibutramine",
    why: "Үнэн. FDA болон Токиогийн эрүүл мэндийн газар Toki чихэрт sibutramine илэрсэн тул хэрэглэхгүй байхыг анхааруулсан. Харин «FDA баталгаажуулсан» гэж сурталчилсан зарууд нь худал.",
    technique: "Гайхмаар ч үнэн",
    clue: "«Айлгах» мэт сонсогдож байна. FDA-ийн албан сайтад ийм анхааруулга байгаа юу?",
    tip: "🛡 Анхааруулга бүр айлган сүрдүүлэг биш. Албан байгууллагын сайтаас нь шалга.",
    source: { name: "U.S. FDA", url: "https://www.fda.gov/drugs/medication-health-fraud/toki-slimming-candy-may-be-harmful-due-hidden-drug-ingredients" },
    sources: [
      { name: "U.S. FDA · Toki Slimming Candy анхааруулга", url: "https://www.fda.gov/drugs/medication-health-fraud/toki-slimming-candy-may-be-harmful-due-hidden-drug-ingredients" },
      { name: "MFCC · «Toki» тураах чихэр", url: "https://mfcc.mn/factcheck-2100/" }
    ],
    spread: "2026 оны 10 сар · Монголд зар сурталчилгаа"
  },
  {
    id: "c003", category: "trend", answer: "false",
    post: {
      page: { name: "Мэдээ Мэдээлэл 24", ini: "М24", color: "#1D4ED8", verified: false, sponsored: true },
      time: "Ивээн тэтгэсэн", privacy: "🌐",
      image: { src: "images/trend/c003.svg", type: "video", alt: "Телевизийн ярилцлагын бичлэг" },
      reactions: { total: "3.1K", top: ["👍", "😮", "❤️"] }, comments: "620", shares: "1.2K"
    },
    text: "Шадар сайд ярилцлагадаа «Сибирийн хүч-2» хоолойн төсөлд иргэд 200,000₮-өөс эхлэн хөрөнгө оруулж, сар бүр тогтмол ашиг авах боломжтой гэж мэдэгдлээ. Бүртгэл хязгаартай 👇",
    highlight: "сар бүр тогтмол ашиг",
    why: "Телевизийн ярилцлагын бодит бичлэгийн дуу, уруулын хөдөлгөөнийг deepfake-ээр өөрчилж, хувийн мэдээлэл хулгайлах сайт руу хөтөлсөн луйвар. MFCC шалгаж нотолсон.",
    technique: "Deepfake",
    clue: "Төрийн албан тушаалтан ивээн тэтгэсэн зараар хувь хүнийг хөрөнгө оруулахыг уриалдаг уу? Уруул, дуу таарч байна уу?",
    tip: "🛡 «Тогтмол ашиг» амласан алдартны видеог тухайн хүний албан хуудаснаас шалга.",
    source: { name: "AI Incident Database #1525", url: "https://incidentdatabase.ai/cite/1525/" },
    sources: [
      { name: "AI Incident Database #1525 (MFCC шалгасан)", url: "https://incidentdatabase.ai/cite/1525/" },
      { name: "AIID · Хохирогч: Монголын хөрөнгө оруулагчид", url: "https://incidentdatabase.ai/entities/mongolian-investors/" }
    ],
    spread: "2025 он · Facebook зар"
  },
  {
    id: "c004", category: "trend", answer: "true",
    post: {
      page: { name: "Түүх Сонирхогчид", ini: "ТС", color: "#B45309", verified: false },
      time: "1 өдөр", privacy: "🌐",
      image: { src: "images/trend/c004.svg", type: "photo", alt: "ДНХ ба 16,000,000 гэсэн тоо" },
      reactions: { total: "28K", top: ["❤️", "😮", "👍"] }, comments: "3.2K", shares: "8.7K"
    },
    text: "Генетикчдийн судалгаагаар өнөөдөр дэлхий дээр амьдарч буй 200 эрэгтэй тутмын 1 нь, буюу 16 сая орчим хүн Чингис хааны удмын Y хромосомтой байж болзошгүй 🧬",
    highlight: "200 эрэгтэй тутмын 1",
    why: "23 эрдэмтний 2003 онд American Journal of Human Genetics сэтгүүлд нийтэлсэн судалгаа. Хуучин Монгол эзэнт гүрний нутагт эрэгтэйчүүдийн 8 орчим хувь бараг ижил Y хромосомтой, энэ нь дэлхийн эрэгтэйчүүдийн 0.5 хувь.",
    technique: "Гайхмаар ч үнэн",
    clue: "Хэт гайхмаар тоо байна. Ямар судалгаа, аль сэтгүүлд гарсан бэ?",
    tip: "🛡 Гайхмаар тоог шууд худал гэж бүү дүгнэ. Анхны судалгааг нь хай.",
    source: { name: "National Geographic", url: "https://www.nationalgeographic.com/culture/article/mongolia-genghis-khan-dna" },
    sources: [
      { name: "National Geographic", url: "https://www.nationalgeographic.com/culture/article/mongolia-genghis-khan-dna" },
      { name: "ScienceAlert · бусад «үржил ихтэй» удмууд", url: "https://www.sciencealert.com/genghis-khan-s-genetic-legacy-rivalled-by-other-fertile-men" }
    ],
    spread: "Жил бүр вирал болдог"
  },
  {
    id: "c005", category: "trend", answer: "false",
    post: {
      page: { name: "Дэлхийн Мэдээ 24/7", ini: "ДМ", color: "#2563EB", verified: false },
      time: "3 цаг", privacy: "🌐",
      image: { src: "images/trend/c005.svg", type: "photo", alt: "Цагаан урт пуховик өмссөн хүн гудамжинд" },
      reactions: { total: "24K", top: ["😮", "😂", "👍"] }, comments: "1.8K", shares: "6.3K"
    },
    text: "Пап Франциск цагаан урт пуховик куртка өмсөж Ромын гудамжаар алхаж явахдаа ийн дуран авайд өртжээ 😮 Ватиканы «стиль» шинэ түвшинд гарлаа.",
    highlight: "дуран авайд өртжээ",
    why: "Midjourney хиймэл оюунаар үүсгэсэн зураг. 2023 оны 3 сард сая сая хүн жинхэнэ гэж итгэж тараасан.",
    technique: "AI зураг",
    clue: "Гар, хуруу, нүдний шил, загалмайг сайн хар. Ямар нэг албан мэдээллийн байгууллага энэ зургийг нийтэлсэн үү?",
    tip: "🛡 Хэт гайхалтай, төгс зураг харвал хиймэл оюунаар хийсэн эсэхийг шалга.",
    source: { name: "Snopes", url: "https://www.snopes.com/fact-check/not-real-photo-pope-in-puffy-coat" },
    sources: [
      { name: "Snopes", url: "https://www.snopes.com/fact-check/not-real-photo-pope-in-puffy-coat" },
      { name: "NBC News", url: "https://www.nbcnews.com/tech/pope-francis-ai-generated-images-fool-internet-rcna76838" },
      { name: "CBS News", url: "https://www.cbsnews.com/amp/news/pope-francis-puffer-jacket-fake-photos-deepfake-power-peril-of-ai" }
    ],
    spread: "2023 оны 3 сар · дэлхий даяар"
  },
  {
    id: "c006", category: "trend", answer: "unsure",
    post: {
      page: { name: "Шинжлэх Ухаан Хялбар", ini: "ШУ", color: "#EA580C", verified: false },
      time: "9 цаг", privacy: "🌐",
      image: { src: "images/trend/c006.svg", type: "photo", alt: "Аяга кимчи, өнгө өнгийн бичил хуванцар" },
      reactions: { total: "4.1K", top: ["😮", "❤️", "👍"] }, comments: "260", shares: "1.4K"
    },
    text: "Солонгосын эрдэмтэд кимчи гэдсэн дэх бичил хуванцрыг өөртөө наалдуулж, биеэс гадагшлуулдгийг тогтоожээ 🥬 Өдөр бүр нэг халбага идэхэд л хангалттай.",
    highlight: "тогтоожээ",
    why: "Судалгаа бодит, гэхдээ кимчиний тухай биш, түүнээс ялгасан ганц бактерийг шалгасан. Лаборатори болон хулганад туршсан, хүнд туршаагүй. «Тогтоожээ» гэдэг нь хэтрүүлэг, «нэг халбага» гэдгийг судалгаа огт хэлээгүй.",
    technique: "Урьдчилсан судалгааг баталсан мэт",
    clue: "Хүн дээр туршсан уу, хулгана дээр үү? Кимчи өөрөө юу, эсвэл түүнээс ялгасан нэг бактери юу?",
    tip: "🛡 «Хулганад», «лабораторид» гэсэн үр дүн хүнд шууд хамаарахгүй.",
    source: { name: "MFCC", url: "https://mfcc.mn/factcheck-2098/" },
    sources: [
      { name: "MFCC · Кимчи ба бичил хуванцар", url: "https://mfcc.mn/factcheck-2098/" },
      { name: "ScienceDaily · Анхны судалгааны мэдээ", url: "https://sciencedaily.com/releases/2026/09/260917101058.htm" }
    ],
    spread: "2026 оны 10 сар · Instagram"
  },
  {
    id: "c007", category: "trend", answer: "false",
    post: {
      page: { name: "Шуурхай Мэдээ МН", ini: "ШМ", color: "#DC2626", verified: true },
      time: "7 цаг", privacy: "🌐",
      image: { src: "images/trend/c007.svg", type: "photo", alt: "Шуурхай мэдээ: 2027.01.01-ээс vape хориглоно" },
      reactions: { total: "2.1K", top: ["👍", "😮", "😡"] }, comments: "146", shares: "152"
    },
    text: "ШУУРХАЙ: Тамхины хяналтын тухай хуулийн өөрчлөлт батлагдлаа. 2027 оны 1 сарын 1-ээс эхлэн vape, электрон тамхи худалдаалахыг бүрэн хориглоно.",
    highlight: "бүрэн хориглоно",
    why: "Хууль батлагдсан нь үнэн. Гэхдээ бүрэн хориг биш: 2027 оноос жимс, гаа, үнэртэй амтлагчийг хориглож, электрон тамхийг янжуур тамхитай адил зохицуулалт, татварт оруулсан.",
    technique: "Хагас үнэн",
    clue: "Хууль батлагдсан нь үнэн байж болно. Гэхдээ яг юуг хориглосон бэ: бүх vape-ийг үү, эсвэл амтлагчийг уу?",
    tip: "🛡 «Батлагдлаа» гэсэн мэдээг тухайн хуулийн яг заалтаар нь шалга.",
    source: { name: "MFCC", url: "https://mfcc.mn/factcheck-2096/" },
    sources: [
      { name: "MFCC · «2027 оноос электрон тамхийг бүрэн хориглоно» нь төөрөгдүүлсэн", url: "https://mfcc.mn/factcheck-2096/" },
      { name: "ikon.mn · Хуулийн өөрчлөлтийн дэлгэрэнгүй", url: "https://ikon.mn/n/3r2h" }
    ],
    spread: "2026 оны 10 сар · Facebook"
  },
  {
    id: "c008", category: "trend", answer: "true",
    post: {
      page: { name: "Кибер Аюулгүй Байдал", ini: "КА", color: "#111827", verified: false },
      time: "4 цаг", privacy: "🌐",
      image: { src: "images/trend/c008.svg", type: "photo", alt: "6 оролцогчтой видео хурал" },
      reactions: { total: "5.6K", top: ["😮", "😡", "👍"] }, comments: "780", shares: "2.4K"
    },
    text: "Хонконгийн нэгэн компанийн ажилтан видео хурал дээр «санхүүгийн захирал»-тайгаа ярилцаад 25 сая доллар шилжүүлжээ. Хурлын бусад бүх оролцогч deepfake байсан 😳",
    highlight: "бусад бүх оролцогч deepfake байсан",
    why: "2024 оны 2 сард Хонконгийн цагдаа баталсан бодит хэрэг. Олон улсын томоохон хэвлэлүүд мэдээлсэн.",
    technique: "Гайхмаар ч үнэн",
    clue: "Цагдаа, олон улсын томоохон мэдээллийн байгууллага энэ тухай мэдээлсэн үү?",
    tip: "🛡 Мөнгө шилжүүлэх хүсэлтийг видео дуудлагаар ирсэн ч өөр сувгаар давхар шалга.",
    source: { name: "CNN", url: "https://edition.cnn.com/2024/02/04/asia/deepfake-cfo-scam-hong-kong-intl-hnk" },
    sources: [
      { name: "CNN", url: "https://edition.cnn.com/2024/02/04/asia/deepfake-cfo-scam-hong-kong-intl-hnk" },
      { name: "CFO.com", url: "https://www.cfo.com/news/deepfake-cfo-hong-kong-25-million-fraud-cyber-crime/706529/" }
    ],
    spread: "2024 оны 2 сар"
  },
  {
    id: "c009", category: "trend", answer: "unsure",
    post: {
      page: { name: "Сансрын Мэдээ", ini: "СМ", color: "#1E3A8A", verified: false },
      time: "8 цаг", privacy: "🌐",
      image: { src: "images/trend/c009.svg", type: "photo", alt: "Ангараг дээрх ирвэсний толбот чулуу ба ровер" },
      reactions: { total: "19K", top: ["😮", "❤️", "👍"] }, comments: "2.9K", shares: "7.5K"
    },
    text: "NASA-гийн Perseverance роверын олсон «ирвэсний толботой» чулуу Ангараг дээр эрт үед бичил амьдрал байсныг харуулж байна 👽🔴",
    highlight: "амьдрал байсныг харуулж байна",
    why: "NASA үүнийг «боломжит биосигнатур» гэж нэрлэсэн. Амьдралгүй химийн урвалаар ч үүсч болох тул дээжийг Дэлхийд авчирч шинжлэх хүртэл баталгаагүй.",
    technique: "Баталгаажаагүй шинжлэх ухааны мэдээ",
    clue: "NASA «баталлаа» гэж хэлсэн үү, «байж магадгүй» гэж хэлсэн үү?",
    tip: "🛡 «Боломжит», «магадгүй» гэдгийг «баталсан» гэж ойлгож болохгүй.",
    source: { name: "Wikipedia · Cheyava Falls", url: "https://en.wikipedia.org/wiki/Cheyava_Falls" },
    sources: [
      { name: "Wikipedia · Cheyava Falls", url: "https://en.wikipedia.org/wiki/Cheyava_Falls" },
      { name: "EarthSky", url: "https://earthsky.org/space/nasa-says-mars-rock-potential-biosignature-sapphire-canyon-cheyava-falls/" },
      { name: "UPI", url: "https://www.upi.com/Science_News/2025/09/10/Mars/7041757523632/" }
    ],
    spread: "2025 оны 9 сар"
  },
  {
    id: "c010", category: "trend", answer: "true",
    post: {
      page: { name: "Монголын Байгаль", ini: "МБ", color: "#0EA5E9", verified: false },
      time: "6 цаг", privacy: "🌐",
      image: { src: "images/trend/c010.svg", type: "photo", alt: "Өвлийн утаатай Улаанбаатар, −40°C" },
      reactions: { total: "15K", top: ["😂", "👍", "😮"] }, comments: "3.4K", shares: "4.1K"
    },
    text: "Москва, Оттава, Астанаг ч ардаа орхисон: Улаанбаатар жилийн дундаж температураараа дэлхийн хамгийн хүйтэн нийслэл 🥶",
    highlight: "дэлхийн хамгийн хүйтэн нийслэл",
    why: "Үнэн. Жилийн дундаж температур 0°C орчим буюу түүнээс доош байдаг тул бүрэн эрхт улсуудын нийслэлүүдээс хамгийн хүйтэн нь.",
    technique: "Гайхмаар ч үнэн",
    clue: "«Хамгийн» гэдгийг юугаар хэмжсэн бэ: жилийн дундаж уу, хамгийн бага температур уу?",
    tip: "🛡 «Хамгийн» гэсэн мэдээллийг ямар хэмжүүрээр хэлснийг шалга.",
    source: { name: "NASA Earth Observatory", url: "https://earthobservatory.nasa.gov/images/39842/ulaanbaatar-mongolia" },
    sources: [
      { name: "NASA Earth Observatory", url: "https://earthobservatory.nasa.gov/images/39842/ulaanbaatar-mongolia" },
      { name: "Wikipedia · Ulaanbaatar", url: "https://en.wikipedia.org/wiki/Ulaanbaatar" },
      { name: "WorldAtlas · Хамгийн хүйтэн нийслэлүүд", url: "https://www.worldatlas.com/cities/the-coldest-capital-cities-in-the-world.html" }
    ],
    spread: "Өвөл бүр вирал болдог"
  }
];
