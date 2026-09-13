import type { Metadata } from "next"
import { Suspense } from "react"
import { Mail, MapPin, Share2, Clock } from "lucide-react"

import { SITE } from "@/lib/data"
import { localeAlternates } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { PageHero } from "@/components/site/page-hero"
import { ContactForm } from "@/components/site/contact-form"
import { Faq } from "@/components/site/faq"
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary()
  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    alternates: localeAlternates(locale, "/contact"),
  }
}

function ContactFormFallback() {
  return (
    <div className="h-[34rem] animate-pulse rounded-xl border border-line bg-paper/60" />
  )
}

export default async function ContactPage() {
  const dict = await getDictionary()
  const copy = dict.contact

  return (
    <>
      <PageHero
        index="01"
        eyebrow={copy.hero.eyebrow}
        mark={copy.hero.mark}
        title={copy.hero.title}
        lead={copy.hero.lead}
      />

      <section className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        {/* بطاقات المعلومات */}
        <div className="lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              02
            </span>
            <span className="rule-accent h-px w-10" />
            <span className="eyebrow text-pine-deep">{copy.infoEyebrow}</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">
            {copy.infoTitle}
          </h2>

          <RevealGroup className="mt-8 space-y-4">
            <RevealItem>
              <a
                href={`mailto:${SITE.email}`}
                className="brackets group flex items-start gap-4 rounded-xl border border-line bg-paper p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/30"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine transition-all duration-500 group-hover:border-pine/30 group-hover:bg-pine group-hover:text-paper">
                  <Mail className="size-5" />
                </span>
                <div>
                  <p className="eyebrow text-pine-deep">{copy.cards.email}</p>
                  <p
                    dir="ltr"
                    className="mt-1 text-start font-plate text-lg font-bold tracking-wide text-ink"
                  >
                    {SITE.email}
                  </p>
                  <p className="mt-1 text-xs text-ink-mute">{copy.emailNote}</p>
                </div>
              </a>
            </RevealItem>

            <RevealItem>
              <div className="brackets flex items-start gap-4 rounded-xl border border-line bg-paper p-6 shadow-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="eyebrow text-pine-deep">{copy.cards.location}</p>
                  <p className="mt-1 font-display text-lg font-bold text-ink">
                    {dict.site.location}
                  </p>
                  <p className="mt-1 text-xs text-ink-mute">{copy.locationNote}</p>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="brackets rounded-xl border border-line bg-paper p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-sand-soft text-pine">
                    <Share2 className="size-5" />
                  </span>
                  <div>
                    <p className="eyebrow text-pine-deep">{copy.cards.social}</p>
                    <p className="mt-1 font-display text-lg font-bold text-ink">
                      {copy.socialTitle}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-px border border-line bg-line">
                  {SITE.socials.map((s) => (
                    <li key={s.label} className="bg-paper">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-sand-soft"
                      >
                        <span className="font-plate text-xs font-black tracking-[0.24em] text-ink-soft transition-colors group-hover:text-ember-deep">
                          {s.label.toUpperCase()}
                        </span>
                        <span dir="ltr" className="text-sm text-ink-mute">
                          {s.handle}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="flex items-center gap-3 rounded-xl border border-ember/25 bg-ember/5 px-5 py-4">
                <Clock className="size-4 shrink-0 text-ember" />
                <p className="text-xs leading-relaxed text-ink-soft">{copy.hours}</p>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>

        {/* النموذج */}
        <Reveal delay={0.08}>
          <Suspense fallback={<ContactFormFallback />}>
            <ContactForm />
          </Suspense>
        </Reveal>
      </section>

      <Faq />
    </>
  )
}
