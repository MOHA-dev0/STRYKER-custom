"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { EventMedia } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"

/**
 * معرض وسائط الفعالية.
 *
 * شريط أفقي واحد بتثبيت انزلاقي (`scroll-snap`): التمرير باللمس والسحب
 * والعجلة الأفقية كلها من المتصفح لا من JS، فيبقى الانتقال على خيط التركيب
 * ولا يسقط معدّل الإطارات على الهاتف. JS هنا لا يفعل غير شيئين: يقرأ الشريحة
 * الظاهرة عبر مراقب تقاطع واحد جذره الشريط نفسه، ويمرّر الشريط إلى شريحة
 * بعينها حين يُضغط سهم أو نقطة.
 *
 * كل شريحة تعرض وسيطها بـ `object-contain` فوق نسخة مموّهة منه ممتدّة على
 * الإطار: الصور واردة من أرض الفعاليات بنسب مختلفة — طولية 9:16 وعرضية 4:3 —
 * والاحتواء يعرضها كاملة بنسبتها الأصلية بلا قصّ ولا تمطيط، والخلفية المموّهة
 * تملأ ما يفيض من الإطار بلون الصورة نفسها بدل شريطين فارغين.
 *
 * الوسيط الصوتي: المعرض يفرّع على `kind` ولا يفترض أن كل شريحة صورة، فإضافة
 * مقطع صوتي لاحقاً لا تتجاوز عنصر `audio` جديداً في `media` داخل `lib/data.ts`.
 */
export function EventGallery({
  media,
  captions,
  className,
}: {
  media: readonly EventMedia[]
  /** تعليق لكل وسيط بترتيبه — يُستخدم نصاً بديلاً وتعليقاً مرئياً معاً. */
  captions: readonly string[]
  className?: string
}) {
  const { dict } = useI18n()
  const copy = dict.participations.gallery
  const count = media.length

  const trackRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  /*
   * الشريحة النشطة تُقرأ من المتصفح لا من حساب `scrollLeft`: قيمته تنقلب
   * إشارتها في الاتجاه من اليمين إلى اليسار وتختلف عتبتها بين المحركات، بينما
   * مراقب التقاطع يعطي الشريحة الظاهرة نفسها في الاتجاهين بلا حساب.
   */
  React.useEffect(() => {
    const track = trackRef.current
    if (!track || count < 2 || typeof IntersectionObserver === "undefined") return

    const slides = Array.from(track.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(slides.indexOf(entry.target as HTMLElement))
          }
        }
      },
      { root: track, threshold: 0.6 }
    )

    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [count])

  const goTo = React.useCallback((index: number) => {
    const slide = trackRef.current?.children[index]
    if (!(slide instanceof HTMLElement)) return

    /*
     * `scrollIntoView` لا `scrollTo`: الأول يحسب الاتجاه بنفسه، والثاني يحتاج
     * إزاحة موجبة في ltr وسالبة في rtl. و`block: "nearest"` يمنعه من تمرير
     * الصفحة رأسياً حين تكون البطاقة ظاهرة أصلاً.
     */
    slide.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      inline: "start",
      block: "nearest",
    })
  }, [])

  /** التفاف دائري: من آخر شريحة إلى الأولى وبالعكس. */
  const step = (delta: number) => goTo((active + delta + count) % count)

  return (
    <div
      role="group"
      aria-roledescription={copy.label}
      aria-label={copy.label}
      className={cn(
        "relative isolate overflow-hidden bg-sand-deep",
        className
      )}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        className="flex size-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pine motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {media.map((item, i) => (
          <div
            key={i}
            className="relative size-full shrink-0 snap-start snap-always"
          >
            {/*
              الخلفية: الصورة نفسها مموّهة وممتدّة. `sizes` صغير عمداً — المتصفح
              يجلب أصغر نسخة والتمويه يخفي أي نقص في التفاصيل، فلا تكلّف الحيلة
              أكثر من بضعة كيلوبايتات.
            */}
            <Image
              src={item.kind === "image" ? item.src : item.poster}
              alt=""
              aria-hidden
              fill
              sizes="32px"
              quality={50}
              className="scale-125 object-cover blur-2xl saturate-150"
            />

            {item.kind === "image" ? (
              <Image
                src={item.src}
                alt={captions[i] ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 44vw"
                placeholder="blur"
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center p-6">
                <audio
                  controls
                  preload="none"
                  src={item.src}
                  className="w-full max-w-sm"
                >
                  {copy.audioFallback}
                </audio>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* حجاب سفلي يثبّت التعليق وأدوات التنقل على أي صورة، فاتحة كانت أم داكنة */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent"
      />

      {captions[active] && (
        <p
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 text-start text-[12px] leading-relaxed font-medium text-pretty text-paper/95 sm:px-5 sm:text-[13px]",
            count > 1 && "pb-11"
          )}
        >
          {captions[active]}
        </p>
      )}

      {count > 1 && (
        <>
          {/* الأسهم — قطرها 44px، أصغر هدف لمس موصى به */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={copy.prev}
            className="absolute start-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper/90 text-ink shadow-lift backdrop-blur transition-colors duration-300 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
          >
            <ChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
          </button>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label={copy.next}
            className="absolute end-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper/90 text-ink shadow-lift backdrop-blur transition-colors duration-300 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
          >
            <ChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
          </button>

          {/* العدّاد والنقاط — الأرقام لاتينية في اللغتين فتبقى بخط اللوحات */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3">
            <span className="font-plate text-[11px] font-black tracking-[0.18em] text-paper/75">
              {copy.counter
                .replace("{n}", String(active + 1))
                .replace("{total}", String(count))}
            </span>

            <span className="flex items-center gap-1">
              {media.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={copy.goTo
                    .replace("{n}", String(i + 1))
                    .replace("{total}", String(count))}
                  aria-current={i === active}
                  className="grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full bg-paper transition-all duration-300",
                      i === active ? "w-5" : "w-1.5 opacity-55"
                    )}
                  />
                </button>
              ))}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
