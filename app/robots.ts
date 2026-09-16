import type { MetadataRoute } from "next"

import { SITE } from "@/lib/data"

/**
 * قواعد الزحف.
 *
 * `/_next/` و`/api/` مستثناة: الأولى أصول مبنية لا محتوى، والثانية ليست
 * صفحات. ما عدا ذلك مفتوح — الموقع كله محتوى يراد فهرسته.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
    host: SITE.url,
  }
}
