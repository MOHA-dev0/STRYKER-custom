"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Languages } from "lucide-react"

import { cn } from "@/lib/utils"
import { swapLocale, type Locale } from "@/lib/i18n/config"
import { useI18n } from "@/lib/i18n/context"

const LOCALE_COOKIE = "STRYKER_LOCALE"

/**
 * مبدّل اللغة — يبدّل مقطع اللغة في المسار الحالي ويحفظ الاختيار في كوكي
 * ليحترمه الـ proxy عند فتح رابط بلا بادئة لغة لاحقاً.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const pathname = usePathname()
  const { locale, dict } = useI18n()

  const next: Locale = locale === "ar" ? "en" : "ar"
  const href = swapLocale(pathname, next)

  function remember() {
    // max-age = سنة كاملة
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <Link
      href={href}
      hrefLang={next}
      lang={next}
      onClick={remember}
      aria-label={dict.nav.languageLabel}
      title={dict.nav.languageLabel}
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2",
        "font-plate text-[11px] font-black tracking-[0.22em] text-ink-soft uppercase",
        "transition-all duration-300 hover:border-pine/30 hover:bg-ember/5 hover:text-ember-deep",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40",
        className
      )}
    >
      <Languages className="size-4 shrink-0 text-pine-deep transition-colors duration-300 group-hover:text-ember-deep" />
      <span className={next === "ar" ? "font-sans font-bold tracking-normal" : undefined}>
        {dict.nav.otherLanguage}
      </span>
    </Link>
  )
}
