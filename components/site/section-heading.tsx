import { cn } from "@/lib/utils"
import { Reveal } from "@/components/site/reveal"

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "start",
  className,
}: {
  index?: string
  eyebrow: string
  title: React.ReactNode
  lead?: string
  align?: "start" | "center"
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="font-plate text-[11px] font-black tracking-[0.3em] text-ember-deep">
            {index}
          </span>
        )}
        <span className="rule-accent h-px w-10" />
        <span className="eyebrow text-pine-deep">{eyebrow}</span>
      </div>

      <h2 className="font-display text-3xl leading-[1.25] font-bold text-ink text-balance sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>

      {lead && (
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-loose text-ink-soft",
            align === "center" && "mx-auto"
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
