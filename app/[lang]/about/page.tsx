import type { Metadata } from "next"

import { localeAlternates, localeHref } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { aboutJsonLd, JsonLd } from "@/lib/seo"
import { PageHero } from "@/components/site/page-hero"
import { StoryVision } from "@/components/site/story-vision"
// مكوّنا عميل تحت الطية — يُنزَّل JS كل منهما بعد أول رسم.
import { StagesGrid, GrowthTimeline } from "@/components/site/lazy-sections"
import { CallToAction } from "@/components/site/cta"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary()
  return {
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    keywords: [...dict.meta.about.keywords],
    alternates: localeAlternates(locale, "/about"),
    /* البطاقة ترث الصورة والموقع من الجذر؛ العنوان وحده يخصّ الصفحة. */
    openGraph: {
      title: dict.meta.about.title,
      description: dict.meta.about.description,
      url: localeHref(locale, "/about"),
    },
    twitter: {
      title: dict.meta.about.title,
      description: dict.meta.about.description,
    },
  }
}

export default async function AboutPage() {
  const locale = await getLocale()
  const dict = await getDictionary()
  const hero = dict.about.hero

  return (
    <>
      {/* البيانات المهيكلة — تُقرأ للفهرسة ولا تظهر في الصفحة. */}
      <JsonLd data={aboutJsonLd(locale, dict)} />

      <PageHero
        index="01"
        eyebrow={hero.eyebrow}
        mark={hero.mark}
        title={hero.title}
        lead={hero.lead}
      />
      <StoryVision />
      <StagesGrid />
      <GrowthTimeline />
      <CallToAction />
    </>
  )
}
