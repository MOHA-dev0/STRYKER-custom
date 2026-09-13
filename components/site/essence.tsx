import Link from "next/link"
import { ArrowUpRight, Compass, Flame, Target } from "lucide-react"

import { localeHref } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { EmblemWatermark } from "@/components/site/emblem"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"

const PILLAR_ICONS = {
  story: Flame,
  vision: Compass,
  mission: Target,
} as const

const PILLARS = ["story", "vision", "mission"] as const

/**
 * «من نحن» المختصر على الصفحة الرئيسية: فقرة تعريفية قصيرة،
 * ثلاث علامات رقمية، ثم بطاقات القصة والرؤية والرسالة.
 */
export async function Essence() {
  const locale = await getLocale()
  const dict = await getDictionary()
  const copy = dict.essence

  return (
    <section id="essence" className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
      <EmblemWatermark className="-top-10 end-[-4rem] h-[26rem] md:h-[34rem]" />

      <div className="shell relative grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        {/* العمود التعريفي */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="flex items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              02
            </span>
            <span className="rule-accent h-px w-10" />
            <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-3xl leading-[1.25] font-bold text-balance text-ink sm:text-4xl md:text-[2.75rem]">
              {copy.titleLead}
              <span className="accent-word">{copy.titleAccent}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[15px] leading-loose text-ink-soft">
              {copy.lead}
            </p>
          </Reveal>

          {/* علامات رقمية — مفصولة بخطوط شعرية */}
          <RevealGroup className="mt-9 flex flex-wrap items-stretch">
            {copy.marks.map((m, i) => (
              <RevealItem
                key={m.k}
                className={i > 0 ? "border-s border-line ps-6 ms-6" : ""}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-plate text-4xl leading-none font-black text-pine">
                    {m.k}
                  </span>
                  <span className="text-xs text-ink-mute">{m.v}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <Link
              href={localeHref(locale, "/about")}
              className="group mt-9 inline-flex items-center gap-2 border-b border-line pb-1 text-sm font-bold text-pine-deep transition-colors hover:border-pine"
            >
              {copy.cta}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
            </Link>
          </Reveal>
        </div>

        {/* الرؤية والرسالة */}
        <RevealGroup className="flex flex-col gap-5" stagger={0.12}>
          {PILLARS.map((id, i) => {
            const pillar = copy.pillars[id]
            const Icon = PILLAR_ICONS[id]
            return (
              <RevealItem key={id} className={i === 1 ? "lg:ms-10" : ""}>
                <article className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/35 hover:shadow-lift md:p-9">
                  {/* عمود فقري صنوبري يمتد عند المرور */}
                  <span className="origin-start-top absolute inset-y-0 start-0 w-[3px] scale-y-0 bg-pine transition-transform duration-500 group-hover:scale-y-100" />

                  <span
                    aria-hidden
                    className="absolute end-7 top-7 font-plate text-sm font-black tracking-[0.2em] text-ink/15 select-none md:end-9 md:top-9"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex items-start gap-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-colors duration-500 group-hover:border-pine/35 group-hover:bg-pine group-hover:text-paper">
                      <Icon className="size-5" />
                    </span>

                    <div>
                      <p className="eyebrow text-ink-mute">{pillar.code}</p>
                      <h3 className="mt-1.5 font-display text-xl font-bold text-ink">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-loose text-ink-soft">
                        {pillar.body}
                      </p>
                    </div>
                  </div>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
