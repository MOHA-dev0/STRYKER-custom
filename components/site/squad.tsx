"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { SQUAD } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/site/section-heading"

export function Squad() {
  const { dict } = useI18n()
  const copy = dict.squad
  const [tab, setTab] = React.useState<(typeof SQUAD)[number]>(SQUAD[0])

  return (
    <section id="squad" className="shell py-24 md:py-32">
      <SectionHeading
        index="05"
        eyebrow={copy.eyebrow}
        title={
          <>
            {copy.titleLead}
            <span className="accent-word">{copy.titleAccent}</span>
          </>
        }
        lead={copy.lead}
      />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as typeof tab)}
        className="mt-10"
      >
        <TabsList className="grid w-full grid-cols-2 gap-1.5 rounded-2xl sm:inline-flex sm:w-auto sm:gap-1 sm:rounded-full">
          {SQUAD.map((id) => (
            <TabsTrigger
              key={id}
              value={id}
              className="justify-between rounded-xl px-3.5 text-[13px] sm:justify-center sm:rounded-full sm:px-5 sm:text-sm"
            >
              {copy.categories[id].label}
              <span className="font-plate text-[10px] tracking-[0.2em] opacity-50">
                {String(copy.categories[id].members.length).padStart(2, "0")}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <p className="mt-6 text-sm leading-loose text-ink-soft">
          {copy.categories[tab].blurb}
        </p>

        {SQUAD.map((id) => (
          <TabsContent key={id} value={id} className="mt-6">
            <AnimatePresence mode="wait">
              {tab === id && (
                <motion.ul
                  key={id}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {copy.categories[id].members.map((m, i) => (
                    <SquadCard
                      key={m.name}
                      index={i}
                      categoryLabel={copy.categories[id].label}
                      soon={copy.soon}
                      soonHint={copy.soonHint}
                    />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

function SquadCard({
  index,
  categoryLabel,
  soon,
  soonHint,
}: {
  index: number
  categoryLabel: string
  soon: string
  soonHint: string
}) {
  const [showSoon, setShowSoon] = React.useState(false)

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="brackets group relative overflow-hidden rounded-xl border border-line bg-paper p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/30 hover:shadow-lift cursor-pointer select-none"
      onClick={() => setShowSoon(true)}
    >
      <div className="hatch absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30" />

      <AnimatePresence>
        {showSoon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-paper/95 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowSoon(false)
            }}
          >
            <span className="plate-title text-3xl font-black text-pine">
              {soon}
            </span>
            <span className="text-xs text-ink-soft">{soonHint}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-plate text-4xl leading-none font-black text-ink/8 transition-colors duration-500 group-hover:text-ember/15">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className="mt-3 h-px w-8 bg-line transition-all duration-500 group-hover:w-14 group-hover:bg-pine/50"
        />
      </div>

      <div className="relative mt-6 space-y-2">
        <div className="h-4 w-2/3 rounded bg-ink/6" />
        <div className="h-3 w-1/2 rounded bg-ink/4" />
      </div>

      <div className="relative mt-5">
        <Badge variant="pine">{categoryLabel}</Badge>
      </div>
    </motion.li>
  )
}
