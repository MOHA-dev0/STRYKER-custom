import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, Mail, MapPin } from "lucide-react"

import { ENDORSEMENTS, NAV_LINKS, SITE } from "@/lib/data"
import { localeHref } from "@/lib/i18n/config"
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries"
import { Emblem } from "@/components/site/emblem"
import { Ticker } from "@/components/site/ticker"

/*
 * ارتفاع كل شعار بصري لا هندسي: لو استوت الثلاثة على ارتفاع واحد لبدا
 * الختم الدائري (مجلس التعاون) أصغر من الشعارين العريضين، والقفل المكوّن من
 * رمز فوق سطرين (الاتحاد السعودي) أقصر نصاً من كليهما. الأرقام هنا تسوّي
 * الكتلة المرئية لا الصندوق.
 */
const ENDORSEMENT_HEIGHT: Record<(typeof ENDORSEMENTS)[number]["id"], string> = {
  ministry: "h-8 md:h-9",
  samf: "h-11 md:h-12",
  gcc: "h-10 md:h-11",
}

/** أيقونات المنصات مرسومة يدوياً — lucide لم يعد يشحن أيقونات العلامات. */
const SOCIAL_GLYPHS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.8v4.4l4-2.2-4-2.2Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
      <path d="M17.6 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.4L4.3 21H1l7.7-8.8L1.4 3h6.8l4.7 5.9L17.6 3Zm-1.2 16h1.8L7.7 4.9H5.8L16.4 19Z" />
    </svg>
  ),
}

export async function Footer() {
  const locale = await getLocale()
  const dict = await getDictionary()

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-line bg-sand-soft text-ink">
      <Ticker
        className="border-b border-pine-deep/20 bg-pine text-paper"
        items={dict.footer.ticker}
      />

      <div className="shell relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        {/* الهوية */}
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Emblem size={140} className="h-16" />
            <div>
              <p className="font-plate text-lg font-black tracking-[0.24em] text-ink">
                STRYKER
              </p>
              <p className="mt-1 font-plate text-[10px] font-bold tracking-[0.3em] text-pine">
                CUSTOM BIKE SHOW
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-loose text-ink-soft">
            {dict.footer.blurb}
          </p>
          <div className="rule-accent h-px w-40" />
          <p className="plate-title text-3xl font-black tracking-[0.14em] text-pine-deep rtl:tracking-normal">
            {dict.site.tagline}
          </p>
        </div>

        {/* الروابط */}
        <nav className="space-y-4">
          <p className="eyebrow text-ink-mute">{dict.footer.navHeading}</p>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={localeHref(locale, link.href)}
                  className="group inline-flex items-baseline gap-3 text-sm font-medium text-ink-soft transition-colors hover:text-pine-deep"
                >
                  <span className="h-px w-4 bg-line transition-all duration-300 group-hover:w-7 group-hover:bg-pine" />
                  {dict.nav.links[link.id]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* التواصل */}
        <div className="space-y-4">
          <p className="eyebrow text-ink-mute">{dict.footer.contactHeading}</p>
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-3 text-sm text-ink-soft transition-colors hover:text-pine-deep"
          >
            <Mail className="size-4 shrink-0 text-pine" />
            <span dir="ltr">{SITE.email}</span>
          </a>
          <p className="flex items-center gap-3 text-sm text-ink-soft">
            <MapPin className="size-4 shrink-0 text-pine" />
            {dict.site.location}
          </p>

          <div className="flex gap-2.5 pt-2">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} — ${s.handle}`}
                className="grid size-10 place-items-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:-translate-y-0.5 hover:border-pine hover:bg-pine hover:text-paper"
              >
                {SOCIAL_GLYPHS[s.label] ?? (
                  <span className="font-plate text-sm font-black">{s.label[0]}</span>
                )}
              </a>
            ))}
          </div>

          {/*
            الجهات الرسمية — تُذيّل عمود التواصل تحت أيقونات المنصات مباشرة.
            خيط فاصل رقيق ثم العنوان، فصفّ الشعارات، فجملة الإشراف: الترتيب
            يضع أكبر عنصر بصري في الوسط فلا يزاحم العنوان ولا يُقرأ كتعليق
            على أيقونات التواصل فوقه.

            بلا لوح ولا إطار خلف الشعارات — الملفات شفافة وتقع على الورق
            الرملي مباشرة.
          */}
          <div className="border-t border-line pt-5">
            <p className="eyebrow text-ink-mute">
              {dict.footer.endorsement.heading}
            </p>

            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-4">
              {ENDORSEMENTS.map((body) => (
                <li key={body.id}>
                  <Image
                    src={body.logo}
                    alt={dict.footer.endorsement.logos[body.id]}
                    width={body.width}
                    height={body.height}
                    /*
                      بلا هذا السطر يقرأ Next العرض المصرَّح (٧٣٨px للوزارة)
                      ويطلب الملف بحجمه الكامل، والشعار لا يُرسم إلا في نحو
                      ١٢٠px. التلميح يقصره على أقرب مقاس مولَّد.
                    */
                    sizes="(min-width: 768px) 9rem, 8rem"
                    className={`${ENDORSEMENT_HEIGHT[body.id]} w-auto object-contain`}
                  />
                </li>
              ))}
            </ul>

            <p className="mt-4 flex items-center gap-1.5 text-[11px] leading-snug text-ink-mute">
              <BadgeCheck className="size-3.5 shrink-0 text-pine" />
              {dict.footer.endorsement.caption}
            </p>
          </div>
        </div>
      </div>

      <div className="shell relative flex flex-col items-center justify-between gap-3 border-t border-line py-6 md:flex-row">
        <p className="plate-mark text-[11px] text-ink-mute">
          {dict.footer.copyright}
        </p>
        <p className="text-xs text-ink-mute">{dict.footer.rights}</p>
      </div>
    </footer>
  )
}
