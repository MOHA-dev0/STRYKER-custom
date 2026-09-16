import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { IBM_Plex_Sans_Arabic, Barlow_Condensed } from "next/font/google"

import "./globals.css"
import { SITE } from "@/lib/data"
import { dirOf, isLocale, localeHref, DEFAULT_LOCALE } from "@/lib/i18n/config"
import { loadDictionary } from "@/lib/i18n/dictionaries"
import { Button } from "@/components/ui/button"
import { Emblem } from "@/components/site/emblem"

/**
 * صفحة 404 العامة.
 *
 * الـ root layout يقع تحت `[lang]`، وهي الحالة التي يوصي فيها Next
 * باستخدام `global-not-found`. هذه الصفحة تتخطى التخطيط تماماً، لذا تستورد
 * الأنماط والخطوط بنفسها وتُعيد مستند HTML كاملاً.
 */

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
})

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-barlow",
  display: "swap",
})

export const metadata: Metadata = {
  title: "404",
  /*
    الصفحة تتخطى التخطيط الجذر، فلا ترث `metadataBase` منه ولا سياسة الفهرسة:
    لولا هذين السطرين لحُلّت صورة المشاركة على `localhost` — ولَفهرس الزاحف
    صفحة خطأ.
  */
  metadataBase: new URL(SITE.url),
  robots: { index: false, follow: true },
}

export default async function GlobalNotFound() {
  // الـ proxy يمرّر اللغة عبر ترويسة، فالـ root params غير متاحة هنا.
  const headerLocale = (await headers()).get("x-stryker-locale")
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE
  const dict = await loadDictionary(locale)
  const copy = dict.notFound

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${plex.variable} ${barlow.variable}`}
    >
      <body className="relative min-h-dvh antialiased">
        <section className="relative flex min-h-dvh items-center overflow-hidden bg-sand-soft">
          <div className="blueprint pointer-events-none absolute inset-0 opacity-70" />
          <div className="grain pointer-events-none absolute inset-0" />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-plate text-[34vw] leading-none font-black text-ink/4 select-none"
          >
            404
          </span>

          <div className="shell relative flex flex-col items-center gap-6 py-24 text-center">
            <Emblem className="h-14" />

            <div className="flex items-center gap-3">
              <span className="rule-accent h-px w-10" />
              <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
              <span className="rule-accent h-px w-10" />
            </div>

            <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {copy.title}
            </h1>
            <p className="max-w-md text-sm leading-loose text-ink-soft">{copy.body}</p>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild variant="pine" size="lg">
                <Link href={localeHref(locale, "/")}>{copy.home}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={localeHref(locale, "/contact")}>{copy.contact}</Link>
              </Button>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
