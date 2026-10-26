# Netlify дээр байршуулах

Хочны бүртгэл ба чансаа Netlify Functions + Netlify Blobs дээр ажилладаг. Функцийг build хийх шаардлагатай тул **Netlify Drop (хавтсаа чирж тавих) ажиллахгүй**.

## A. Netlify CLI-аар (хамгийн хурдан)
```
npm install
npx netlify-cli login                 # хөтөч нээгдэж нэвтэрнэ (1 удаа)
npx netlify-cli deploy --build --prod # анх удаа: "Create & configure a new project" сонго
```

## B. GitHub-аар
1. Энэ хавтсыг GitHub repo болгож push хий (`node_modules/` орохгүй).
2. Netlify → Add new project → Import from Git → repo-гоо сонго. Тохиргоог `netlify.toml`-оос автоматаар уншина.

## Шалгах
- `https://<сайт>.netlify.app/api/board?cat=tech` хаягаар `{"rows":[],...}` гарвал API ажиллаж байна.
- Хадгалагдсан өгөгдлийг Netlify → Project → Blobs → `swipesmart` хэсгээс харна.

## Анхаар
- `index.html`-ийг `file://`-ээр нээвэл тоглоом ажиллана. Чансааны дэлгэц дээр харин "Netlify дээр л ажиллана" гэсэн бичиг гарна.
- `?reset=1` нь зөвхөн энэ төхөөрөмжийн өгөгдлийг цэвэрлэнэ. Бүртгэгдсэн хоч серверт үлддэг тул дахин тоглоход өөр хоч сонгох хэрэгтэй.
