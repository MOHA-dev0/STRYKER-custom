import type { Metadata } from "next"
import { Camera, ClipboardCheck, Hammer, Timer } from "lucide-react"

import { localeAlternates } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { Badge } from "@/components/ui/badge"
import { Participations } from "@/components/site/participations"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"
import { SubmissionForm } from "@/components/site/submission-form"
import { Ticker } from "@/components/site/ticker"

const STEP_ICONS = [ClipboardCheck, Camera, Hammer, Timer]

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary()
  return {
    title: dict.meta.submissions.title,
    description: dict.meta.submissions.description,
    alternates: localeAlternates(locale, "/submissions"),
  }
}

export default async function SubmissionsPage() {
  const dict = await getDictionary()
  const copy = dict.submissions

  return (
    <>
      {/* الغلاف */}
      <section className="relative overflow-hidden border-b border-line bg-sand-soft">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-70" />
        <div className="grain pointer-events-none absolute inset-0" />
        <span
          aria-hidden
          className="plate-title pointer-events-none absolute -bottom-8 start-0 text-[20vw] leading-none font-black whitespace-nowrap text-ink/4 select-none"
        >
          {copy.backdrop}
        </span>

        <div className="shell relative pb-20 pt-32 md:pb-24 md:pt-40">
          <Reveal className="flex flex-wrap items-center gap-4">
            <Badge variant="ember">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-ember" />
              {copy.badge}
            </Badge>
            <span className="rule-accent h-px w-16" />
            <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 font-display text-[clamp(2.2rem,6.5vw,4.25rem)] leading-[1.12] font-bold text-ink">
              {copy.titleLead}
              <span className="accent-word">{copy.titleAccent}</span>
            </h1>
            <p className="plate-mark mt-3 text-sm font-black text-pine-deep">
              {copy.titlePlate}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-ink-soft">
              {copy.lead}
            </p>
          </Reveal>
        </div>
      </section>

      <Ticker
        className="border-y border-line bg-pine text-paper"
        items={copy.ticker}
      />

      {/* السجل الكامل — الرئيسية تعرض أحدث ثلاث مشاركات وتحيل إلى هنا. */}
      <Participations index="01" className="border-b border-line bg-sand-soft/50" />

      {/* الخطوات + النموذج */}
      <section className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              02
            </span>
            <span className="rule-accent h-px w-10" />
            <span className="eyebrow text-pine-deep">{copy.howEyebrow}</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">
            {copy.howTitle}
          </h2>

          <RevealGroup className="mt-8 space-y-3">
            {copy.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? ClipboardCheck
              return (
                <RevealItem key={s.code} className="rounded-xl border border-line bg-paper">
                  <div className="group flex gap-4 rounded-xl p-5 transition-colors duration-500 hover:bg-sand-soft/60">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-all duration-500 group-hover:border-pine/30 group-hover:bg-pine group-hover:text-paper">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="eyebrow text-pine-deep">{s.code}</p>
                      <h3 className="mt-1 font-display text-base font-bold text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>

        <Reveal delay={0.08}>
          <SubmissionForm />
        </Reveal>
      </section>
    </>
  )
}
