import type { Metadata } from "next"

import { localeAlternates } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { homeJsonLd, JsonLd } from "@/lib/seo"
import { StickyHero } from "@/components/site/sticky-hero"
import { Essence } from "@/components/site/essence"
import { Lineup } from "@/components/site/lineup"
import { RiderCode } from "@/components/site/rider-code"
import { Participations } from "@/components/site/participations"
import { Journey } from "@/components/site/journey"
// شريط المراكز ولوحة الفريق مكوّنا عميل تحت الطية — يُنزَّل JS كل منهما بعد
// أول رسم بدل أن يزاحم الـ Hero عليه. راجع `lazy-sections` لسبب وجود الملف.
import { StatsBar, Squad } from "@/components/site/lazy-sections"

export async function generateMetadata(): Promise<Metadata> {
  // العنوان والوصف يرثان من التخطيط الجذر — هنا فقط الروابط البديلة للغات.
  const locale = await getLocale()
  return { alternates: localeAlternates(locale, "/") }
}

export default async function HomePage() {
  const locale = await getLocale()
  const dict = await getDictionary()

  return (
    <>
      {/*
        البيانات المهيكلة للصفحة: الجهة، والموقع بلغتيه، والمشاركات كفعاليات.
        تُصيَّر على الخادم ولا تصل حزمة المتصفح.
      */}
      <JsonLd data={homeJsonLd(locale, dict)} />

      <StickyHero />
      <StatsBar />
      <Essence />
      <Lineup />
      <RiderCode />
      <Squad />
      <Participations limit={3} />
      <Journey />
    </>
  )
}
