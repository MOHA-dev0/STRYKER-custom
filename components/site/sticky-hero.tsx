"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ArrowUpRight, MoveDown } from "lucide-react"

import { HERO_STAGES } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import type { Dictionary } from "@/lib/i18n/dictionaries/ar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
 * مشهد الـ Hero — ثلاث مراحل تتعاقب داخل إطار واحد مثبّت.
 *
 * الإطار شفاف: العلامة المائية الذهبية لم تعد تخصّه، بل تسكن الطبقة الخلفية
 * الدائمة (`BrandBackdrop`) المثبّتة بالنافذة في التخطيط. فتمرّ المراحل فوقها،
 * ثم يمرّ ما بعد الـ Hero فوقها كذلك، بلا لحظة تختفي فيها الهوية أو تتبدّل
 * فيها الخلفية فجأة عند حدّ قسم.
 *
 * ترتيب الطبقات داخل الإطار — والإطار `isolate` فلا يتسرّب خارجه:
 *   z-0  صور المرحلتين الثانية والثالثة، مقنّعة فتذوب قبل حافة القراءة.
 *   z-10 الدراجة المقصوصة — بصرية المرحلة الأولى.
 *   z-20 حجاب العاج والنقش: يحرسان تباين النص فوق أي صورة.
 *   z-30 النصوص والأزرار والسكة وتلميح التمرير.
 *
 * القسم بطول ثلاث شاشات والإطار `sticky`، فالتمرير هو ما يقود التعاقب. كل ما
 * يتحرك هو `opacity` و`transform` فقط — لا تخطيط يُعاد حسابه أثناء التمرير.
 *
 * الوحدة `svh` لا `dvh` في طول القسم وطول الإطار معاً. على الهاتف ينطوي شريط
 * المتصفح مع أول دفعة تمرير: مع `dvh` يكبر الإطار في تلك اللحظة، فيتغيّر طول
 * مسار التمرير وتقفز نسبة التقدّم تحت الإصبع. أما `svh` فثابتة لا يحرّكها
 * الشريط، فيبقى الحساب واحداً من أول الطريق إلى آخره. وثمنها شريط ورقي في
 * أسفل الإطار حين ينطوي شريط المتصفح — غير مرئي أصلاً، لأن قناع الصورة يذوب
 * قبله وما تحته هو ورق الطبقة الخلفية نفسه.
 */

const N = HERO_STAGES.length
const FADE = 0.07 // نصف عرض منطقة التلاشي بين مرحلتين

/** حدود ظهور المرحلة رقم i على شريط التقدم [0..1]. */
function rangeFor(i: number) {
  const start = i / N
  const end = (i + 1) / N
  const input: number[] = []
  const output: number[] = []

  if (i === 0) {
    input.push(0, end - FADE, end + FADE)
    output.push(1, 1, 0)
  } else if (i === N - 1) {
    input.push(start - FADE, start + FADE, 1)
    output.push(0, 1, 1)
  } else {
    input.push(start - FADE, start + FADE, end - FADE, end + FADE)
    output.push(0, 1, 1, 0)
  }
  return { input, output }
}

/**
 * هل يقود المشهدَ إصبعٌ لا عجلة فأرة؟
 *
 * تُقرأ بعد التركيب لا أثناء العرض على الخادم، فالقيمة الابتدائية `false`
 * (سطح مكتب) ثم تُصحّح في أول تأثير. ولا تُستعمل إلا في اختيار مصدر التقدّم،
 * فتبدّلها لا يعيد بناء عنصر ولا يعيد تحميل صورة.
 */
function useCoarsePointer() {
  const [coarse, setCoarse] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)")
    const sync = () => setCoarse(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return coarse
}

type StageCopy = Dictionary["hero"]["slides"][keyof Dictionary["hero"]["slides"]]

/** صورة ممتدة لمرحلة من نوع `photo`. */
function StagePhoto({
  progress,
  index,
  copy,
  still,
}: {
  progress: MotionValue<number>
  index: number
  copy: StageCopy
  still: boolean
}) {
  const stage = HERO_STAGES[index]
  const { input, output } = rangeFor(index)
  const opacity = useTransform(progress, input, output)
  const scale = useTransform(
    progress,
    [index / N - 0.15, (index + 1) / N + 0.15],
    [1.14, 1]
  )

  return (
    // `stage-mask` يُذيب الصورة قبل أن تصل حافة القراءة، فلا يجلس العنوان فوق
    // صورة أبداً وتبقى العلامة المائية مرئية من خلال نصف الإطار الورقي.
    <motion.div
      style={still ? { opacity: 0 } : { opacity }}
      className="stage-mask absolute inset-0"
    >
      <motion.div
        style={still ? undefined : { scale }}
        className="gpu absolute inset-0"
      >
        <Image
          src={stage.image}
          alt={copy.alt}
          fill
          sizes="100vw"
          className="object-cover object-center contrast-[1.05] saturate-[0.82]"
        />
      </motion.div>
    </motion.div>
  )
}

/**
 * نسخة المرحلة — كل النسخ متراكبة في خلية شبكة واحدة، فارتفاع الخلية هو ارتفاع
 * أطولها ولا يقفز ما تحتها (الأزرار) عند تبديل المرحلة.
 */
function StageCopyBlock({
  progress,
  index,
  copy,
  still,
}: {
  progress: MotionValue<number>
  index: number
  copy: StageCopy
  still: boolean
}) {
  const { input, output } = rangeFor(index)
  const opacity = useTransform(progress, input, output)
  // الإزاحة مشتقّة من التمرير مباشرة لا من `opacity`: سلسلة قيمتين تعني قيمة
  // وسيطة وإشعاراً إضافياً في كل إطار، بلا أي فرق في الناتج.
  const y = useTransform(
    progress,
    input,
    output.map((o) => (1 - o) * 22)
  )

  return (
    <motion.div
      style={still ? { opacity: index === 0 ? 1 : 0 } : { opacity, y }}
      className={cn(
        "gpu col-start-1 row-start-1 max-w-2xl self-start",
        index === 0 ? "relative" : "pointer-events-none"
      )}
    >
      {/*
        `backdrop-blur` فوق sm فقط: الشارة تسبح فوق طبقات تتحرك طوال بقاء الـ
        Hero على الشاشة، وطمس ما تحتها يعيد رسمه مع كل إطار. على الهاتف يحلّ
        ورقٌ شبه معتم محلّه — نفس القراءة بلا تلك الكلفة.
      */}
      <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/85 py-1.5 pe-3.5 ps-1.5 sm:mb-5 sm:gap-3 sm:bg-paper/70 sm:pe-4 sm:backdrop-blur-sm">
        <span className="grid size-7 place-items-center rounded-full bg-pine font-plate text-[11px] font-black text-paper">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
      </div>

      {/*
        `.plate-title` لا `font-plate`: العنوان يأتي من القاموس، فهو لاتيني في
        الإنجليزية وعربي في العربية — والصنف يبدّل الوجه والتتبّع مع الاتجاه.
        و`.hero-title` يحمل المقاس: على الهاتف يتبع العرض لكن يسقفه الارتفاع،
        فالعنوان الذي يلتفّ ثلاثة أسطر لا يدفع الأزرار خارج الشاشة.
      */}
      <h1 className="plate-title hero-title leading-[0.9] rtl:leading-[1.02] font-black text-ink">
        {copy.title.split(" / ").map((part, i, arr) => (
          <span key={part} className="block">
            <span
              className={
                i === arr.length - 1 && arr.length > 1 ? "text-pine-deep" : ""
              }
            >
              {part}
            </span>
            {i < arr.length - 1 && (
              <span className="mx-2 inline-block h-[0.42em] w-px bg-ember/70 align-middle" />
            )}
          </span>
        ))}
      </h1>

      <p className="hero-drop mt-3 font-display text-lg font-bold text-pine sm:mt-4 sm:text-2xl">
        {copy.tagline}
      </p>
      <p className="hero-drop mt-2 hidden max-w-xl text-[15px] leading-loose text-ink-soft sm:mt-3 sm:block">
        {copy.line}
      </p>
    </motion.div>
  )
}

function RailDot({
  progress,
  index,
  still,
}: {
  progress: MotionValue<number>
  index: number
  still: boolean
}) {
  const { input, output } = rangeFor(index)
  const opacity = useTransform(progress, input, output)
  const scale = useTransform(
    progress,
    input,
    output.map((o) => 0.6 + o * 0.4)
  )

  return (
    <div className="relative grid size-3 place-items-center">
      <span className="absolute size-1.5 rounded-full bg-ink/15" />
      <motion.span
        style={still ? { opacity: index === 0 ? 1 : 0 } : { opacity, scale }}
        className="absolute size-3 rounded-full border border-pine bg-pine-soft"
      />
    </div>
  )
}

export function StickyHero() {
  const { dict, href } = useI18n()
  // مع تفضيل تقليل الحركة يثبت المشهد على مرحلته الأولى بلا أي ربط بالتمرير.
  const still = useReducedMotion() === true
  const coarse = useCoarsePointer()

  const ref = React.useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  /*
   * مصدر التقدّم يختلف باختلاف ما يقود التمرير:
   *
   * عجلة الفأرة تصل على شكل قفزات متقطّعة، فيتوسّط نابضٌ بينها وبين الرسم
   * يحوّلها إلى منحنى متصل، و`restDelta` الصغير يوقفه تماماً عند السكون بدل أن
   * يظلّ يهتزّ حول قيمته.
   *
   * أما الإصبع فيصل متصلاً أصلاً — المتصفح نفسه يتولّى الاندفاع والارتداد — فلا
   * يبقى للنابض ما يُنعّمه، ولا يضيف إلا تأخّراً: المشهد يتخلّف عن الإصبع أثناء
   * السحب ويظلّ يستقرّ بعد رفعه. لذلك يمرّ تقدّم التمرير على الهاتف كما هو.
   */
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const p = coarse ? scrollYProgress : smoothed

  // الدراجة المقصوصة: بصرية المرحلة الأولى — تندفع للأمام ثم تسلّم للصور.
  const bikeRange = rangeFor(0)
  const bikeOpacity = useTransform(p, bikeRange.input, bikeRange.output)
  const bikeScale = useTransform(p, [0, 1 / N + FADE], [0.94, 1.12])
  const bikeY = useTransform(p, [0, 1 / N + FADE], [18, -46])

  /*
   * حجاب العاج يشتدّ مع دخول الصور. المرحلة الأولى خلفيتها ورق فاتح أصلاً فلا
   * تحتاج حجاباً كاملاً — ونصفه يكفي ليذوب طرف الدراجة في الورق بدل أن يُمحى.
   */
  const veilOpacity = useTransform(
    p,
    bikeRange.input,
    bikeRange.output.map((o) => 1 - o * 0.5)
  )

  const hintOpacity = useTransform(p, [0, 0.08], [1, 0])
  const railProgress = useTransform(p, [0, 1], [0, 1])

  return (
    <section ref={ref} className="relative h-[300svh]">
      {/*
        الإطار شفاف عمداً: الطبقة الخلفية الدائمة تُرى من خلاله، فتبقى العلامة
        المائية متصلة من المرحلة الأولى إلى ما بعد نهاية القسم.
      */}
      <div className="sticky top-0 isolate h-svh w-full overflow-hidden">
        {/* z-0 — صورتا المرحلتين الثانية والثالثة */}
        <div className="absolute inset-0 z-0">
          {HERO_STAGES.map((stage, i) =>
            stage.kind === "photo" ? (
              <StagePhoto
                key={stage.id}
                progress={p}
                index={i}
                copy={dict.hero.slides[stage.id]}
                still={still}
              />
            ) : null
          )}
        </div>

        {/* z-10 — الدراجة المقصوصة، محبوسة في النصف البعيد عن النص */}
        <motion.div
          style={
            still
              ? undefined
              : { opacity: bikeOpacity, scale: bikeScale, y: bikeY }
          }
          className="gpu pointer-events-none absolute start-0 end-0 top-[6%] z-10 h-[34%] md:start-auto md:top-0 md:h-full md:w-[54%]"
        >
          <Image
            src={HERO_STAGES[0].image}
            alt={dict.hero.slides.discover.alt}
            fill
            preload
            sizes="(min-width: 768px) 56vw, 100vw"
            className="object-contain object-center"
          />
        </motion.div>

        {/*
          z-20 — حجاب العاج التحريري.
          لا يغطّي الإطار بكثافة واحدة: أقواه في المنطقة التي قد يلتقي فيها النص
          بالصورة، ثم يخفّ نحو الحافة البعيدة (لتبقى الصورة صورة) ونحو حافة
          القراءة (لتبقى العلامة المائية مقروءة تحت النص بدل أن تُطمس).
        */}
        <motion.div
          style={still ? { opacity: 0.5 } : { opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 z-20"
        >
          <div className="absolute inset-0 hidden md:block ltr:bg-[linear-gradient(to_left,rgba(247,245,240,0)_0%,rgba(247,245,240,0.34)_26%,rgba(247,245,240,0.86)_55%,rgba(247,245,240,0.6)_80%,rgba(247,245,240,0.38)_100%)] rtl:bg-[linear-gradient(to_right,rgba(247,245,240,0)_0%,rgba(247,245,240,0.34)_26%,rgba(247,245,240,0.86)_55%,rgba(247,245,240,0.6)_80%,rgba(247,245,240,0.38)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(247,245,240,0.9)_12%,rgba(247,245,240,0.72)_44%,rgba(247,245,240,0.3)_72%,rgba(247,245,240,0)_100%)] md:bg-[linear-gradient(to_top,rgba(247,245,240,0.6),rgba(247,245,240,0)_58%)]" />
        </motion.div>

        {/* النقش الورقي فوق الصور — شبكة النقاط تأتي من الطبقة الخلفية الدائمة */}
        <div className="grain-stage pointer-events-none absolute inset-0 z-20" />

        {/*
          z-30 — النصوص والأزرار. الحشوة والمقاسات في `.hero-frame`: الهاتف
          المستلقي يمرّ من `md:` بعرضه بينما ارتفاعه نصف ارتفاعه واقفاً، وهذا ما
          لا تلتقطه نقطة توقّف بالعرض وحدها.
        */}
        <div className="hero-frame shell relative z-30 flex h-full flex-col justify-end md:justify-center">
          <div className="grid">
            {HERO_STAGES.map((stage, i) => (
              <StageCopyBlock
                key={stage.id}
                progress={p}
                index={i}
                copy={dict.hero.slides[stage.id]}
                still={still}
              />
            ))}
          </div>

          {/*
            سكة التقدّم للهاتف — نظيرة أفقية للسكة الرأسية التي لا مكان لها على
            حافة شاشة ضيّقة. بدونها يخسر الهاتف الإشارة الوحيدة إلى أن تحت
            الإبهام ثلاث مراحل لا مشهداً واحداً، ومعها تلميح التمرير الذي يذهب
            مع أول دفعة.
          */}
          <div className="mt-6 flex max-w-2xl items-center gap-3 md:hidden">
            <div className="relative h-px w-14 bg-ink/15">
              <motion.div
                style={still ? { scaleX: 0 } : { scaleX: railProgress }}
                className="gpu origin-start absolute inset-0 bg-pine"
              />
            </div>
            <div className="flex items-center gap-2">
              {HERO_STAGES.map((stage, i) => (
                <RailDot key={stage.id} progress={p} index={i} still={still} />
              ))}
            </div>
            <motion.span
              style={still ? undefined : { opacity: hintOpacity }}
              className="eyebrow ms-auto inline-flex items-center gap-1.5 text-ink-mute"
            >
              {dict.hero.scrollHint}
              <MoveDown className="size-3.5" />
            </motion.span>
          </div>

          {/* النص الثابت + الأزرار — لا يتبدّلان بين المراحل */}
          <div className="mt-6 max-w-2xl border-t border-line pt-5 md:mt-10 md:pt-6">
            <p className="hero-drop line-clamp-2 max-w-xl text-[13px] leading-loose text-ink-soft md:line-clamp-none md:text-sm">
              {dict.hero.subtitle}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-6">
              <Button asChild variant="pine" size="lg">
                <Link href={href("/submissions")}>
                  {dict.hero.primaryCta}
                  <ArrowUpRight className="size-4 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={href("/about")}>{dict.hero.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* سكة التقدم — على الحافة المقابلة للنص */}
        <div className="pointer-events-none absolute inset-y-0 end-5 z-30 hidden flex-col items-center justify-center gap-4 md:flex lg:end-10">
          <div className="relative h-48 w-px bg-ink/10">
            <motion.div
              style={still ? { scaleY: 0 } : { scaleY: railProgress }}
              className="gpu absolute inset-0 origin-top bg-pine"
            />
          </div>
          <div className="flex flex-col gap-2">
            {HERO_STAGES.map((stage, i) => (
              <RailDot key={stage.id} progress={p} index={i} still={still} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
