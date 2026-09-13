"use client"

import dynamic from "next/dynamic"

/*
 * الأقسام المؤجّلة — ما يقع تحت الطية ويحمل JS خاصاً به.
 *
 * لماذا هذا الملف أصلاً؟ لأن `next/dynamic` المستدعى داخل مكوّن خادم لا يقسّم
 * مكوّن عميل: التقسيم التلقائي غير مدعوم في ذلك الاتجاه (راجع
 * `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`). فالنداء
 * يحتاج أن يجري داخل حدّ عميل حتى يصير حدّاً حقيقياً في الحزمة — وهذا الملف
 * هو ذلك الحدّ، لا شيء فيه غيره.
 *
 * الأقسام هنا وحدها هي ما يستحق التأجيل: أقسام الخادم (`Participations`،
 * `Journey`، `Essence`…) لا ترسل JS إلى المتصفح أصلاً بعد أن صار `Reveal`
 * مراقبَ تقاطع بلا اعتمادات، فتأجيلها يضيف حدّ Suspense بلا مقابل.
 *
 * `ssr` يبقى على حاله (مفعّلاً): HTML هذه الأقسام يُصيَّر على الخادم كما كان —
 * فلا فقدان لأرشفة ولا قفزة تخطيط — والمؤجَّل هو تنزيل JS وتحليله وحدهما، وهو
 * ما كان يُنفَق قبل أن يصل القارئ إلى القسم.
 */

export const StatsBar = dynamic(() =>
  import("@/components/site/stats-bar").then((mod) => mod.StatsBar)
)

export const Squad = dynamic(() =>
  import("@/components/site/squad").then((mod) => mod.Squad)
)

export const StagesGrid = dynamic(() =>
  import("@/components/site/stages-grid").then((mod) => mod.StagesGrid)
)

export const GrowthTimeline = dynamic(() =>
  import("@/components/site/growth-timeline").then((mod) => mod.GrowthTimeline)
)
