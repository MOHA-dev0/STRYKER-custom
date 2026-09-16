import Image from "next/image"

import { JOURNEY_IMAGE } from "@/lib/data"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"

export async function Journey() {
  const dict = await getDictionary()
  const copy = dict.journey

  return (
    <section className="relative overflow-hidden border-y border-line bg-sand-soft/75 py-24 md:py-32">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />
      

      {/* سنة عملاقة في الخلفية */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 start-0 font-plate text-[26vw] leading-none font-black text-ink/4 select-none"
      >
        2025
      </span>

      <div className="shell relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Reveal className="flex items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              07
            </span>
            <span className="rule-accent h-px w-10" />
            <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
              {copy.title}
            </h2>
          </Reveal>

          {/*
            لا حرف استهلالي هنا: العربية تصل حروفها، وفصل أول حرف يكسر الكلمة.
            الفقرة الأولى تُميَّز بالحجم وخط جانبي بدلاً من ذلك.
          */}
          <div className="mt-7 space-y-5">
            {copy.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                {i === 0 ? (
                  <p className="max-w-2xl border-s-2 border-pine/30 ps-5 text-[17px] leading-loose font-medium text-ink">
                    {p}
                  </p>
                ) : (
                  <p className="max-w-2xl text-[15px] leading-loose text-ink-soft">{p}</p>
                )}
              </Reveal>
            ))}
          </div>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {copy.milestones.map((m) => (
              <RevealItem key={m.k} className="bg-sand-soft">
                <div className="flex h-full flex-col gap-1 p-5">
                  <span className="font-plate text-3xl leading-none font-black text-pine-deep">
                    {m.k}
                  </span>
                  <span className="text-xs leading-relaxed text-ink-soft">{m.v}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* صورة مؤطّرة */}
        <Reveal delay={0.12} className="relative">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-line bg-ink shadow-lift">
            <Image
              src={JOURNEY_IMAGE}
              alt={copy.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="eyebrow text-pine">{copy.imageEyebrow}</p>
              <p className="mt-2 font-display text-lg font-bold text-paper">
                {copy.imageCaption}
              </p>
            </div>

            {/* لوحة معدنية — اسم المشروع الأول، من القاموس */}
            <div className="absolute end-5 top-5 rotate-[-4deg] border border-line bg-paper/95 px-3 py-1.5 shadow-lg">
              <span className="plate-mark text-[11px] font-black text-ink">
                {copy.plate}
              </span>
            </div>
          </div>

          {/* ظل مائل خلف الصورة */}
          <div
            aria-hidden
            className="absolute -bottom-4 -start-4 -z-10 h-full w-full rounded-xl border border-ember/25"
          />
        </Reveal>
      </div>
    </section>
  )
}
