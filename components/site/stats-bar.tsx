"use client"

import * as React from "react"
import { animate, motion, useInView } from "framer-motion"

import { ACHIEVEMENTS } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

function Counter({ value, display }: { value: number; display: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [shown, setShown] = React.useState(value === 0 ? display : "0")
  // Store display in a ref so the useEffect dep array never changes size.
  const displayRef = React.useRef(display)
  React.useEffect(() => { displayRef.current = display }, [display])

  React.useEffect(() => {
    if (!inView || value === 0) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      // نحافظ على تصفير البادئة (05 / 07) كما في هوية لوحة النتائج.
      onUpdate: (v) =>
        setShown(String(Math.round(v)).padStart(displayRef.current.length, "0")),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  )
}

/**
 * شريط المراكز — لوحة نتائج فاتحة بخطوط شعرية فاصلة،
 * الأرقام هي البطل والحبر الصنوبري يحمل التمييز.
 */
export function StatsBar() {
  const { dict } = useI18n()

  return (
    <section className="relative border-y border-line bg-sand-soft/75">
      <div className="hatch pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="shell relative grid grid-cols-2 md:grid-cols-4">
        {ACHIEVEMENTS.map((stat, i) => {
          const copy = dict.stats[stat.id]
          const empty = stat.value === 0
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "group relative flex flex-col items-center gap-2 px-4 py-10 text-center md:py-14",
                // الفواصل منطقية حتى تنعكس مع اتجاه اللغة تلقائياً.
                i < 2 && "border-b border-line md:border-b-0",
                i % 2 === 1 && "border-s border-line",
                i === 2 && "md:border-s md:border-line"
              )}
            >
              <span className="eyebrow text-ink-mute">{copy.note}</span>

              <span
                className={cn(
                  "font-plate text-[clamp(3rem,7vw,5.25rem)] leading-none font-black transition-colors duration-500",
                  empty ? "text-ink/20" : "text-pine-deep"
                )}
              >
                <Counter value={stat.value} display={stat.display} />
              </span>

              <span className="flex items-center gap-2 text-sm font-bold text-ink-soft">
                {!empty && (
                  <span className="inline-block size-1.5 rotate-45 bg-ember transition-transform duration-500 group-hover:rotate-[135deg]" />
                )}
                {copy.label}
              </span>

              {/* خط صنوبري يزحف من حافة القراءة عند المرور */}
              <span className="origin-start absolute inset-x-6 bottom-5 h-px scale-x-0 bg-pine transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
