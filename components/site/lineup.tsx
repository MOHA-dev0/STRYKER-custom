import { Bike, CarFront, Gauge } from "lucide-react"

import { LINEUP } from "@/lib/data"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/site/section-heading"
import { RevealGroup, RevealItem, Reveal } from "@/components/site/reveal"

/**
 * الأيقونات تُربط هنا لا في `lib/data.ts`: ذلك الملف مستورَد في مكوّنات
 * العميل، فربط lucide فيه يسحب الأيقونات كلها إلى حزمة المتصفح.
 */
const TRACK_ICONS = {
  bikes: Bike,
  classic: CarFront,
  sport: Gauge,
} as const

/**
 * «ما نعرضه» — المسارات الثلاثة التي تغطّيها المنصة: الدراجات النارية
 * المعدّلة، والسيارات الكلاسيك، وسيارات السبورت.
 *
 * البطاقات الثلاث بعرض متساوٍ من `md` فصاعداً، وكل بطاقة ترث مفردات القسم
 * نفسها: ورق دافئ، حدود شعرية، عمود صنوبري ينمو عند المرور، ورقم مرحلة
 * باهت في الزاوية.
 */
export async function Lineup() {
  const dict = await getDictionary()
  const copy = dict.lineup

  return (
    <section
      id="lineup"
      className="relative overflow-hidden border-y border-line bg-sand-soft/50 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-[0.35]"
      />

      <div className="shell relative">
        <SectionHeading
          index="03"
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titleLead}
              <span className="accent-word">{copy.titleAccent}</span>
            </>
          }
          lead={copy.lead}
        />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {LINEUP.map((id, i) => {
            const track = copy.tracks[id]
            const Icon = TRACK_ICONS[id]
            return (
              <RevealItem key={id} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-pine/35 hover:shadow-lift md:p-8">
                  {/* عمود فقري صنوبري يمتد عند المرور — نفس حركة بطاقات «من نحن» */}
                  <span
                    aria-hidden
                    className="origin-start-top absolute inset-y-0 start-0 w-[3px] scale-y-0 bg-pine transition-transform duration-500 group-hover:scale-y-100"
                  />

                  <span
                    aria-hidden
                    className="absolute end-7 top-7 font-plate text-sm font-black tracking-[0.2em] text-ink/15 select-none md:end-8 md:top-8"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-colors duration-500 group-hover:border-pine/35 group-hover:bg-pine group-hover:text-paper">
                    <Icon className="size-5" />
                  </span>

                  <p className="eyebrow mt-6 text-ink-mute">{track.code}</p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-balance text-ink">
                    {track.title}
                  </h3>

                  <span
                    aria-hidden
                    className="origin-start mt-4 block h-px w-12 bg-pine/35 transition-transform duration-500 group-hover:scale-x-[2.2]"
                  />

                  <p className="mt-4 text-[15px] leading-loose text-ink-soft">
                    {track.body}
                  </p>

                  {/* الوسوم تُدفع لأسفل البطاقة فتستوي حوافها السفلى في الشبكة */}
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {track.tags.map((tag) => (
                      <li key={tag}>
                        <Badge variant="outline">{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>

        <Reveal delay={0.08} className="mt-10 flex items-center gap-3">
          <span aria-hidden className="rule-accent h-px w-12 shrink-0" />
          <p className="text-sm text-ink-mute">{copy.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
