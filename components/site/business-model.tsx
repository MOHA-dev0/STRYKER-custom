import Link from "next/link"
import { BadgeCheck, ClipboardList, Link2, Megaphone, ArrowUpRight } from "lucide-react"

import { localeHref } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"
import { RevealGroup, RevealItem, Reveal } from "@/components/site/reveal"

const icons = [BadgeCheck, ClipboardList, Link2, Megaphone]

export async function BusinessModel() {
  const locale = await getLocale()
  const dict = await getDictionary()
  const copy = dict.about.business

  return (
    <section id="business" className="shell py-24 md:py-32">
      <SectionHeading
        index="04"
        eyebrow={copy.eyebrow}
        title={
          <>
            {copy.titleLead}
            <span className="accent-word">{copy.titleAccent}</span>
          </>
        }
        lead={copy.lead}
      />

      <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" stagger={0.09}>
        {copy.items.map((item, i) => {
          const Icon = icons[i % icons.length]
          return (
            <RevealItem key={item.code} className="h-full">
              <div className="group relative flex h-full gap-5 overflow-hidden rounded-xl border border-line bg-paper p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/30">
                <span
                  aria-hidden
                  className="absolute -top-6 -start-6 font-plate text-8xl leading-none font-black text-ink/4 transition-colors duration-500 group-hover:text-ember/10"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-all duration-500 group-hover:border-pine/30 group-hover:bg-pine group-hover:text-paper">
                  <Icon className="size-5" />
                </span>

                <div className="relative">
                  <p className="eyebrow text-pine-deep">{item.code}</p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-loose text-ink-soft">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-xl border border-line bg-[linear-gradient(115deg,rgba(23,97,74,0.1),rgba(247,245,240,0)_62%)] p-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-ember-deep">{copy.deckEyebrow}</p>
            <p className="mt-2 max-w-xl font-display text-xl font-bold text-ink">
              {copy.deckTitle}
            </p>
          </div>
          <Button asChild variant="pine" size="lg" className="shrink-0">
            <Link href={localeHref(locale, "/contact?subject=sponsorship")}>
              {copy.deckCta}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
