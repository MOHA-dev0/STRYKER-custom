import { Flame, Scale, ShieldCheck, Users } from "lucide-react"

import { RIDER_CODE } from "@/lib/data"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"

const PILLAR_ICONS = {
  safety: ShieldCheck,
  compliance: Scale,
  community: Users,
  culture: Flame,
} as const

/**
 * ميثاق الراكب — أربع ركائز للسلامة والنظام وروح المجموعة.
 *
 * يتبع نفس مفردات بقية الصفحة: ورق دافئ، حدود شعرية، والصنوبر لوناً مميزاً
 * يظهر عند المرور. الشريط الرملي الخفيف وحده يفصله عمّا قبله وبعده.
 */
export async function RiderCode() {
  const dict = await getDictionary()
  const copy = dict.riderCode

  return (
    <section
      id="rider-code"
      className="relative overflow-hidden border-y border-line bg-sand-soft/60 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="hatch pointer-events-none absolute inset-0 opacity-[0.16]"
      />

      <div className="shell relative">
        {/* العنوان — موسّط، فالركائز الأربع تحته شبكة متناظرة */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal className="flex items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              04
            </span>
            <span className="rule-accent h-px w-10" />
            {/*
              نصّان من القاموس: الأول بوزن المتن العادي والثاني بصنف `eyebrow`
              الذي يبدّل وجهه وتتبّعه مع اتجاه المستند، فلا تتفكّك العربية.
            */}
            <span className="text-[12px] font-bold text-ink">
              {copy.eyebrow}
            </span>
            <span className="text-ink-mute/50">—</span>
            <span className="eyebrow text-pine-deep">{copy.code}</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-3xl leading-[1.25] font-bold text-balance text-ink sm:text-4xl md:text-[2.75rem]">
              {copy.titleLead}
              <span className="accent-word">{copy.titleAccent}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 text-[15px] leading-loose text-ink-soft">
              {copy.lead}
            </p>
          </Reveal>
        </div>

        {/* الركائز الأربع */}
        <RevealGroup
          className="mt-14 grid gap-5 md:mt-16 md:grid-cols-2 xl:grid-cols-4"
          stagger={0.1}
        >
          {RIDER_CODE.map((id, i) => {
            const pillar = copy.pillars[id]
            const Icon = PILLAR_ICONS[id]
            return (
              <RevealItem key={id} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/35 hover:shadow-lift">
                  {/* عمود فقري صنوبري يمتد عند المرور — كما في بطاقات «من نحن» */}
                  <span
                    aria-hidden
                    className="origin-start-top absolute inset-y-0 start-0 w-[3px] scale-y-0 bg-pine transition-transform duration-500 group-hover:scale-y-100"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-colors duration-500 group-hover:border-pine/35 group-hover:bg-pine group-hover:text-paper">
                      <Icon className="size-5" />
                    </span>

                    <span
                      aria-hidden
                      className="font-plate text-5xl leading-none font-black text-ink/10 transition-colors duration-500 select-none group-hover:text-pine/20"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="eyebrow mt-6 text-ink-mute">{pillar.code}</p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-loose text-ink-soft">
                    {pillar.body}
                  </p>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
