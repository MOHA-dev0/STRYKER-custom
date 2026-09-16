/**
 * البيانات الثابتة لمنصة STRYKER CUSTOM BIKE SHOW.
 *
 * كل ما هنا غير قابل للترجمة: المعرّفات، الروابط، الصور، الأرقام، ورموز الأقسام.
 * النصوص المترجمة كلها في `lib/i18n/dictionaries/*` وتُربط بهذه العناصر عبر الـ id.
 */

import type { Dictionary } from "@/lib/i18n/dictionaries/ar"

/**
 * مراحل الـ Hero الثلاث. تختلف المرحلة الأولى عن أختيها في نوع الصورة:
 *   `cutout` — دراجة مقصوصة بخلفية شفافة تطفو فوق الشعار المائي.
 *               (`/bike.webp` مشتقة من `backgorund.webp`، والأصل مستطيل أبيض
 *                معتم، أُزيل بياضه بملء فيضي من الحواف ثم اقتُصّت الهوامش.)
 *   `photo`  — صورة ممتدة على كامل الإطار خلف حجاب العاج.
 */
export const HERO_STAGES = [
  { id: "discover", kind: "cutout", image: "/bike.webp" },
  {
    id: "build",
    kind: "photo",
    image:
      "https://images.unsplash.com/photo-1780853740000-441ba8208ed5?auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: "shows",
    kind: "photo",
    image:
      "https://images.unsplash.com/photo-1785100292412-97886edb1978?auto=format&fit=crop&w=2070&q=80",
  },
] satisfies {
  id: keyof Dictionary["hero"]["slides"]
  kind: "cutout" | "photo"
  image: string
}[]

export const ACHIEVEMENTS = [
  { id: "first", value: 4, display: "04" },
  { id: "entries", value: 7, display: "07" },
  { id: "launch", value: 2025, display: "2025" },
  { id: "stages", value: 14, display: "14" },
] satisfies { id: keyof Dictionary["stats"]; value: number; display: string }[]

/**
 * ركائز ميثاق الراكب، بترتيب العرض. الأيقونات تُربط في المكوّن نفسه حتى لا
 * يسحب هذا الملف — وهو مستورَد في مكوّنات العميل — أي شيء من lucide.
 */
export const RIDER_CODE = [
  "safety",
  "compliance",
  "community",
  "culture",
] satisfies (keyof Dictionary["riderCode"]["pillars"])[]

/**
 * ما تعرضه المنصة — الدراجات النارية المعدّلة، والسيارات الكلاسيك، وسيارات
 * السبورت. بترتيب العرض؛ الأيقونات تُربط داخل المكوّن حتى لا يسحب هذا الملف
 * — وهو مستورَد في مكوّنات العميل — أي شيء من lucide.
 */
export const LINEUP = [
  "bikes",
  "classic",
  "sport",
] satisfies (keyof Dictionary["lineup"]["tracks"])[]

/** فئات فريق العرض بترتيب التبويبات. النصوص كلها في `squad.categories`. */
export const SQUAD = [
  "builders",
  "participants",
  "judges",
  "sponsors",
] satisfies (keyof Dictionary["squad"]["categories"])[]

export const CTA_LANES = [
  { id: "workshops", href: "/contact?subject=workshop" },
  { id: "artists", href: "/contact?subject=workshop" },
  { id: "sponsors", href: "/contact?subject=sponsorship" },
] satisfies { id: keyof Dictionary["cta"]["lanes"]; href: string }[]

export const STORY_PILLARS = [
  "story",
  "vision",
  "mission",
] satisfies (keyof Dictionary["about"]["story"]["pillars"])[]

export const CONTACT_SUBJECTS = [
  "sponsorship",
  "workshop",
  "entry",
  "general",
] satisfies (keyof Dictionary["contact"]["subjects"])[]

export const CITIES = [
  "riyadh",
  "jeddah",
  "dammam",
  "khobar",
  "makkah",
  "madinah",
  "taif",
  "abha",
  "buraydah",
  "tabuk",
  "hail",
  "other",
] satisfies (keyof Dictionary["cities"])[]

export const NAV_LINKS = [
  { id: "home", href: "/" },
  { id: "about", href: "/about" },
  { id: "submissions", href: "/submissions" },
  { id: "contact", href: "/contact" },
] satisfies { id: keyof Dictionary["nav"]["links"]; href: string }[]

/**
 * نطاق الفعالية — داخل المملكة أو خارجها.
 * يقود مرشّح «داخل السعودية / خارجها» في قسم المشاركات، وهو حقل غير مترجم
 * لأن الترجمة تخصّ عنوان الزر لا قيمة الحقل.
 */
export const PARTICIPATION_SCOPES = ["all", "local", "international"] as const

export type ParticipationScope = (typeof PARTICIPATION_SCOPES)[number]

/**
 * سجل المشاركات — المعرّف والسنة والنطاق والصورة والوجهة فقط.
 * العنوان والمكان والوسام والوصف مترجمة في `participations.events` بالقاموسين.
 *
 * مرتّبة زمنياً من الأقدم إلى الأحدث؛ أضف أي فعالية جديدة في نهاية المصفوفة.
 * الصور مؤقتة — أي مصدر خارجي جديد يحتاج إدخال نطاقه في
 * `images.remotePatterns` داخل `next.config.ts`.
 */
export const PARTICIPATIONS = [
  {
    id: "riyadh-custom-expo-2025",
    scope: "local",
    year: "2025",
    image: "/backgorund.webp",
    href: "/about",
  },
  {
    id: "jeddah-motor-show-2025",
    scope: "local",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1546801375-cb25ea841643?auto=format&fit=crop&w=1400&q=80",
    href: "/about",
  },
  {
    id: "eastern-riders-meet-2025",
    scope: "local",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1783668992941-a52bb1f59c42?auto=format&fit=crop&w=1400&q=80",
    href: "/about",
  },
  {
    id: "riyadh-season-motors-2026",
    scope: "local",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1780853740000-441ba8208ed5?auto=format&fit=crop&w=1400&q=80",
    href: "/about",
  },
  {
    id: "stryker-showcase-2026",
    scope: "local",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1785100292412-97886edb1978?auto=format&fit=crop&w=1400&q=80",
    href: "/about",
  },
  {
    id: "dubai-custom-riders-2026",
    scope: "international",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1546801375-cb25ea841643?auto=format&fit=crop&w=1400&q=80",
    href: "/about",
  },
  {
    id: "manama-bike-fest-2026",
    scope: "international",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1783668992941-a52bb1f59c42?auto=format&fit=crop&w=1400&q=80",
    href: "/about",
  },
] satisfies {
  id: keyof Dictionary["participations"]["events"]
  scope: Exclude<ParticipationScope, "all">
  year: string
  image: string
  href: string
}[]

export const JOURNEY_IMAGE =
  "https://images.unsplash.com/photo-1546801375-cb25ea841643?auto=format&fit=crop&w=1400&q=80"

export const STORY_IMAGE =
  "https://images.unsplash.com/photo-1783668992941-a52bb1f59c42?auto=format&fit=crop&w=1400&q=80"

/**
 * شعارات الجهات الرسمية المعروضة في شريط التذييل.
 *
 * الملفات الثلاثة في `public/` بخلفية شفافة — لا تستبدلها بنسخ ذات خلفية
 * بيضاء: الشريط يعرضها على الورق الرملي مباشرة بلا لوح خلفها، فأي خلفية
 * معتمة ستظهر كمستطيل مقصوص.
 *
 * المقاسات هنا هي أبعاد الملفات الحقيقية ليحجز المتصفح مكانها قبل التحميل؛
 * العرض النهائي بارتفاع بصري يُحدَّد في التذييل و`object-contain` يحفظ النسبة.
 */
export const ENDORSEMENTS = [
  { id: "ministry", logo: "/ministry-of-sport.png", width: 738, height: 228 },
  { id: "samf", logo: "/SAMF.png", width: 691, height: 361 },
  { id: "gcc", logo: "/gcc.png", width: 500, height: 500 },
] satisfies {
  id: keyof Dictionary["footer"]["endorsement"]["logos"]
  logo: string
  width: number
  height: number
}[]

/**
 * الثوابت غير المترجمة. لا شعار نصي هنا: `tagline` يُقرأ من
 * `dict.site.tagline` حتى لا تُطبع جملة إنجليزية في الصفحة العربية.
 */
export const SITE = {
  name: "STRYKER CUSTOM BIKE SHOW",
  short: "STRYKER",
  email: "info@stryker-customs.com",
  url: "https://stryker-customs.com",
  /** سنة التأسيس — تغذّي `foundingDate` في البيانات المهيكلة. */
  founded: "2025",
  socials: [
    { label: "Instagram", handle: "@stryker.show", href: "https://instagram.com" },
    { label: "X", handle: "@stryker_show", href: "https://x.com" },
    { label: "YouTube", handle: "STRYKER SHOW", href: "https://youtube.com" },
  ],
}
