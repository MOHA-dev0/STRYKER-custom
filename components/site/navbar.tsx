"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Menu, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { NAV_LINKS, SITE } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Emblem, EmblemLockup } from "@/components/site/emblem"
import { LanguageSwitch } from "@/components/site/language-switch"

/*
 * عتبتا التكثيف — لا عتبة واحدة.
 *
 * بعتبة واحدة، توقّفُ التمرير عند حدّها يجعل الهيدر يتأرجح بين حالتيه مع كل
 * بكسل ارتداد، وهو مصدر «الارتجاف» عند سكون التمرير. المسافة بين العتبتين
 * تبتلع هذا الارتداد: لا يكثّف إلا بعد `ON`، ولا يعود إلا تحت `OFF`.
 */
const CONDENSE_ON = 56
const CONDENSE_OFF = 8

export function Navbar() {
  const pathname = usePathname()
  const { locale, dict, href } = useI18n()
  const [condensed, setCondensed] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { scrollY } = useScroll()

  // مرجع موازٍ للحالة: المستمع يقرأ القيمة الحالية بلا إعادة اشتراك كل إطار.
  const condensedRef = React.useRef(false)

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = condensedRef.current ? y > CONDENSE_OFF : y > CONDENSE_ON
    if (next === condensedRef.current) return
    condensedRef.current = next
    setCondensed(next)
  })

  // القائمة تنزلق من حافة البداية حسب اتجاه اللغة.
  const sheetSide = locale === "ar" ? "right" : "left"

  return (
    /*
     * الهيدر `fixed` لا `sticky`: الـ sticky يظل عنصراً في التدفّق، فالمتصفح
     * يعيد حساب موضعه مع التمرير ويومض عند حدود الأقسام. الـ fixed خارج
     * التدفّق تماماً، و`.nav-float` تمنحه طبقة عرض خاصة بلا رسم خلفي، فيثبت
     * بلا اهتزاز. وارتفاع الحبّة ثابت بين الحالتين — لا شيء يتحرك سوى الألوان،
     * فلا إزاحة تخطيط لحظة التكثيف.
     */
    <header className="nav-float pointer-events-none fixed inset-x-0 top-0 z-50 isolate">
      <div className="shell pt-3 md:pt-4">
        <div
          className={cn(
            "pointer-events-auto flex h-16 items-center justify-between gap-4 rounded-full border px-3 transition-[background-color,border-color,box-shadow] duration-300 md:h-[4.5rem] md:px-4",
            condensed
              ? "border-line/70 bg-sand/80 shadow-[0_18px_50px_-34px_rgba(26,31,29,0.75)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        >
          {/* الهوية */}
          <Link
            href={href("/")}
            aria-label={SITE.name}
            className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-pine/40 focus-visible:ring-offset-4 focus-visible:ring-offset-sand"
          >
            <Emblem
              priority
              size={112}
              className="h-10 transition-transform duration-500 group-hover:-rotate-3 md:h-12"
            />
            <span className="flex flex-col leading-none">
              <span className="font-plate text-[15px] font-black tracking-[0.24em] text-ink">
                STRYKER
              </span>
              <span className="mt-1 font-plate text-[9px] font-bold tracking-[0.3em] text-pine">
                CUSTOM BIKE SHOW
              </span>
            </span>
          </Link>

          {/* روابط سطح المكتب — حبّة زجاجية والمؤشر ينزلق خلف الرابط النشط */}
          <nav className="hidden lg:block" aria-label={dict.nav.primaryLabel}>
            <ul className="flex items-center gap-1 rounded-full border border-line bg-paper/60 p-1.5 backdrop-blur-sm">
              {NAV_LINKS.map((link) => {
                const target = href(link.href)
                const active = pathname === target
                return (
                  <li key={link.href}>
                    <Link
                      href={target}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-5 py-2 text-sm font-bold transition-colors duration-300 outline-none",
                        active
                          ? "text-paper"
                          : "text-ink-soft hover:text-pine-deep focus-visible:text-pine-deep"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-pine shadow-[0_10px_24px_-14px_rgba(23,97,74,0.9)]"
                          transition={{ type: "spring", stiffness: 420, damping: 38 }}
                        />
                      )}
                      <span className="relative z-10">{dict.nav.links[link.id]}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitch className="hidden sm:inline-flex" />

            <Button asChild variant="pine" size="sm" className="hidden md:inline-flex">
              <Link href={href("/contact?subject=sponsorship")}>
                {dict.nav.partnerCta}
                <ArrowUpRight className="size-4 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100" />
              </Link>
            </Button>

            {/* قائمة الجوال */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label={dict.nav.openMenu}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={sheetSide} closeLabel={dict.nav.closeMenu}>
                <SheetHeader className="border-b border-line pb-5">
                  <EmblemLockup className="gap-3" emblemClassName="h-12" />
                  <SheetTitle className="sr-only">STRYKER</SheetTitle>
                  <SheetDescription className="sr-only">
                    {dict.site.tagline}
                  </SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col px-2">
                  {NAV_LINKS.map((link, i) => {
                    const target = href(link.href)
                    const active = pathname === target
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={target}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex items-baseline justify-between border-b border-line/70 px-4 py-4 transition-colors",
                            active
                              ? "text-pine-deep"
                              : "text-ink hover:text-pine-deep"
                          )}
                        >
                          <span className="font-display text-lg font-bold">
                            {dict.nav.links[link.id]}
                          </span>
                          {/* الرقم وحده: التسمية الإنجليزية كانت تظهر بجانب العربية. */}
                          <span className="font-plate text-[10px] tracking-[0.28em] text-ink-mute">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      </SheetClose>
                    )
                  })}
                </nav>

                <div className="mt-auto space-y-4 p-6">
                  <SheetClose asChild>
                    <Button asChild variant="pine" className="w-full">
                      <Link href={href("/contact?subject=sponsorship")}>
                        {dict.nav.partnerCta}
                      </Link>
                    </Button>
                  </SheetClose>
                  <LanguageSwitch className="w-full justify-center sm:hidden" />
                  <p className="plate-mark text-center text-[10px] text-ink-mute">
                    {dict.site.tagline}
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
