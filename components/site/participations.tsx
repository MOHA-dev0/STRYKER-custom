import Link from "next/link"
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { PARTICIPATIONS, type ParticipationScope } from "@/lib/data"
import { localeHref } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EventGallery } from "@/components/site/event-gallery"
import { Reveal } from "@/components/site/reveal"
import {
  ParticipationFilter,
  ParticipationSlot,
} from "@/components/site/participation-filter"

/**
 * سجل المشاركات والفعاليات.
 *
 * يُركّب في موضعين: الرئيسية تمرّر `limit={3}` فتعرض أبرز ثلاث مشاركات وزر
 * "اكتشف المزيد"، وصفحة المشاركات تُركّبه بلا حد فتعرض السجل كاملاً.
 *
 * النصوص كلها في `participations` بالقاموسين، والبيانات غير المترجمة
 * (المعرّف، النطاق، السنة، التاريخ، وسائط المعرض) في `PARTICIPATIONS` داخل
 * `lib/data.ts` — وترتيبها هناك هو ترتيب العرض هنا.
 *
 * القسم مكوّن خادم، والتفاعل فيه معزول في مكوّني عميل: مرشّح داخل/خارج السعودية
 * في `participation-filter`، ومعرض صور كل فعالية في `event-gallery`. نصوص
 * البطاقات نفسها لا تنزل إلى حزمة المتصفح.
 */

export async function Participations({
  limit,
  index = "06",
  className,
}: {
  /** يقصر العرض على أبرز n مشاركة ويُظهر زر "اكتشف المزيد". بدونه يُعرض السجل كاملاً. */
  limit?: number
  /** رقم القسم في تسلسل الصفحة المضيفة. */
  index?: string
  className?: string
}) {
  const locale = await getLocale()
  const dict = await getDictionary()
  const copy = dict.participations
  const events = limit ? PARTICIPATIONS.slice(0, limit) : PARTICIPATIONS
  const isTruncated = events.length < PARTICIPATIONS.length

  const counts: Record<ParticipationScope, number> = {
    all: events.length,
    local: events.filter((e) => e.scope === "local").length,
    international: events.filter((e) => e.scope === "international").length,
  }

  /*
   * المرشّح يظهر فقط حين يكون في المعروض ما يُصفّى: لو كانت المشاركات كلها
   * داخل المملكة (أو كلها خارجها) لصار الزر خيارين أحدهما يفرغ القائمة.
   */
  const hasFilter = counts.local > 0 && counts.international > 0

  const list = (
    <div
      className={cn(
        "flex flex-col gap-8 md:gap-10",
        hasFilter ? "mt-8" : "mt-14"
      )}
    >
      {events.map((event, i) => {
        const text = copy.events[event.id]
        return (
          <ParticipationSlot key={event.id} scope={event.scope}>
            <Reveal
              as="article"
              delay={i === 0 ? 0 : 0.06}
              className="group relative grid overflow-hidden rounded-2xl border border-line bg-paper shadow-soft transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-pine/35 hover:shadow-lift md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              {/*
                المعرض — أعلى البطاقة على الجوال، وعلى حافة البداية من md فصاعداً.
                الإطار طولي (4:5) لا عريض: أغلب صور الفعاليات ملتقطة بالهاتف
                رأسياً، وإطار عريض كان سيحشرها في ثلث عرضه ويترك الباقي خلفية.
              */}
              <EventGallery
                media={event.media}
                captions={text.photos}
                className="aspect-4/5 md:aspect-auto md:min-h-[30rem]"
              />

              {/* العمود النصي */}
              <div className="flex flex-col p-6 sm:p-8 md:p-10">
                {/* شريط البيانات: الوسام، السنة، المكان */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Badge className="bg-pine text-paper">{text.badge}</Badge>

                  <span className="inline-flex items-center gap-1.5 font-plate text-[12px] font-bold tracking-[0.14em] text-ink-soft">
                    <CalendarDays aria-hidden className="size-3.5 text-pine" />
                    {event.year}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-mute">
                    <MapPin aria-hidden className="size-3.5 shrink-0 text-pine" />
                    {text.location}
                  </span>

                  {/* وسم النطاق — يبقي الفرز مقروءاً بعد رفع المرشّح كذلك */}
                  <Badge variant="outline" className="bg-sand-soft">
                    {copy.filters[event.scope]}
                  </Badge>
                </div>

                <h3 className="mt-5 font-display text-xl leading-snug font-bold text-balance text-ink sm:text-2xl">
                  {text.title}
                </h3>

                <span
                  aria-hidden
                  className="mt-4 block h-px w-12 origin-start bg-pine/35 transition-transform duration-500 group-hover:scale-x-[2.2]"
                />

                <p className="mt-4 text-[15px] leading-loose text-ink-soft">
                  {text.description}
                </p>
              </div>
            </Reveal>
          </ParticipationSlot>
        )
      })}
    </div>
  )

  return (
    <section id="participations" className={cn("py-24 md:py-32", className)}>
      <div className="shell">
        <Reveal className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
              {index}
            </span>
            <span className="rule-accent h-px w-10" />
            {/* `.eyebrow` يتبدّل وجهه وتتبّعه مع اتجاه المستند، فالعربية لا تتفكّك. */}
            <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
          </div>

          <h2 className="font-display text-3xl leading-[1.25] font-bold text-balance text-ink sm:text-4xl md:text-[2.75rem]">
            {copy.titleLead}
            <span className="accent-word">{copy.titleAccent}</span>
          </h2>

          <p className="max-w-2xl text-[15px] leading-loose text-ink-soft">
            {copy.lead}
          </p>
        </Reveal>

        {hasFilter ? (
          <ParticipationFilter counts={counts}>{list}</ParticipationFilter>
        ) : (
          list
        )}

        {/* يظهر على الرئيسية وحدها، حيث القائمة مقصوصة على أبرز ثلاث مشاركات. */}
        {isTruncated && (
          <Reveal delay={0.06} className="mt-12 flex flex-col items-center gap-4">
            <span aria-hidden className="rule-accent h-px w-24" />

            <p className="text-center text-sm text-ink-mute">
              {copy.truncated
                .replace("{shown}", String(events.length))
                .replace("{total}", String(PARTICIPATIONS.length))}
            </p>

            <Button asChild variant="pine" size="lg">
              <Link href={localeHref(locale, "/submissions")}>
                {copy.moreCta}
                <ArrowUpRight
                  aria-hidden
                  className="group-hover/btn:-translate-y-0.5 rtl:-scale-x-100"
                />
              </Link>
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  )
}
