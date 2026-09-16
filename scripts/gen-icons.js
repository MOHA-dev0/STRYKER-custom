/*
 * يولّد أصول الأيقونات وصور المشاركة كلها من `public/logo.png`.
 *
 * يُشغَّل يدوياً عند تغيّر الشعار وحده — المخرجات ملتزَمة في المستودع فلا
 * يدخل التوليد مسار البناء: node scripts/gen-icons.js
 *
 * المخرجات:
 *   app/favicon.ico         أيقونة التبويب (16/32/48 بحمولة PNG)
 *   app/icon.png            أيقونة الموقع العامة — Next يولّد وسمها
 *   app/apple-icon.png      أيقونة شاشة iOS (بخلفية معتمة، فiOS لا تدعم الشفافية)
 *   public/og.png           بطاقة المشاركة 1200×630
 *   public/icons/*          أيقونات بيان التطبيق (manifest)
 *
 * `sharp` يأتي مع مُحسّن صور Next، فلا حاجة لتبعية إضافية.
 */
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const ROOT = path.join(__dirname, "..")
const LOGO = path.join(ROOT, "public/logo.png")
const SAND = { r: 0xf7, g: 0xf5, b: 0xf0, alpha: 1 }
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 }

const logo = (size) =>
  sharp(LOGO).resize(size, size, { fit: "contain", background: CLEAR }).png().toBuffer()

async function square(canvas, inner, background, out) {
  const art = await logo(inner)
  const pad = Math.round((canvas - inner) / 2)
  await sharp({
    create: { width: canvas, height: canvas, channels: 4, background },
  })
    .composite([{ input: art, top: pad, left: pad }])
    .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
    .toFile(path.join(ROOT, out))
  console.log("✓", out)
}

/** ICO بحمولة PNG — يقبله كل متصفح حديث، ويغني عن مكتبة ico كاملة. */
async function ico(sizes, out) {
  const images = await Promise.all(sizes.map((s) => logo(s)))
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(sizes.length, 4)

  let offset = 6 + sizes.length * 16
  const entries = images.map((png, i) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0) // width (0 = 256)
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1) // height
    e.writeUInt8(0, 2) // palette
    e.writeUInt8(0, 3) // reserved
    e.writeUInt16LE(1, 4) // colour planes
    e.writeUInt16LE(32, 6) // bits per pixel
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += png.length
    return e
  })

  fs.writeFileSync(path.join(ROOT, out), Buffer.concat([header, ...entries, ...images]))
  console.log("✓", out)
}

/*
 * صورة المشاركة الاجتماعية — 1200×630، الشعار على ورق رملي بهالة صنوبرية.
 *
 * في `public/` لا كاصطلاح `opengraph-image` في `app/`: الجذر هنا هو `[lang]`،
 * واصطلاح الملف داخل مقطع متغيّر يخرج برابط `/-/opengraph-image.png` غير صالح،
 * ووضعه فوق المقطع يحرمه `metadataBase` المعرّف في تخطيط اللغة.
 */
async function og(out) {
  const W = 1200
  const H = 630
  const art = await logo(470)
  const wash = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <defs>
         <radialGradient id="pine" cx="50%" cy="46%" r="58%">
           <stop offset="0%" stop-color="#17614a" stop-opacity="0.20"/>
           <stop offset="60%" stop-color="#17614a" stop-opacity="0.06"/>
           <stop offset="100%" stop-color="#17614a" stop-opacity="0"/>
         </radialGradient>
         <linearGradient id="ember" x1="0" y1="1" x2="1" y2="0">
           <stop offset="0%" stop-color="#c0552f" stop-opacity="0.10"/>
           <stop offset="55%" stop-color="#c0552f" stop-opacity="0"/>
         </linearGradient>
       </defs>
       <rect width="${W}" height="${H}" fill="url(#pine)"/>
       <rect width="${W}" height="${H}" fill="url(#ember)"/>
       <rect x="0" y="${H - 10}" width="${W}" height="10" fill="#17614a"/>
     </svg>`
  )

  await sharp({ create: { width: W, height: H, channels: 4, background: SAND } })
    .composite([
      { input: wash, top: 0, left: 0 },
      { input: art, top: Math.round((H - 470) / 2) - 6, left: Math.round((W - 470) / 2) },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
    .toFile(path.join(ROOT, out))
  console.log("✓", out)
}

;(async () => {
  await square(512, 512, CLEAR, "app/icon.png")
  await square(180, 152, SAND, "app/apple-icon.png")
  await ico([16, 32, 48], "app/favicon.ico")
  await og("public/og.png")
  fs.mkdirSync(path.join(ROOT, "public/icons"), { recursive: true })
  await square(192, 192, CLEAR, "public/icons/icon-192.png")
  await square(512, 512, CLEAR, "public/icons/icon-512.png")
  await square(512, 320, SAND, "public/icons/icon-maskable-512.png")
})()
