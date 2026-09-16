import type { MetadataRoute } from "next"

import { SITE } from "@/lib/data"
import { DEFAULT_LOCALE, dirOf } from "@/lib/i18n/config"
import { ar } from "@/lib/i18n/dictionaries/ar"

/**
 * بيان التطبيق.
 *
 * يقع خارج شجرة `[lang]`، فلا وصول له إلى `next/root-params`؛ ولذلك يُكتب
 * باللغة المصدر (العربية) ويُبدأ من `/ar`. المتصفح يقرؤه مرة واحدة عند
 * التثبيت، وتبديل اللغة داخل الموقع يبقى على حاله.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.short,
    description: ar.meta.home.description,
    lang: DEFAULT_LOCALE,
    dir: dirOf(DEFAULT_LOCALE),
    start_url: `/${DEFAULT_LOCALE}`,
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f5f0",
    theme_color: "#17614a",
    categories: ["lifestyle", "sports", "events"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
