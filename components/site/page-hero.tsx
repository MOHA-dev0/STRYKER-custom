import { Reveal } from "@/components/site/reveal"

export function PageHero({
  index,
  eyebrow,
  mark,
  title,
  lead,
}: {
  index: string
  eyebrow: string
  /** الكلمة المفردة التي تُرسم علامة مائية عملاقة وتتكرر لوحةً تحت المقدمة. */
  mark: string
  title: string
  lead: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-sand-soft/75">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="grain pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-32 -top-24 size-[34rem] rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(23,97,74,0.22) 0%, transparent 68%)",
        }}
      />

      {/* علامة مائية عملاقة — بوجه اللوحات في الإنجليزية وبالوجه التحريري في العربية */}
      <span
        aria-hidden
        className="plate-title pointer-events-none absolute -bottom-6 start-4 text-[18vw] leading-none font-black whitespace-nowrap text-ink/4 select-none"
      >
        {mark}
      </span>

      <div className="shell relative pb-20 pt-32 md:pb-24 md:pt-40">
        <Reveal className="flex items-center gap-3">
          <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
            {index}
          </span>
          <span className="rule-accent h-px w-12" />
          <span className="eyebrow text-pine-deep">{eyebrow}</span>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.15] font-bold text-ink text-balance">
            {title}
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 max-w-2xl text-[15px] leading-loose text-ink-soft">{lead}</p>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="plate-mark mt-8 text-sm font-black text-pine-deep">
            {mark}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
