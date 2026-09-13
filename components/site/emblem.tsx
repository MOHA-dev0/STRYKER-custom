import Image from "next/image"

import { SITE } from "@/lib/data"
import { cn } from "@/lib/utils"

/** نسبة أبعاد ملف الشعار الأصلي (493×507). */
const RATIO = 507 / 493

/**
 * شعار STRYKER الأصلي.
 * يُمرَّر الحجم عبر `className` (مثل `h-10`) والعرض يتبع النسبة تلقائياً.
 */
export function Emblem({
  className,
  size = 96,
  preload = false,
}: {
  className?: string
  size?: number
  /** يحقن وسم `<link rel="preload">` — للشعار الظاهر فوق الطية فقط. */
  preload?: boolean
}) {
  return (
    <Image
      src="/logo.png"
      alt={SITE.name}
      width={size}
      height={Math.round(size * RATIO)}
      preload={preload}
      className={cn("h-10 w-auto object-contain select-none", className)}
    />
  )
}

/**
 * الشعار كعلامة مائية خلفية — بلا لون حتى لا ينافس ألوان القسم،
 * ومخفي عن القارئات الشاشية لأنه زخرفة بحتة.
 */
export function EmblemWatermark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute", className)}>
      <Image
        src="/logo.png"
        alt=""
        width={520}
        height={535}
        className="h-full w-auto object-contain opacity-[0.05] saturate-[0.35]"
      />
    </span>
  )
}

/** قفل الهوية: الشعار + الاسم بخط اللوحات. */
export function EmblemLockup({
  className,
  emblemClassName,
  tone = "ink",
}: {
  className?: string
  emblemClassName?: string
  tone?: "ink" | "paper"
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Emblem className={cn("h-11", emblemClassName)} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-plate text-[15px] font-black tracking-[0.24em]",
            tone === "paper" ? "text-paper" : "text-ink"
          )}
        >
          STRYKER
        </span>
        <span
          className={cn(
            "mt-1 font-plate text-[9px] font-bold tracking-[0.3em]",
            tone === "paper" ? "text-paper/70" : "text-pine"
          )}
        >
          CUSTOM BIKE SHOW
        </span>
      </span>
    </span>
  )
}
