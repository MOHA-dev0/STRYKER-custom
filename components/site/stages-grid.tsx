"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/site/section-heading"

export function StagesGrid() {
  const { dict } = useI18n()
  const copy = dict.about.stages
  const [active, setActive] = React.useState<number | null>(null)

  return (
    <section id="stages" className="shell py-24 md:py-32">
      <SectionHeading
        index="02"
        eyebrow={copy.eyebrow}
        title={
          <>
            {copy.titleLead}
            <span className="accent-word">{copy.titleAccent}</span>
          </>
        }
        lead={copy.lead}
      />

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {copy.items.map((stage, i) => {
          const n = i + 1
          return (
            <motion.button
              key={stage.code}
              type="button"
              onMouseEnter={() => setActive(n)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n)}
              onBlur={() => setActive(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: (i % 4) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group relative flex min-h-44 flex-col items-start gap-2 overflow-hidden rounded-xl border border-line bg-paper p-6 text-start transition-all duration-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pine/50",
                active === n ? "border-pine bg-pine" : "hover:-translate-y-1 hover:border-pine hover:bg-pine hover:shadow-lift"
              )}
            >
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-30" />

              <div className="relative flex w-full items-start justify-between">
                <span
                  className={cn(
                    "font-plate text-5xl leading-none font-black transition-colors duration-400",
                    active === n
                      ? "text-paper/90"
                      : "text-ink/10 group-hover:text-paper/90"
                  )}
                >
                  {String(n).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "eyebrow pt-2 transition-colors duration-400",
                    active === n ? "text-paper/70" : "text-ink-mute"
                  )}
                >
                  {stage.code}
                </span>
              </div>

              <h3
                className={cn(
                  "relative mt-3 font-display text-lg font-bold transition-colors duration-400",
                  active === n ? "text-paper" : "text-ink group-hover:text-paper"
                )}
              >
                {stage.title}
              </h3>

              <p
                className={cn(
                  "relative text-sm leading-relaxed transition-colors duration-400",
                  active === n ? "text-paper/70" : "text-ink-soft group-hover:text-paper/70"
                )}
              >
                {stage.desc}
              </p>

              {/* شريط قرمزي سفلي */}
              <span className="origin-start absolute inset-x-0 bottom-0 h-[3px] scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100" />
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
