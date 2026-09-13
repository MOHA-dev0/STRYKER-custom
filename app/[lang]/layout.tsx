import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans_Arabic, Barlow_Condensed } from "next/font/google"

import "../globals.css"
import { BrandBackdrop } from "@/components/site/brand-backdrop"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { SITE } from "@/lib/data"
import { dirOf, LOCALES, OG_LOCALE } from "@/lib/i18n/config"
import { getLocaleOrDefault, loadDictionary } from "@/lib/i18n/dictionaries"
import { I18nProvider } from "@/lib/i18n/context"

/**
 * الخط الأساسي — IBM Plex Sans Arabic.
 *
 * وجه واحد يحمل المتن والعناوين في اللغتين: عربيته تحريرية هادئة بفواصل
 * واسعة، ولاتينيته من نفس العائلة، فلا انكسار بصري عند تبديل اللغة.
 */
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
})

/** الخط اللاتيني المضغوط — لوحات الأرقام والعناوين الإنجليزية. */
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
})

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleOrDefault()
  const dict = await loadDictionary(locale)

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} — ${dict.meta.home.title}`,
      template: `%s | ${SITE.short}`,
    },
    description: dict.meta.home.description,
    keywords: [...dict.meta.home.keywords],
    icons: {
      icon: [{ url: "/logo.png", type: "image/png" }],
      apple: [{ url: "/logo.png" }],
    },
    openGraph: {
      title: SITE.name,
      description: dict.meta.home.description,
      images: [{ url: "/logo.png", width: 493, height: 507, alt: SITE.name }],
      locale: OG_LOCALE[locale],
      type: "website",
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[lang]">) {
  const locale = await getLocaleOrDefault()
  const dict = await loadDictionary(locale)

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${plex.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      {/*
        ترتيب الطبقات للمستند كله، وهو المرجع الوحيد لأي z-index في الموقع:
          z-0  — الخلفية الدائمة (العلامة المائية والغسيل).
          z-10 — كل المحتوى؛ وداخله الهيدر العائم على z-50.
          z-50 — بوابات Radix، وهي أشقّاء للغلاف فتعلو عليه كله.
        `isolate` على body يضمن أن هذا الترتيب لا يتسرّب لسياق أعلى.
      */}
      <body className="relative isolate min-h-dvh antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <BrandBackdrop />
          <div className="relative z-10 flex min-h-dvh flex-col">
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}
