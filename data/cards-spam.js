// Өдрийн 10 · SPAM ангилал · 10 карт
// Хуурамч линк, луйврын мессежийн хамгийн түгээмэл, олон хүн хууртсан төрлүүд. Бүгд бодит баримтад тулгуурласан.
// answer: "false" = луйвар/хуурамч · "true" = жинхэнэ, аюулгүй · "unsure" = шууд мэдэх боломжгүй, өөр сувгаар шалгах ёстой
// 6 луйвар · 2 жинхэнэ · 2 эргэлзээтэй.
// post.kind: "facebook" | "messenger" | "sms" | "email" — төрөл бүрийг өөрөөр зурна (design/fb-card-reference.html).
// Линкүүд (post.link.url) нь зөвхөн ХАРАГДАХ текст. Хэзээ ч дарагдах <a> болгож болохгүй.
// Хуудас, хүний нэр, дугаар зохиомол. Банкны нэр нь бодит луйврын баримтаас (MFCC) авсан.

window.CARDS = (window.CARDS || []).concat([
  {
    id: "s001", category: "spam", answer: "false",
    post: {
      kind: "facebook",
      page: { name: "Хаан Банк · Баярын урамшуулал", ini: "ХБ", color: "#047857", verified: false, sponsored: true },
      time: "Ивээн тэтгэсэн", privacy: "🌐",
      image: { src: "images/spam/s001.svg", type: "photo", alt: "Хурд урамшуулал 500,000₮" },
      link: { url: "khanbank-bayar.mn-bonus.site", title: "Урамшууллаа авах" },
      reactions: { total: "1.2K", top: ["❤️", "👍", "😮"] }, comments: "348", shares: "512"
    },
    text: "Хаан банкны төрсөн өдрийг тохиолдуулан «Хурд урамшуулал» зарлаж байна 🎉 Эхний 1000 харилцагч 500,000₮ авна. Доорх холбоосоор интернэт банкаараа нэвтэрч баталгаажуулаарай.",
    highlight: "интернэт банкаараа нэвтэрч",
    why: "MFCC шалгасан бодит луйвар. Хуудас 1 сарын өмнө нээгдсэн, 2-хон дагагчтай. Линк нь хэд хэдэн банкны нэвтрэх нэр, нууц үгийг асуудаг хуурамч хуудас руу хөтөлдөг. Банкны албан хуудсанд ийм урамшуулал огт байгаагүй.",
    technique: "Банкны нэр барьсан фишинг",
    clue: "Хуудасны нэр, линкний домэйныг хар: khanbank.com мөн үү? Банк сошиалаар нэвтрэх нэр, нууц үг асуудаг уу?",
    tip: "🛡 Банк хэзээ ч линкээр нэвтрэхийг хүсэхгүй. Урамшууллыг банкныхаа албан апп, khanbank.com-оос л шалга.",
    source: { name: "MFCC", url: "https://mfcc.mn/factcheck-2093/" },
    sources: [
      { name: "MFCC · Цахим орчинд банкны нэрийг барьсан залилан идэвхжиж байна", url: "https://mfcc.mn/factcheck-2093/" }
    ],
    spread: "2026 оны 10 сар · Facebook"
  },
  {
    id: "s002", category: "spam", answer: "false",
    post: {
      kind: "facebook",
      page: { name: "Ажлын Байр · Онлайн", ini: "АБ", color: "#16A34A", verified: false },
      time: "4 цаг", privacy: "🌐",
      image: { src: "images/spam/s002.svg", type: "photo", alt: "Гэрээсээ ажиллаад 800,000₮" },
      reactions: { total: "860", top: ["👍", "❤️", "😮"] }, comments: "1.1K", shares: "94"
    },
    text: "Оюутан, ээжүүдэд тохиромжтой цагийн ажил 💼 Дансаараа гүйлгээ хийлгээд 800,000₮-ийн ашиг хүртээрэй. Мөнгө таны данс руу ороод буцаад гарна, танд ямар ч эрсдэлгүй. Сонирхсон бол «+» гэж коммент үлдээгээрэй.",
    highlight: "Дансаараа гүйлгээ хийлгээд",
    why: "ЦЕГ «100% залилан» гэж анхааруулсан. Таны дансаар бусдыг хуурч олсон мөнгийг дамжуулдаг тул данс эзэмшигч өөрөө гэмт хэрэгт холбогдох эрсдэлтэй.",
    technique: "Данс түрээслүүлэх «ажил»",
    clue: "Ямар ажил хийхийг огт бичээгүй, зөвхөн данс хэрэгтэй гэж байна. Мөнгө яагаад заавал ТАНЫ дансаар дамжих ёстой вэ?",
    tip: "🛡 Дансаа хэнд ч түрээслүүлэхгүй. «Эрсдэлгүй» гэдэг нь хамгийн том эрсдэл.",
    source: { name: "ikon.mn · ЦЕГ", url: "https://ikon.mn/n/3ifl" },
    sources: [
      { name: "ikon.mn · ЦЕГ: «Дансаараа гүйлгээ хийлгээд ашиг хүртээрэй» гэх зар 100% залилан", url: "https://ikon.mn/n/3ifl" }
    ],
    spread: "2025 оноос · Facebook зар"
  },
  {
    id: "s003", category: "spam", answer: "false",
    post: {
      kind: "facebook",
      page: { name: "Монголын Луйврын Мэдээллийн Төв", ini: "ЛМ", color: "#1D4ED8", verified: false },
      time: "1 өдөр", privacy: "🌐",
      image: { src: "images/spam/s003.svg", type: "photo", alt: "Залиланд өртсөн үү? Алдсан мөнгөө эргүүлэн аваарай" },
      reactions: { total: "107", top: ["👍", "❤️", "😢"] }, comments: "84", shares: "21"
    },
    text: "Хэрэв та залилангийн хохирогч болсон бол бидэнтэй холбогдож, мөнгөө эргүүлэн аваарай. Манай мэргэжлийн баг хууль хяналтын байгууллагатай хамтран ажилладаг. Messenger-ээр хандаарай.",
    highlight: "мөнгөө эргүүлэн аваарай",
    why: "Ийм албан байгууллага байхгүй. Шинээр нээсэн, AI-аар хийсэн логотой, утас хаяггүй хуудас. ЦЕГ-ын зурагт хуудсыг зөвшөөрөлгүй хуулж тавьсан. Нэг удаа хууртсан хүнийг «буцаан олгох хураамж» нэрээр дахин хуурдаг.",
    technique: "Хохирогчийг дахин хуурах",
    clue: "Хууль хяналтын байгууллага Messenger-ээр «мөнгөө буцааж авах» үйлчилгээ санал болгодог уу? Хуудас хэзээ нээгдсэн бэ?",
    tip: "🛡 Залиланд өртвөл зөвхөн 102 руу, эсвэл цагдаад биечлэн ханд.",
    source: { name: "MFCC", url: "https://mfcc.mn/factcheck-2076/" },
    sources: [
      { name: "MFCC · «Монголын луйврын мэдээллийн төв» гэсэн албан ёсны байгууллага байхгүй", url: "https://mfcc.mn/factcheck-2076/" }
    ],
    spread: "2026 оны 9 сар · Facebook"
  },
  {
    id: "s004", category: "spam", answer: "false",
    post: {
      kind: "sms",
      from: { name: "+1 (415) 555-0137", ini: "?", color: "#64748B" },
      time: "Өнөөдөр 10:42",
      thread: [],
      link: { url: "wa.me/14155550137", title: "WhatsApp" }
    },
    text: "Сайн байна уу! Би HR-ийн Анна байна. Таны CV-г онлайнаас харлаа. Манай компани бүтээгдэхүүний үнэлгээ хийх цагийн ажилтан авч байна: өдөрт 30–60 минут, утсаараа видео лайклаж, бүтээгдэхүүнд од өгөөд өдөрт 150,000–400,000₮. Сонирхож байвал WhatsApp-аар бичээрэй 😊",
    highlight: "видео лайклаж, бүтээгдэхүүнд од өгөөд",
    why: "АНУ-ын Худалдааны холбооны комисс (FTC)-ийн мэдээлснээр «таск луйвар»-ын гомдол 2023 онд 5000 байсан бол 2024 оны эхний хагаст 20,000 болжээ. Эхэндээ бага мөнгө өгч итгүүлээд, дараа нь «дараагийн шатыг нээх» нэрээр мөнгө, крипто байршуулахыг шаарддаг.",
    technique: "Таск / ажлын луйвар",
    clue: "Та энэ компанид CV явуулсан уу? Лайк дарахад цалин өгдөг бодит ажил байдаг уу?",
    tip: "🛡 «Цалингаа авахын тулд эхлээд мөнгө байршуул» гэвэл 100% луйвар.",
    source: { name: "FTC Data Spotlight", url: "https://ftc.gov/news-events/data-visualizations/data-spotlight/2024/12/paying-get-paid-gamified-job-scams-drive-record-losses" },
    sources: [
      { name: "FTC · Gamified job scams drive record losses (2024)", url: "https://ftc.gov/news-events/data-visualizations/data-spotlight/2024/12/paying-get-paid-gamified-job-scams-drive-record-losses" },
      { name: "Engadget · FTC warns gamified job scams are on the rise", url: "https://www.engadget.com/cybersecurity/the-ftc-warns-gamified-job-scams-are-on-the-rise-233029615.html" }
    ],
    spread: "2023 оноос · дэлхий даяар, SMS / WhatsApp / Telegram"
  },
  {
    id: "s005", category: "spam", answer: "false",
    post: {
      kind: "messenger",
      from: { name: "Номин (ангийн найз)", ini: "Н", color: "#DB2777", active: "Идэвхтэй" },
      time: "21:14",
      thread: [
        { me: false, text: "Хөөе, сайн уу 😊" },
        { me: true, text: "Сайн, юу байна?" },
        { me: false, text: "📩 Таны баталгаажуулах код: 482913. Энэ кодыг хэнд ч бүү өг.", system: true }
      ]
    },
    text: "Уучлаарай, би кодоо андуураад чиний дугаар руу явуулчихлаа 🙈 Саяын ирсэн 6 оронтой кодыг хуулаад явуулчих, яаралтай хэрэгтэй байна.",
    highlight: "6 оронтой кодыг хуулаад явуулчих",
    why: "Ийм код таны дугаар/аккаунттай холбоотой. Илгээвэл таны аккаунт, эсвэл таны дугаараар шинэ аккаунт нээгдэж хулгайд алдана. Найзын аккаунт аль хэдийн хакерт алдагдсан байдаг. Google «баталгаажуулах кодыг асуусан хүсэлтэд хэзээ ч хариулахгүй байх»-ыг сануулдаг.",
    technique: "Нэг удаагийн код (OTP) хулгайлах",
    clue: "Код ЧИНИЙ утсанд ирсэн бол хэний аккаунтын код вэ? Найз чинь үнэхээр бичиж байгаа гэдгийг яаж мэдэх вэ?",
    tip: "🛡 Утсанд ирсэн кодыг хэнд ч, хамгийн дотны хүндээ ч бүү өг.",
    source: { name: "Google Voice Help", url: "https://support.google.com/voice/answer/9177797" },
    sources: [
      { name: "Google Voice Help · Verification code scam", url: "https://support.google.com/voice/answer/9177797" },
      { name: "NordVPN · Google Voice verification code scam", url: "https://nordvpn.com/blog/google-voice-verification-code-scam/" }
    ],
    spread: "Дэлхий даяар · Messenger, WhatsApp"
  },
  {
    id: "s006", category: "spam", answer: "false",
    post: {
      kind: "messenger",
      from: { name: "Билгүүн (ах)", ini: "Б", color: "#7C3AED", active: "Идэвхтэй" },
      time: "13:02",
      thread: [],
      link: { url: "fb-watch.video-share.info/v/8823", title: "Видео · 0:38", image: "images/spam/s006.svg" }
    },
    text: "Энэ чи мөн үү?? 😱😱 Бүгд хуваалцаад байна шүү",
    highlight: "Энэ чи мөн үү??",
    why: "Хакерт алдагдсан найзын аккаунтаас ирдэг сонгодог фишинг. Линк нь Facebook-ийн нэвтрэх хуурамч хуудас руу хөтөлж нууц үгийг хулгайлж, дараа нь ТАНЫ нэрээр бүх найз руу тань ижил мессеж явуулдаг.",
    technique: "Сониуч зан, айдсаар фишинг",
    clue: "Домэйныг хар: facebook.com мөн үү? Ах чинь ингэж бичдэг үү? Өөр сувгаар (утсаар) асууж болох уу?",
    tip: "🛡 Найзаас ирсэн ч сонин линкийг бүү дар. Утсаар нь залгаад асуу.",
    source: { name: "BBB · WAFB", url: "https://www.wafb.com/2019/09/25/bbb-warns-social-media-video-scam-is-this-you/" },
    sources: [
      { name: "BBB · «Is this you?» social media video scam", url: "https://www.wafb.com/2019/09/25/bbb-warns-social-media-video-scam-is-this-you/" },
      { name: "East Idaho News · Beware strange videos from friends", url: "https://www.eastidahonews.com/?p=406414" }
    ],
    spread: "2019 оноос · Messenger"
  },
  {
    id: "s007", category: "spam", answer: "true",
    post: {
      kind: "email",
      fromName: "Google",
      fromEmail: "no-reply@accounts.google.com",
      to: "Танд",
      time: "08:17",
      subject: "Security alert",
      button: { label: "Check activity", url: "myaccount.google.com/notifications" }
    },
    text: "A new sign-in on Windows. We noticed a new sign-in to your Google Account on a Windows device. If this was you, you don't need to do anything. If not, we'll help you secure your account.",
    highlight: "If this was you, you don't need to do anything.",
    why: "Жинхэнэ Google-ийн аюулгүй байдлын мэдэгдэл: албан хаяг no-reply@accounts.google.com, нууц үг асуухгүй, «чи бол юу ч хийх шаардлагагүй» гэдэг, myaccount.google.com руу хөтөлдөг. Google өөрөө «myaccount.google.com/notifications-д ижил үйлдэл харагдаж байвал жинхэнэ» гэж зөвлөдөг.",
    technique: "Жинхэнэ мэдэгдэл",
    clue: "Илгээгчийн хаяг, товчны домэйн хоёулаа google.com уу? Нууц үг, карт асууж байна уу?",
    tip: "🛡 Сэжиглэвэл линк дарахгүйгээр myaccount.google.com-оо өөрөө нээж шалга.",
    source: { name: "Google Account Help", url: "https://support.google.com/accounts/answer/6076895" },
    sources: [
      { name: "Google Account Help · Security alerts", url: "https://support.google.com/accounts/answer/6076895" },
      { name: "Trend Micro · Google critical security alert: scam or not?", url: "https://news.trendmicro.com/2022/09/07/google-critical-security-alert-scam-email-legit/" }
    ],
    spread: "Өдөр бүр олон сая хүнд ирдэг"
  },
  {
    id: "s008", category: "spam", answer: "true",
    post: {
      kind: "facebook",
      page: { name: "Гэмт хэргээс урьдчилан сэргийлэх", ini: "ГУ", color: "#1E40AF", verified: true },
      time: "2 өдөр", privacy: "🌐",
      image: { src: "images/spam/s008.svg", type: "photo", alt: "Сэрэмжлүүлэг: дансаа бусдад түрээслүүлэхгүй, 102" },
      reactions: { total: "2.3K", top: ["👍", "😮", "❤️"] }, comments: "190", shares: "1.6K"
    },
    text: "СЭРЭМЖЛҮҮЛЭГ: «Дансаараа гүйлгээ хийлгээд 800,000₮-ийн ашиг хүртээрэй» гэсэн зар 100% залилан. Дансаа бусдад ашиглуулж, түрээслүүлж болохгүй. Залилангийн талаар 102 дугаарт мэдээлнэ үү.",
    highlight: "102 дугаарт мэдээлнэ үү",
    why: "ЦЕГ-ын бодит сэрэмжлүүлэг. Линк, хувийн мэдээлэл, мөнгө огт асуухгүй, зөвхөн албан 102 дугаар руу чиглүүлж байна. Луйврын мессеж үргэлж ямар нэг үйлдэл (линк дарах, мөнгө шилжүүлэх, мэдээлэл өгөх) шаарддаг.",
    technique: "Жинхэнэ мэдэгдэл",
    clue: "Энэ пост чамаас юу хийхийг хүсэж байна вэ? Линк, мөнгө, нууц үг асууж байна уу?",
    tip: "🛡 Жинхэнэ сэрэмжлүүлэг юу ч «авах» гэж оролддоггүй.",
    source: { name: "ikon.mn · ЦЕГ", url: "https://ikon.mn/n/3ifl" },
    sources: [
      { name: "ikon.mn · ЦЕГ-ын сэрэмжлүүлэг", url: "https://ikon.mn/n/3ifl" }
    ],
    spread: "2025 оны 10 сар"
  },
  {
    id: "s009", category: "spam", answer: "unsure",
    post: {
      kind: "sms",
      from: { name: "+976 8812 ****", ini: "?", color: "#64748B" },
      time: "Өчигдөр 19:55",
      thread: [
        { me: false, text: "Ээжээ, сайн уу 😘 Утас минь усанд унаад эвдэрчихлээ, энэ миний шинэ дугаар. Хуучныг нь устгачих." }
      ]
    },
    text: "Ээжээ, нэг юм гуймаар байна. Интернэт банк маань шинэ утсан дээр орохгүй байна, өнөөдөр түрээсээ төлөх ёстой. 450,000₮-ийг найзын маань данс руу шилжүүлээд өгөөч, маргааш буцаагаад өгнө ❤️",
    highlight: "найзын маань данс руу",
    why: "Энэ мессежийг харахад л хүүхэд чинь мөн эсэхийг мэдэх боломжгүй. Яг ийм «Hi Mum» луйврын улмаас Их Британид 2022 онд 4 сарын дотор 1,235 хүн хохирч, нийт 1.5 сая фунт алдсан. Зөв алхам: хуучин дугаар руу нь залгах, эсвэл зөвхөн тэр хоёулаа мэдэх зүйл асуух.",
    technique: "Ойрын хүний дүрд хувирах",
    clue: "Шинэ дугаар, яаралтай мөнгө, өөр хүний данс: гурвуулаа нэг дор байна. Хуучин дугаар руу нь залгаж болох уу?",
    tip: "🛡 Яаралтай мөнгө гуйвал эхлээд дуу хоолойгоор нь сонс: залга.",
    source: { name: "Which?", url: "https://www.which.co.uk/news/article/notorious-hi-mum-and-dad-scam-spreads-from-whatsapp-to-text-message-an7N34c0gVbP" },
    sources: [
      { name: "Which? · «Hi Mum and Dad» scam", url: "https://www.which.co.uk/news/article/notorious-hi-mum-and-dad-scam-spreads-from-whatsapp-to-text-message-an7N34c0gVbP" },
      { name: "Avon and Somerset Police · Fake WhatsApp message scam", url: "https://www.avonandsomerset.police.uk/news/2022/03/phone-users-urged-to-be-aware-of-fake-whatsapp-message-scam/" }
    ],
    spread: "2021 оноос · WhatsApp, SMS"
  },
  {
    id: "s010", category: "spam", answer: "unsure",
    post: {
      kind: "email",
      fromName: "Netflix",
      fromEmail: "info@account.netflix.com",
      to: "Танд",
      time: "Өчигдөр",
      subject: "Your payment was declined",
      button: { label: "Update payment", url: "netflix.com/YourAccount" }
    },
    text: "We're having some trouble with your current billing information. Please update your payment details to keep enjoying Netflix. If you've already updated, please ignore this message.",
    highlight: "update your payment details",
    why: "Бодит төлбөрийн асуудал ч байж болно, хуурамч ч байж болно: Netflix-ийн нэрийг барьсан «төлбөр амжилтгүй» фишинг маш түгээмэл, илгээгчийн нэр, хаягийг ч хуурамчаар харуулж чаддаг. Имэйлээс мэдэх боломжгүй. Зөв алхам: линк дарахгүйгээр Netflix апп-аа өөрөө нээж шалгах.",
    technique: "Шалгаж байж итгэ",
    clue: "Имэйл дээрх товчийг дарахгүйгээр төлбөрийн асуудал байгаа эсэхийг яаж мэдэх вэ?",
    tip: "🛡 Төлбөр, аккаунтын мэдэгдэл ирвэл апп эсвэл сайтаа ӨӨРӨӨ нээж шалга.",
    source: { name: "Palisade · Netflix phishing email", url: "https://www.palisade.email/learning/netflix-phishing-email" },
    sources: [
      { name: "Palisade · Netflix phishing: verify billing and account alerts", url: "https://www.palisade.email/learning/netflix-phishing-email" },
      { name: "Tech.co · Netflix scam email", url: "https://tech.co/cybersecurity/netflix-scam-email" }
    ],
    spread: "Дэлхий даяар · имэйл, SMS"
  }
]);
