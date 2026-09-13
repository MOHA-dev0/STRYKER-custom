import Image from "next/image"
import { Compass, Flag, Gem } from "lucide-react"

import { STORY_IMAGE, STORY_PILLARS } from "@/lib/data"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"

const PILLAR_ICONS = {
  story: Gem,
  vision: Compass,
  mission: Flag,
} as const

export async function StoryVision() {
  const dict = await getDictionary()
  const copy = dict.about.story

  return (
    <section id="story" className="shell py-24 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        {/* صورة */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-ink shadow-lift">
            <Image
              src={STORY_IMAGE}
              alt={copy.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
            <div className="absolute bottom-6 end-6">
              <p className="eyebrow text-pine">{copy.imageEyebrow}</p>
              <p className="mt-1.5 font-display text-lg font-bold text-paper">
                {copy.imageCaption}
              </p>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute -bottom-4 -end-4 -z-10 h-full w-full rounded-xl border border-ember/25"
          />
        </Reveal>

        {/* نص */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            index="01"
            eyebrow={copy.eyebrow}
            title={
              <>
                {copy.titleLead}
                <span className="accent-word">{copy.titleAccent}</span>
              </>
            }
            lead={copy.lead}
          />

          <RevealGroup className="mt-10 space-y-3">
            {STORY_PILLARS.map((id) => {
              const pillar = copy.pillars[id]
              const Icon = PILLAR_ICONS[id]
              return (
                <RevealItem key={id} className="rounded-xl border border-line bg-paper transition-colors">
                  <div className="group flex gap-5 rounded-xl p-6 transition-colors duration-500 hover:bg-sand-soft/60">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-all duration-500 group-hover:border-pine/30 group-hover:bg-pine group-hover:text-paper">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="eyebrow text-pine-deep">{pillar.code}</p>
                      <h3 className="mt-1 font-display text-lg font-bold text-ink">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-loose text-ink-soft">
                        {pillar.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
