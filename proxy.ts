import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config"

const LOCALE_COOKIE = "STRYKER_LOCALE"

/** يقرأه `app/global-not-found.tsx`، فهو يُصيَّر خارج شجرة `[lang]`. */
export const LOCALE_HEADER = "x-stryker-locale"

/**
 * Picks a locale from `Accept-Language` without pulling in a negotiator
 * dependency — with two locales, ranking the q-values ourselves is enough.
 */
function localeFromHeader(header: string | null): Locale | null {
  if (!header) return null

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const q = params.find((p) => p.trim().startsWith("q="))
      return {
        tag: tag.trim().toLowerCase(),
        q: q ? Number.parseFloat(q.trim().slice(2)) || 0 : 1,
      }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    // Match the primary subtag so `en-GB` and `ar-SA` both resolve.
    const base = tag.split("-")[0]
    const hit = LOCALES.find((locale) => locale === base)
    if (hit) return hit
  }

  return null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const current = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (current) {
    // Carry the locale forward so the global 404 can pick the right language.
    const headers = new Headers(request.headers)
    headers.set(LOCALE_HEADER, current)
    return NextResponse.next({ request: { headers } })
  }

  // A previously chosen language wins over the browser header.
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  const preferred = (LOCALES as readonly string[]).includes(cookie ?? "")
    ? (cookie as Locale)
    : (localeFromHeader(request.headers.get("accept-language")) ?? DEFAULT_LOCALE)

  const url = request.nextUrl.clone()
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Skip Next internals, the API surface, and anything with a file extension
  // (public/ assets) so redirects never swallow CSS, JS or images.
  matcher: ["/((?!_next|api|.*\\.).*)"],
}
