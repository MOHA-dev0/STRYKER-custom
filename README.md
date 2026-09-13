# STRYKER CUSTOM BIKE SHOW

منصة وطنية وعربية مخصصة لعرض عالم الدراجات المعدّلة والـ Custom Shows.
موقع عربي بالكامل (RTL) مبني بـ Next.js App Router.

## التشغيل

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # بناء الإنتاج
```

## التقنيات

| الطبقة    | الأداة                                                        |
| --------- | ------------------------------------------------------------- |
| الإطار    | Next.js 16 (App Router, TypeScript, Turbopack)                 |
| التنسيق   | Tailwind CSS v4 (`@theme` داخل `app/globals.css`)              |
| المكوّنات | shadcn/ui فوق Radix UI                                         |
| الحركة    | Framer Motion                                                  |
| الأيقونات | lucide-react                                                   |
| النماذج   | react-hook-form + zod                                          |
| الخطوط    | Tajawal (متن) · Reem Kufi (عناوين) · Barlow Condensed (لاتيني) |

## الهوية البصرية

مستخرجة من درع STRYKER — ثيم فاتح فاخر:

| الدور         | المتغير              | اللون     |
| ------------- | -------------------- | --------- |
| الخلفية       | `--color-ivory`      | `#FAF8F5` |
| سطح ثانوي     | `--color-ivory-soft` | `#F4F0EA` |
| الذهبي الملكي | `--color-gold`       | `#C5A059` |
| ذهبي لامع     | `--color-gold-bright`| `#D4AF37` |
| القرمزي       | `--color-crimson`    | `#C41E3A` |
| النص          | `--color-ink`        | `#1C1917` |

أدوات مساعدة في `globals.css`: `.text-chrome` (تدرّج كروم ذهبي على النص)،
`.rule-gold` (خط ذهبي)، `.grain` (حبيبات فيلم)، `.blueprint` (شبكة مخططات)،
`.hatch` (تظليل قطري)، `.brackets` (أقواس زوايا)، `.shell` (حاوية الصفحة)،
`.eyebrow` (سطر علوي لاتيني).

## البنية

```
app/
  layout.tsx            # RTL + الخطوط + Navbar/Footer
  page.tsx              # الرئيسية
  about/page.tsx        # من نحن
  submissions/page.tsx  # المشاركات (قريباً + تسجيل مبكر)
  contact/page.tsx      # تواصل معنا + الأسئلة الشائعة
  not-found.tsx
components/
  ui/                   # مكوّنات shadcn/ui
  site/                 # أقسام الموقع
lib/
  data.ts               # كل المحتوى والنصوص
  utils.ts              # cn()
```

## ملاحظات

- **المحتوى** كله في [`lib/data.ts`](lib/data.ts) — عدّل النصوص والأسماء والباقات من هناك.
- **الصور** حالياً صور مؤقتة من Unsplash (كروزر/تشوبر مخصص). استبدل الروابط في
  `lib/data.ts` و`components/site/journey.tsx` و`components/site/story-vision.tsx`
  بصور المشاريع الحقيقية، وأضف النطاق في `next.config.ts` إن كانت من مصدر آخر.
- **النماذج** (المشاركات والتواصل) تتحقق من المدخلات بـ zod وتحاكي الإرسال فقط —
  لا يوجد Backend بعد. اربط `onSubmit` في `components/site/submission-form.tsx`
  و`components/site/contact-form.tsx` بـ Route Handler أو Server Action.
- **الشعار** مرسوم بـ SVG في `components/site/emblem.tsx` — استبدله بالشعار الرسمي
  عند توفره.
