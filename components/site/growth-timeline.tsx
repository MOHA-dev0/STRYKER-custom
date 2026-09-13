"use client"

import * as React from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

import { useI18n } from "@/lib/i18n/context"
import { SectionHeading } from "@/components/site/section-heading"

export function GrowthTimeline() {
  const { dict } = useI18n()
  const copy = dict.about.growth
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  })
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })
  const glow = useTransform(spine, [0, 1], [0.2, 1])

  return (
    <section
      id="growth"
      className="relative overflow-hidden border-y border-line bg-sand-soft py-24 md:py-32"
    >
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />

      <div className="shell relative">
        <SectionHeading
          index="03"
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titleLead}
              <span className="accent-word">{copy.titleAccent}</span>
            </>
          }
          lead={copy.lead}
        />

        <div ref={ref} className="relative mt-14">
          {/* العمود الفقري — يقف على حافة البداية ثم في المنتصف على الشاشات الكبيرة */}
          <div className="absolute inset-y-0 start-4 w-px bg-line md:start-1/2">
            <motion.div
              style={{ scaleY: spine, opacity: glow }}
              className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,#0d4535,#2f7d63)]"
            />
          </div>

          <ol className="space-y-10 md:space-y-0">
            {copy.items.map((step, i) => (
              <motion.li
                key={step.code}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative ps-14 md:grid md:grid-cols-2 md:gap-14 md:ps-0"
              >
                {/* النقطة */}
                <span className="absolute start-[9px] top-1.5 z-10 grid size-3.5 place-items-center md:start-1/2 ltr:md:-translate-x-1/2 rtl:md:translate-x-1/2">
                  <span className="size-3.5 rounded-full border-2 border-pine bg-sand-soft" />
                  <span className="absolute size-1.5 rounded-full bg-ember" />
                </span>

                <div
                  className={
                    i % 2 === 0 ? "md:col-start-1 md:pb-12" : "md:col-start-2 md:pb-12"
                  }
                >
                  <div className="brackets group relative rounded-xl border border-line bg-paper p-6 text-start shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/30">
                    <div className="flex items-center justify-between gap-3">
                      <span className="plate-mark text-[11px] font-black text-ember-deep">
                        {copy.stageLabel} {i + 1}
                      </span>
                      <span className="eyebrow text-pine-deep">{step.code}</span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-loose text-ink-soft">{step.body}</p>

                    <span className="mt-5 block font-plate text-5xl leading-none font-black text-ink/6 transition-colors duration-500 group-hover:text-ember/12">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
