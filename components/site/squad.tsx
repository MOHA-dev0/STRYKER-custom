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
        index="04"
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
        {/*
          على الهاتف شبكة 2×2 لا سطر واحد: التسميات عربية بطول متفاوت
          («لجنة التحكيم» ضعف «الرعاة»)، فسطرٌ واحد إمّا يفيض خارج الشاشة
          فيختفي تبويبان لا يعرف القارئ بوجودهما، وإمّا يلتفّ داخل حبّة
          `rounded-full` فيخرج الشكل المكسور. الشبكة تُظهر الأربعة معاً بعرض
          واحد، والعدّاد يذهب إلى الطرف المقابل للتسمية بدل أن يزاحمها.
          من `sm` فصاعداً تعود الحبّة كما هي.
        */}
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
                    <motion.li
                      key={m.name}
                      variants={{
                        hidden: { opacity: 0, y: 22 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="brackets group relative overflow-hidden rounded-xl border border-line bg-paper p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-pine/30 hover:shadow-lift"
                    >
                      <div className="hatch absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30" />

                      <div className="relative flex items-start justify-between gap-4">
                        <span className="font-plate text-4xl leading-none font-black text-ink/8 transition-colors duration-500 group-hover:text-ember/15">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {/*
                          كان هنا رمز تعبيري لكل فئة. أُزيل: أربعة رموز ملوّنة
                          فوق بطاقات ورقية هادئة هي أكثر ما يشي بقالب جاهز، ولا
                          تنتمي إلى مفردات الموقع (اللوحات، الخطوط الشعرية،
                          الأرقام). الخط الشعري الذي يمتدّ عند المرور يقول نفس
                          الشيء بلغة القسم نفسه.
                        */}
                        <span
                          aria-hidden
                          className="mt-3 h-px w-8 bg-line transition-all duration-500 group-hover:w-14 group-hover:bg-pine/50"
                        />
                      </div>

                      <h3 className="relative mt-6 font-display text-lg font-bold text-ink">
                        {m.name}
                      </h3>
                      <p className="relative mt-1 text-sm text-ink-soft">{m.role}</p>

                      <div className="relative mt-5">
                        <Badge variant="pine">{copy.categories[id].label}</Badge>
                      </div>
                    </motion.li>
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
