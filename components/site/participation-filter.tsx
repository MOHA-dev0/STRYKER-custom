"use client"

import * as React from "react"
import { Globe2, LayoutGrid, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { PARTICIPATION_SCOPES, type ParticipationScope } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"

const SCOPE_ICONS = {
  all: LayoutGrid,
  local: MapPin,
  international: Globe2,
} as const

/**
 * مرشّح مكان الفعالية — «الكل / داخل السعودية / خارج السعودية».
 *
 * الحالة هنا وحدها، والبطاقات تُصيَّر على الخادم وتصل كأبناء: كل المشاركات
 * موجودة في الـ HTML منذ أول رسم (فيقرؤها الزاحف)، والتصفية تخفي ما لا يطابق
 * النطاق بـ `hidden` بدل أن تفصله من الشجرة.
 *
 * لماذا أزرار لا `Tabs`؟ لأن بدائية التبويبات تفصل المحتوى غير النشط من
 * الـ DOM، وهو ما يضيّع نصف السجل على محركات البحث — وهذا القسم كله محتوى
 * يراد فهرسته.
 */
export function ParticipationFilter({
  counts,
  children,
}: {
  /** عدد المشاركات في كل نطاق — يُحسب على الخادم مرة واحدة. */
  counts: Record<ParticipationScope, number>
  /** البطاقات المصيَّرة على الخادم، كلٌّ ملفوفة بـ `ParticipationSlot`. */
  children: React.ReactNode
}) {
  const { dict } = useI18n()
  const copy = dict.participations.filters
  const [scope, setScope] = React.useState<ParticipationScope>("all")

  return (
    <>
      <div
        role="group"
        aria-label={copy.label}
        className="mt-10 flex flex-wrap items-center gap-1.5 rounded-2xl border border-line bg-paper/85 p-1.5 sm:inline-flex sm:rounded-full sm:bg-paper/70 sm:backdrop-blur"
      >
        {PARTICIPATION_SCOPES.map((id) => {
          const Icon = SCOPE_ICONS[id]
          const active = scope === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setScope(id)}
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 sm:flex-none sm:px-5 sm:text-sm",
                "hover:text-ink focus-visible:ring-2 focus-visible:ring-pine/40 focus-visible:outline-none",
                active
                  ? "bg-pine text-paper shadow-lift"
                  : "text-ink-mute"
              )}
            >
              <Icon aria-hidden className="size-4 shrink-0" />
              {copy[id]}
              {/* الأرقام لاتينية في اللغتين، فتبقى بخط اللوحات */}
              <span className="font-plate text-[10px] tracking-[0.2em] opacity-60">
                {String(counts[id]).padStart(2, "0")}
              </span>
            </button>
          )
        })}
      </div>

      {/*
        النطاق ينزل إلى كل بطاقة عبر السياق: الأب لا يعرف ترتيب أبنائه ولا
        يحتاج أن يعرفه، فتبقى البطاقات مكوّنات خادم كما هي.
      */}
      <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>

      {counts[scope] === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-line bg-paper/60 px-5 py-8 text-center text-sm text-ink-mute">
          {dict.participations.empty}
        </p>
      )}
    </>
  )
}

const ScopeContext = React.createContext<ParticipationScope>("all")

/**
 * غلاف بطاقة واحدة — يقرأ النطاق النشط ويخفي نفسه إن لم يطابقه.
 *
 * `hidden` لا `display: none` بصنف: السمة تُخرج العنصر من شجرة الوصول ومن
 * ترتيب التنقل بلوحة المفاتيح كذلك، فلا يبقى رابط مخفي قابلاً للتركيز.
 */
export function ParticipationSlot({
  scope,
  children,
}: {
  scope: Exclude<ParticipationScope, "all">
  children: React.ReactNode
}) {
  const active = React.useContext(ScopeContext)
  return <div hidden={active !== "all" && active !== scope}>{children}</div>
}
