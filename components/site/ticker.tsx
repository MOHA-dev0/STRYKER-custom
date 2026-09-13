import { cn } from "@/lib/utils"

/**
 * شريط نصي متحرك — يعمل بـ CSS فقط عبر مضاعفة المحتوى وتحريكه 50%.
 *
 * `dir="ltr"` على الغلاف مقصود ولا علاقة له بلغة النص: الحركة نفسها
 * (`translateX(-50%)` مع `pl-8`) محسوبة في اتجاه واحد، والشريط زخرفي
 * (`aria-hidden`). أما العناصر فتأخذ `.plate-mark` فتُقرأ عربيةً كما يجب.
 */
export function Ticker({
  items,
  className,
  reverse = false,
}: {
  items: readonly string[]
  className?: string
  reverse?: boolean
}) {
  const row = [...items, ...items, ...items, ...items]

  return (
    <div
      dir="ltr"
      aria-hidden
      className={cn("relative flex overflow-hidden py-3", className)}
    >
      <div
        className="flex shrink-0 animate-[ticker_38s_linear_infinite] items-center gap-8 pl-8"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="plate-mark flex shrink-0 items-center gap-8 text-sm font-bold whitespace-nowrap"
          >
            {item}
            <span className="inline-block size-1.5 rotate-45 bg-current opacity-60" />
          </span>
        ))}
      </div>
      <div
        className="flex shrink-0 animate-[ticker_38s_linear_infinite] items-center gap-8 pl-8"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((item, i) => (
          <span
            key={`dup-${item}-${i}`}
            className="plate-mark flex shrink-0 items-center gap-8 text-sm font-bold whitespace-nowrap"
          >
            {item}
            <span className="inline-block size-1.5 rotate-45 bg-current opacity-60" />
          </span>
        ))}
      </div>
    </div>
  )
}
