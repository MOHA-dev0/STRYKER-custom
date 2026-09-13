import Link from "next/link"
import { Wrench, SprayCan, Handshake, ArrowUpRight } from "lucide-react"

import { CTA_LANES } from "@/lib/data"
import { localeHref } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { Button } from "@/components/ui/button"
import { EmblemWatermark } from "@/components/site/emblem"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"

const LANE_ICONS = {
  workshops: Wrench,
  artists: SprayCan,
  sponsors: Handshake,
} as const

export async function CallToAction() {
  const locale = await getLocale()
  const dict = await getDictionary()
  const copy = dict.cta

  return (
    <section className="relative overflow-hidden border-y border-line bg-pine-soft/60">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <EmblemWatermark className="-bottom-16 start-[-5rem] h-[30rem] md:h-[38rem]" />

      <div className="shell relative py-24 md:py-32">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              05
            </span>
            <span className="rule-accent h-px w-10" />
            <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
          </div>
          <h2 className="mt-4 font-display text-4xl leading-[1.25] font-bold text-balance text-ink sm:text-5xl">
            {copy.titleLead}
            <span className="accent-word">{copy.titleAccent}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-loose text-ink-soft">
            {copy.lead}
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
          {CTA_LANES.map((lane, i) => {
            const item = copy.lanes[lane.id]
            const Icon = LANE_ICONS[lane.id]
            return (
              <RevealItem key={lane.id} className="h-full">
                <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-paper p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-pine/35 hover:shadow-lift">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-4 end-4 font-plate text-[5rem] leading-none font-black text-ink/[0.035] select-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="grid size-12 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-all duration-500 group-hover:border-pine/35 group-hover:bg-pine group-hover:text-paper">
                    <Icon className="size-5" />
                  </span>

                  <div className="relative">
                    <p className="eyebrow text-ink-mute">{item.code}</p>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-ink">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-loose text-ink-soft">{item.body}</p>

                  <Link
                    href={localeHref(locale, lane.href)}
                    className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-pine-deep transition-colors hover:text-ember-deep"
                  >
                    {item.cta}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-1 rtl:-scale-x-100 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center gap-4">
          <Button asChild variant="pine" size="lg">
            <Link href={localeHref(locale, "/submissions")}>
              {copy.primaryCta}
              <ArrowUpRight className="size-4 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={localeHref(locale, "/contact")}>{copy.secondaryCta}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
