import type { MetadataRoute } from "next"

import { SITE } from "@/lib/data"
import { LOCALES, localeHref } from "@/lib/i18n/config"
import { INDEXABLE_PATHS } from "@/lib/seo"

/**
 * خريطة الموقع — كل مسار في كل لغة، مع روابط `hreflang` البديلة.
 *
 * تُبنى من `INDEXABLE_PATHS` لا من قائمة يدوية، فأي مسار جديد يدخل الخريطة
 * والوسوم البديلة معاً. لا وسم `x-default` هنا: الخريطة تحمل البدائل فقط،
 * و`x-default` يُعلن في `alternates` داخل كل صفحة.
 */
const PRIORITY: Record<(typeof INDEXABLE_PATHS)[number], number> = {
  "/": 1,
  "/submissions": 0.9,
  "/about": 0.8,
  "/contact": 0.7,
}

const CHANGE_FREQUENCY: Record<
  (typeof INDEXABLE_PATHS)[number],
  MetadataRoute.Sitemap[number]["changeFrequency"]
> = {
  "/": "weekly",
  "/submissions": "weekly",
  "/about": "monthly",
  "/contact": "yearly",
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return INDEXABLE_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: new URL(localeHref(locale, path), SITE.url).toString(),
      lastModified,
      changeFrequency: CHANGE_FREQUENCY[path],
      priority: PRIORITY[path],
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [
            l,
            new URL(localeHref(l, path), SITE.url).toString(),
          ])
        ),
      },
    }))
  )
}
