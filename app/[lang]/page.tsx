import type { Metadata } from "next"

import { localeAlternates } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/dictionaries"
import { StickyHero } from "@/components/site/sticky-hero"
import { StatsBar } from "@/components/site/stats-bar"
import { Essence } from "@/components/site/essence"
import { RiderCode } from "@/components/site/rider-code"
import { Squad } from "@/components/site/squad"
import { Participations } from "@/components/site/participations"
import { Journey } from "@/components/site/journey"

export async function generateMetadata(): Promise<Metadata> {
  // العنوان والوصف يرثان من التخطيط الجذر — هنا فقط الروابط البديلة للغات.
  const locale = await getLocale()
  return { alternates: localeAlternates(locale, "/") }
}

export default function HomePage() {
  return (
    <>
      <StickyHero />
      <StatsBar />
      <Essence />
      <RiderCode />
      <Squad />
      <Participations limit={3} />
      <Journey />
    </>
  )
}
