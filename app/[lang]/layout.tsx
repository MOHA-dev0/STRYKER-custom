import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans_Arabic, Barlow_Condensed } from "next/font/google"

import "../globals.css"
import { BrandBackdrop } from "@/components/site/brand-backdrop"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { SITE } from "@/lib/data"
import { dirOf, localeHref, LOCALES, OG_LOCALE } from "@/lib/i18n/config"
import { getLocaleOrDefault, loadDictionary } from "@/lib/i18n/dictionaries"
import { I18nProvider } from "@/lib/i18n/context"
import { absoluteUrl } from "@/lib/seo"

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
    /*
      كل رابط نسبي بعد هذا السطر يُحلّ على هذا الأصل: بطاقات المشاركة لا تقبل
      المسارات النسبية، وبدونه تصير صور الـ OG روابط مكسورة عند فيسبوك وتويتر.
    */
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} — ${dict.meta.home.title}`,
      template: `%s | ${SITE.short}`,
    },
    description: dict.meta.home.description,
    keywords: [...dict.meta.home.keywords],
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "automotive",
    manifest: "/manifest.webmanifest",
    /*
      لا `icons` هنا: `app/icon.png` و`app/apple-icon.png` و`app/favicon.ico`
      اصطلاحات ملفات، وNext يولّد وسومها بنفسه ببصمة تخزين مؤقت. أي تعريف
      يدوي هنا يلغيها ويعيدنا إلى ملف واحد بلا مقاسات.

      أما بطاقة المشاركة فتُعرَّف يدوياً: اصطلاح `opengraph-image` يحتاج موضعاً
      ثابتاً، وجذر التطبيق هنا مقطع متغيّر (`[lang]`). تُولَّد الصورة من الشعار
      عبر `scripts/gen-icons.js`.
    */
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: `${SITE.name} — ${dict.meta.home.title}`,
      description: dict.meta.home.description,
      url: localeHref(locale, "/"),
      locale: OG_LOCALE[locale],
      /* اللغة الأخرى تُعلن كبديل، فتعرف الشبكات أن النسختين موقع واحد. */
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: `${SITE.name} — ${dict.meta.home.title}`,
        },
      ],
    },
    /* لا `images` هنا: تويتر يرث صورة الـ OG حين لا تُحدَّد له صورة خاصة. */
    twitter: {
      card: "summary_large_image",
      title: `${SITE.name} — ${dict.meta.home.title}`,
      description: dict.meta.home.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        /* بلا سقف على المقتطف ولا على معاينة الصورة: المحتوى كله للعرض. */
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    /* أرقام السنوات ولوحات المعارض ليست هواتف — بلا هذا تحوّلها سفاري روابط. */
    formatDetection: { telephone: false, address: false, email: false },
    appleWebApp: {
      capable: true,
      title: SITE.short,
      statusBarStyle: "default",
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  /* الموقع ورقي فاتح فقط؛ إعلانها يمنع المتصفح من قلب ألوان النماذج ليلاً. */
  colorScheme: "light",
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      {/*
        ترتيب الطبقات للمستند كله، وهو المرجع الوحيد لأي z-index في الموقع:
          z-0  — الخلفية الدائمة (العلامة المائية والغسيل).
          z-10 — كل المحتوى؛ وداخله الهيدر العائم على z-50.
          z-50 — بوابات Radix، وهي أشقّاء للغلاف فتعلو عليه كله.
        `isolate` على body يضمن أن هذا الترتيب لا يتسرّب لسياق أعلى.
      */}
      {/*
        إضافات المتصفح (Grammarly وColorZilla وغيرها) تحقن سمات على <body>
        قبل أن يرطّب React الشجرة، فتظهر كاختلاف ترطيب لا علاقة له بشيفرتنا.
        `suppressHydrationWarning` يسري على مستوى واحد فقط، فلا يكفي وجوده
        على <html>؛ لذا يلزم هنا أيضًا.
      */}
      <body
        className="relative isolate min-h-dvh antialiased"
        suppressHydrationWarning
      >
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
