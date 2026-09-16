/**
 * إعدادات اللغات — Locale configuration.
 * Shared by the proxy, the server dictionaries loader and the client provider,
 * so it must stay free of any server-only import.
 */

export const LOCALES = ["ar", "en"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "ar"

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/** Writing direction for a locale — drives `dir` on <html> and every `rtl:` variant. */
export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr"
}

/** `ar_SA` / `en_US` for OpenGraph. */
export const OG_LOCALE: Record<Locale, string> = {
  ar: "ar_SA",
  en: "en_US",
}

/**
 * Prefixes an app path with the active locale.
 * `localeHref("en", "/contact?subject=sponsorship")` -> `/en/contact?subject=sponsorship`
 */
export function localeHref(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Swaps the locale segment of a pathname, keeping the rest of the route.
 * `swapLocale("/ar/contact", "en")` -> `/en/contact`
 */
export function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/")
  // segments[0] is always "" for an absolute path, segments[1] is the locale.
  if (isLocale(segments[1])) {
    segments[1] = next
    return segments.join("/") || `/${next}`
  }
  return localeHref(next, pathname)
}

/**
 * Canonical + hreflang alternates for one route, in every locale.
 * Must be set per page: declaring it once on the root layout would make every
 * page canonical to the locale home page.
 *
 * `x-default` points at the source locale. Without it a crawler has no route to
 * send a visitor whose language matches neither entry, and the proxy's own
 * `Accept-Language` redirect never gets a chance to run for them.
 */
export function localeAlternates(locale: Locale, path: string) {
  return {
    canonical: localeHref(locale, path),
    languages: {
      ...(Object.fromEntries(
        LOCALES.map((l) => [l, localeHref(l, path)])
      ) as Record<Locale, string>),
      "x-default": localeHref(DEFAULT_LOCALE, path),
    },
  }
}
