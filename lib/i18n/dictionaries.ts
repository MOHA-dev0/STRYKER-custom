import { lang } from "next/root-params"
import { notFound } from "next/navigation"

import { DEFAULT_LOCALE, isLocale, type Locale } from "./config"
import type { Dictionary } from "./dictionaries/ar"

const loaders = {
  ar: () => import("./dictionaries/ar").then((m) => m.ar),
  en: () => import("./dictionaries/en").then((m) => m.en),
} satisfies Record<Locale, () => Promise<Dictionary>>

/** Loads a dictionary for an explicit locale — used by the root layout provider. */
export function loadDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]()
}

/**
 * Resolves the active locale from the `[lang]` root param and loads its
 * dictionary. Server Components only — `next/root-params` is unavailable in
 * Client Components, Server Actions and Route Handlers.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang()
  if (!isLocale(value)) notFound()
  return value
}

/**
 * Like {@link getLocale} but falls back to the default locale instead of
 * 404-ing. Used by the root layout and `not-found`, where triggering
 * `notFound()` again would recurse.
 */
export async function getLocaleOrDefault(): Promise<Locale> {
  const value = await lang()
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export async function getDictionary(): Promise<Dictionary> {
  return loadDictionary(await getLocale())
}

export type { Dictionary }
