import type { Metadata } from "next"

import { localeAlternates } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { PageHero } from "@/components/site/page-hero"
import { StoryVision } from "@/components/site/story-vision"
import { StagesGrid } from "@/components/site/stages-grid"
import { GrowthTimeline } from "@/components/site/growth-timeline"
import { BusinessModel } from "@/components/site/business-model"
import { CallToAction } from "@/components/site/cta"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary()
  return {
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    alternates: localeAlternates(locale, "/about"),
  }
}

export default async function AboutPage() {
  const dict = await getDictionary()
  const hero = dict.about.hero

  return (
    <>
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
      <BusinessModel />
      <CallToAction />
    </>
  )
}
