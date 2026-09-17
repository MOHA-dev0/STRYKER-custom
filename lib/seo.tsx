/**
 * البيانات المهيكلة (JSON-LD) ومساعدات الروابط المطلقة.
 *
 * محركات البحث تقرأ هذا القسم لا النص وحده: `Organization` تعرّف الجهة
 * وشعارها وحساباتها، و`WebSite` تربط النسختين العربية والإنجليزية بموقع واحد،
 * و`Event` يجعل كل مشاركة في السجل نتيجة قابلة للظهور كبطاقة فعالية،
 * و`FAQPage` يفعل الشيء نفسه لأسئلة صفحة التواصل.
 *
 * كل ما هنا يُصيَّر على الخادم؛ لا شيء منه يصل حزمة المتصفح.
 */

import { PARTICIPATIONS, SITE } from "@/lib/data"
import { localeHref, OG_LOCALE, type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ar"

/** يحوّل مسار تطبيق إلى رابط مطلق — البيانات المهيكلة لا تقبل المسارات النسبية. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString()
}

/**
 * يلفّ حمولة JSON-LD في وسم `<script>`.
 *
 * `<` تُستبدل بمكافئها اليونيكودي: النصوص تأتي من القاموسين، ووسم إغلاق
 * مدسوس داخل أي منها يكسر الوسم ويفتح باب حقن. راجع دليل Next حول JSON-LD.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

/** معرّف ثابت للجهة — تشير إليه بقية العُقد بدل تكرار تعريفها. */
const ORG_ID = absoluteUrl("/#organization")
const SITE_ID = absoluteUrl("/#website")

function organization(dict: Dictionary) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.short,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 493,
      height: 507,
    },
    image: absoluteUrl("/opengraph-image.png"),
    description: dict.meta.home.description,
    email: SITE.email,
    foundingDate: SITE.founded,
    slogan: dict.site.tagline,
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: dict.cities.madinah,
    },
    areaServed: ["SA", "AE", "BH", "KW", "OM", "QA"],
    knowsAbout: [...dict.meta.home.keywords],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      availableLanguage: ["ar", "en"],
    },
    sameAs: SITE.socials.map((s) => s.href),
  }
}

function website(locale: Locale, dict: Dictionary) {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl(localeHref(locale, "/")),
    name: SITE.name,
    description: dict.meta.home.description,
    inLanguage: OG_LOCALE[locale].replace("_", "-"),
    publisher: { "@id": ORG_ID },
  }
}

/**
 * رسم الصفحة الرئيسية: الجهة + الموقع + سجل الفعاليات كقائمة مرتّبة.
 * عقدة واحدة بـ `@graph` أخف على الزاحف من ثلاثة وسوم منفصلة.
 */
export function homeJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(dict),
      website(locale, dict),
      {
        "@type": "ItemList",
        name: dict.meta.submissions.title,
        itemListElement: PARTICIPATIONS.map((event, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: eventNode(locale, dict, event),
        })),
      },
    ],
  }
}

function eventNode(
  locale: Locale,
  dict: Dictionary,
  event: (typeof PARTICIPATIONS)[number]
) {
  const text = dict.participations.events[event.id]
  const cover = event.media.find((item) => item.kind === "image")
  return {
    "@type": "Event",
    name: text.title,
    description: text.description,
    // `date` تاريخ ISO حيث عُرف اليوم، وسنة مجرّدة حيث لم يُعرف — وكلاهما
    // صيغة صحيحة في ISO 8601، فالدقة الناقصة أصدق من يوم مُختلَق.
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    // أول صورة في المعرض هي غلاف الفعالية.
    image: cover && absoluteUrl(cover.src.src),
    // لا صفحة لكل فعالية بعد؛ السجل كله يعيش في صفحة المشاركات.
    url: absoluteUrl(localeHref(locale, "/submissions")),
    location: {
      "@type": "Place",
      name: text.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: event.scope === "local" ? "SA" : undefined,
        addressLocality: text.location,
      },
    },
    organizer: { "@id": ORG_ID },
  }
}

/** صفحة المشاركات: مسار التنقل + كل فعالية في السجل. */
export function submissionsJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb(locale, dict, "/submissions", dict.meta.submissions.title),
      ...PARTICIPATIONS.map((event) => eventNode(locale, dict, event)),
    ],
  }
}

/** صفحة من نحن: مسار التنقل + تعريف الجهة. */
export function aboutJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb(locale, dict, "/about", dict.meta.about.title),
      {
        "@type": "AboutPage",
        name: dict.meta.about.title,
        description: dict.meta.about.description,
        url: absoluteUrl(localeHref(locale, "/about")),
        mainEntity: { "@id": ORG_ID },
      },
      organization(dict),
    ],
  }
}

/** صفحة التواصل: مسار التنقل + الأسئلة الشائعة كبطاقة نتائج. */
export function contactJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb(locale, dict, "/contact", dict.meta.contact.title),
      {
        "@type": "ContactPage",
        name: dict.meta.contact.title,
        description: dict.meta.contact.description,
        url: absoluteUrl(localeHref(locale, "/contact")),
        mainEntity: { "@id": ORG_ID },
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  }
}

function breadcrumb(
  locale: Locale,
  dict: Dictionary,
  path: string,
  name: string
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.nav.links.home,
        item: absoluteUrl(localeHref(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: absoluteUrl(localeHref(locale, path)),
      },
    ],
  }
}

/** كل المسارات القابلة للفهرسة، بكل لغة — مصدر `sitemap.ts` الوحيد. */
export const INDEXABLE_PATHS = ["/", "/about", "/submissions", "/contact"] as const
