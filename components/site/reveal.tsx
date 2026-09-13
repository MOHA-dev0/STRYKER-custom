"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * الظهور عند التمرير: شفافية وإزاحة فقط.
 *
 * كانت النسخة السابقة تحرّك `filter: blur()` كذلك؛ وهو تأثير يُجبر المتصفح
 * على إعادة رسم العنصر في كل إطار، فحين تدخل عدة عناصر الإطار معاً — وهو
 * الحال في كل شبكة هنا — يسقط معدّل الإطارات أثناء التمرير. الإزاحة والشفافية
 * تبقيان على مسار التركيب وحده.
 *
 * والنسخة السابقة كانت كذلك تبني هذا كله على Framer Motion: اشتراك JS لكل
 * عنصر، ومحرّك حركة كامل في الحزمة من أجل خاصيّتين يعرف المتصفح كيف يستكملهما
 * وحده. وهذا المكوّن يُركَّب في كل قسم من أقسام الموقع تقريباً — منها أقسام لا
 * تحتاج JS لغير هذا — فكان أثقل ما يدفعه الهاتف في أول تحميل.
 *
 * ما هنا الآن مراقب تقاطع واحد لكل عنصر يقلب صنفاً (`.reveal-in`)، والانتقال
 * نفسه CSS يجري خارج الخيط الرئيسي. النتيجة بصرياً هي هي، وبلا أي اعتماد.
 */

/** المسافة التي يدخلها العنصر في النافذة قبل أن يُعدّ ظاهراً. */
const MARGIN = "-80px"
const GROUP_MARGIN = "-60px"

/**
 * يُرجع مرجعاً وعلَماً يصير `true` مرة واحدة — أول تقاطع مع النافذة.
 *
 * `once` صريح: المراقب يُفصل فور أول ظهور، فلا يبقى في الصفحة مراقبٌ واحد بعد
 * أن تمرّ أقسامها.
 */
function useRevealed<T extends HTMLElement>(margin: string, enabled = true) {
  const ref = React.useRef<T>(null)
  const [revealed, setRevealed] = React.useState(false)

  React.useEffect(() => {
    if (!enabled || revealed) return

    const el = ref.current
    if (!el) return

    // متصفح بلا مراقب تقاطع (أو بيئة بلا DOM حقيقي) يأخذ المحتوى ظاهراً في
    // الإطار التالي بدل أن يعلق مخفيّاً إلى الأبد — الحالة الأساس `opacity: 0`.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setRevealed(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { rootMargin: margin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, margin, revealed])

  return [ref, revealed] as const
}

/** تأخير البدء يُمرَّر كمتغيّر CSS، فالانتقال كله يبقى في ورقة الأنماط. */
function delayStyle(delay: number): React.CSSProperties | undefined {
  if (!delay) return undefined
  return { "--reveal-delay": `${delay}s` } as React.CSSProperties
}

/** الوسوم المسموح بها — أي وسم يقبل `className` و`style` و`ref` بلا فرق. */
type RevealTag = "div" | "section" | "li" | "article"

/** غلاف ظهور عند التمرير — يُستخدم في كل الأقسام للحفاظ على إيقاع واحد. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: RevealTag
}) {
  const [ref, revealed] = useRevealed<HTMLDivElement>(MARGIN)
  /*
   * الوسم مُنتقى من قائمة مغلقة، لكن JSX فوق اتحاد وسوم يطلب خصائص
   * تصلح لها كلها — أي تقاطع أنواع `ref` لا اتحادها، وهو ما لا يقبله أيّ وسم.
   * التثبيت على `div` يحلّ الأنواع وحدها؛ الوسم المُصيَّر فعلاً هو `as` كما هو،
   * والأربعة جميعاً تقبل `className` و`style` و`ref` بلا فرق.
   */
  const Tag = as as "div"

  return (
    <Tag
      ref={ref}
      style={delayStyle(delay)}
      className={cn("reveal", revealed && "reveal-in", className)}
    >
      {children}
    </Tag>
  )
}

/**
 * حالة المجموعة تنزل إلى الأبناء عبر السياق: المراقب واحد على الحاوية لا واحد
 * لكل بطاقة، والتتابع يُحسب من ترتيب الابن فيصل كتأخير CSS.
 */
const GroupContext = React.createContext<{
  revealed: boolean
  delay: number
} | null>(null)

/** حاوية تُرتّب ظهور أبنائها بتتابع. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  const [ref, revealed] = useRevealed<HTMLDivElement>(GROUP_MARGIN)

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        // المزوّد لا يُنشئ عنصراً في الـ DOM، فترتيب الشبكة كما هو.
        <GroupContext.Provider value={{ revealed, delay: i * stagger }}>
          {child}
        </GroupContext.Provider>
      ))}
    </div>
  )
}

/** عنصر داخل RevealGroup — ويعمل وحده كذلك إن رُكّب خارجها. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const group = React.useContext(GroupContext)
  // خارج المجموعة يراقب نفسه؛ داخلها المجموعة تكفيه فلا مراقب ثانٍ.
  const [ref, own] = useRevealed<HTMLDivElement>(GROUP_MARGIN, group === null)
  const revealed = group ? group.revealed : own

  return (
    <div
      ref={group ? undefined : ref}
      style={delayStyle(group?.delay ?? 0)}
      className={cn("reveal", revealed && "reveal-in", className)}
    >
      {children}
    </div>
  )
}
