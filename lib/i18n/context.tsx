"use client"

import * as React from "react"
import { DirectionProvider } from "@radix-ui/react-direction"

import { dirOf, localeHref, type Locale } from "./config"
import type { Dictionary } from "./dictionaries/ar"

type I18nValue = {
  locale: Locale
  dict: Dictionary
  /** Prefixes an app path with the active locale: `href("/contact")` -> `/en/contact`. */
  href: (path: string) => string
}

const I18nContext = React.createContext<I18nValue | null>(null)

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: Dictionary
  children: React.ReactNode
}) {
  const value = React.useMemo<I18nValue>(
    () => ({ locale, dict, href: (path) => localeHref(locale, path) }),
    [locale, dict]
  )

  /*
   * `DirectionProvider` ليس زينة: كل بدائيات Radix تقرأ اتجاهها من
   * `useDirection()`، وهو يُرجع "ltr" حين لا يجد مزوّداً — ثم تكتب `dir="ltr"`
   * على عناصرها فتُلغي اتجاه <html> المضبوط على rtl. بدونه تنقلب القائمة
   * المنسدلة ويتبدّل اتجاه أسهم لوحة المفاتيح في التبويبات والأكورديون.
   */
  return (
    <I18nContext.Provider value={value}>
      <DirectionProvider dir={dirOf(locale)}>{children}</DirectionProvider>
    </I18nContext.Provider>
  )
}

/** Reads the active locale and dictionary inside a Client Component. */
export function useI18n(): I18nValue {
  const value = React.useContext(I18nContext)
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>")
  }
  return value
}
