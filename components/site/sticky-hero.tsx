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
import { ArrowUpRight } from "lucide-react"

import { HERO_STAGES } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import type { Dictionary } from "@/lib/i18n/dictionaries/ar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
 * مشهد الـ Hero — تخطيطان لا تخطيط واحد.
 *
 * (أ) من `md` فصاعداً: ثلاث مراحل تتعاقب داخل إطار واحد مثبّت `sticky`، والقسم
 *     بطول ثلاث شاشات فالتمرير هو ما يقود التعاقب.
 *
 * (ب) دون `md`: لا تثبيت ولا مسار تمرير. الإطار عمود طبيعي `flex-col` بارتفاع
 *     `100dvh` كحدّ أدنى — النص، ثم الدراجة تحته، ثم الأزرار في القاع. وهذا
 *     ليس تفضيلاً جمالياً: تثبيت عنصر داخل أبٍ ذي `overflow-hidden` على
 *     iOS Safari يكسر فيزياء الـ sticky، وشريط المتصفح المنطوي يغيّر طول مسار
 *     التمرير تحت الإصبع فيقفز تقدّم المشهد. فحين يزول التثبيت تزول العلّتان.
 *
 * DOM واحد للحالتين لا اثنان: نسخة ثانية من العناصر تعني عنوان `h1` مكرّراً
 * وصورة تُحمّل مرتين (المتصفح يجلب صور `display:none` غير المؤجّلة). فالفرق
 * كله في الأصناف — والدراجة عنصر `<Image>` واحد يسيل في العمود على الهاتف
 * ويتموضع `absolute` على سطح المكتب.
 *
 * ترتيب الطبقات داخل الإطار — والإطار `isolate` فلا يتسرّب خارجه:
 *   z-0  صور المرحلتين الثانية والثالثة (سطح المكتب وحده، مؤجّلة التحميل).
 *   z-10 الدراجة المقصوصة.
 *   z-20 حجاب العاج والنقش.
 *   z-30 النصوص والأزرار والسكة.
 *
 * الوحدة `svh` في طول القسم وطول الإطار المثبّت معاً: مع `dvh` يكبر الإطار حين
 * ينطوي شريط المتصفح، فيتغيّر طول مسار التمرير وتقفز نسبة التقدّم. أما عمود
 * الهاتف فلا مسار له أصلاً، فيأخذ `dvh` ليملأ الشاشة المرئية فعلاً ويبقى
 * الزرّان فوق شريط المتصفح لا تحته.
 */

const N = HERO_STAGES.length

/*
 * التبديل بين مرحلتين تسليمٌ لا مزج.
 *
 * حين تتداخل نافذتا التلاشي — الخارجة ما تزال نصف ظاهرة والداخلة قد بدأت — يرى
 * القارئ عنوانين فوق بعضهما وشارتين ورقمين، وهو الشبح الذي يفسد المشهد. لذلك
 * تنتهي الورقة الخارجة عند الحد `b` تماماً وتبدأ الداخلة منه: لا لحظة يظهر فيها
 * نصّان معاً.
 *
 * ولئلا يترك التسليم فجوة بيضاء عند `b`، يُوزَّع الزمن لا بالتساوي: الخارجة
 * تبقى كاملة ثم تسقط في آخر النافذة (`easeInSoft`)، والداخلة تقفز إلى الظهور في
 * أولها (`easeOutSoft`). فالمجموع المرئي يبقى قريباً من الواحد طوال العبور.
 */
const SWAP = 0.085 // طول نافذة الدخول أو الخروج على شريط التقدم [0..1]
const SHIFT = 26 // إزاحة الورقة رأسياً: تصعد الخارجة وتطلع الداخلة من تحتها (px)

/*
 * منحنيا التسهيل مكتوبان هنا لا مستوردان: دالتان بسطر واحد لا تستحقان ربطاً
 * بسطح framer-motion العام.
 */
const easeOutSoft = (t: number) => 1 - Math.pow(1 - t, 2.2)
const easeInSoft = (t: number) => Math.pow(t, 2.2)
const linear = (t: number) => t

type Easing = (t: number) => number

/** الأبعاد الأصلية لـ `/bike.webp` — تُحجز نسبتها فلا يقفز التخطيط (CLS). */
const BIKE_W = 1354
const BIKE_H = 925

/**
 * جدول المرحلة رقم i على شريط التقدم [0..1]: نقاط الإدخال، والعتامة والإزاحة
 * عند كل نقطة، ومنحنى التسهيل بين كل نقطتين (فطوله أقصر بواحد كما يشترط
 * `useTransform`).
 *
 * المرحلة الأولى لا نافذة دخول لها (تبدأ ظاهرة)، والأخيرة لا نافذة خروج
 * (تبقى إلى نهاية المسار).
 */
function rangeFor(i: number) {
  const start = i / N
  const end = (i + 1) / N

  const input: number[] = []
  const output: number[] = []
  const shift: number[] = []
  const ease: Easing[] = []

  if (i === 0) {
    input.push(0)
    output.push(1)
    shift.push(0)
  } else {
    input.push(start, start + SWAP)
    output.push(0, 1)
    shift.push(SHIFT, 0)
    ease.push(easeOutSoft)
  }

  if (i === N - 1) {
    input.push(1)
    output.push(1)
    shift.push(0)
    ease.push(linear)
  } else {
    input.push(end - SWAP, end)
    output.push(1, 0)
    shift.push(0, -SHIFT)
    ease.push(linear, easeInSoft)
  }

  return { input, output, shift, ease }
}

/** يُشغَّل قبل الرسم على العميل حتى لا يُرى إطار واحد بالتخطيط الخطأ. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * هل نحن فوق نقطة التوقف `md`؟
 *
 * `null` قبل التركيب — أي «لا نعرف بعد»، وهي حالة الخادم. المشهد يُصيَّر حينها
 * بربط التمرير كاملاً (حالة سطح المكتب)، ثم يُقطع الربط في أول تأثير تخطيطي إن
 * تبيّن أن الشاشة هاتف. الفصل في CSS لا في JS، فلا يتبدّل أي عنصر ولا تُعاد
 * صورة — يتوقف تحريك القيم فحسب.
 */
function useIsDesktop() {
  const [desktop, setDesktop] = React.useState<boolean | null>(null)

  useIsoLayoutEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    const sync = () => setDesktop(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return desktop
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

/**
 * صورة ممتدة لمرحلة من نوع `photo` — من `md` فصاعداً فقط.
 *
 * الحاوية `hidden md:block`، وصور Next مؤجّلة التحميل افتراضياً: عنصر بلا صندوق
 * لا يتقاطع مع النافذة أبداً، فلا يجلب الهاتف هاتين الصورتين (2070px لكل منهما).
 */
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
  const { input, output, ease } = rangeFor(index)
  const opacity = useTransform(progress, input, output, { ease })
  // التقريب البطيء يمتدّ على المرحلة كلها وما حولها، فلا يقف عند حدود التبديل:
  // الصورة تظلّ تزحف طوال بقائها فلا تبدو لقطة جامدة.
  const scale = useTransform(
    progress,
    [index / N - SWAP, (index + 1) / N + SWAP],
    [1.12, 1]
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
 * نسخة المرحلة — على سطح المكتب كل النسخ متراكبة في خلية شبكة واحدة، فارتفاع
 * الخلية هو ارتفاع أطولها ولا يقفز ما تحتها (الأزرار) عند تبديل المرحلة. على
 * الهاتف لا تراكب ولا تعاقب: المرحلة الأولى وحدها تُعرض والباقي `hidden`.
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
  const { input, output, shift, ease } = rangeFor(index)
  const opacity = useTransform(progress, input, output, { ease })
  // الإزاحة مشتقّة من التمرير مباشرة لا من `opacity`: سلسلة قيمتين تعني قيمة
  // وسيطة وإشعاراً إضافياً في كل إطار، بلا أي فرق في الناتج. وهي ذات اتجاه —
  // الخارجة تصعد والداخلة تطلع من تحتها — فيقرأ التبديل كتتابع لا كومضة.
  const y = useTransform(progress, input, shift, { ease })

  // عنوان واحد `h1` في المستند؛ عنوانا المرحلتين التاليتين `h2` بنفس المقاس.
  const Title = index === 0 ? "h1" : "h2"

  return (
    <motion.div
      style={still ? { opacity: index === 0 ? 1 : 0 } : { opacity, y }}
      className={cn(
        "gpu max-w-2xl self-start md:col-start-1 md:row-start-1",
        index === 0 ? "relative" : "hidden md:block md:pointer-events-none"
      )}
    >
      {/*
        ورقٌ شبه معتم في المقاسين، بلا `backdrop-blur` في أيّهما.

        كان الطمس الخلفي محصوراً فوق `sm` على أساس أن سطح المكتب يحتمله. لكنه
        هنا أسوأ منه في أي مكان آخر: الشارة عضو في ورقة المرحلة، وهذه الورقة
        تُحرَّك شفافيةً وإزاحةً مع كل إطار ما دام الـ Hero على الشاشة، وتحتها
        صورة ممتدّة تتقارب في الوقت نفسه. فالطمس الخلفي هنا قراءةٌ لخلفية
        متغيّرة تحت عنصر متحرّك — أي إعادة رسم مضمونة في كل إطار، لا مرة واحدة
        تُخزَّن. وما كان يُرى من ورائه أصلاً لا يستحق ذلك.
      */}
      <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/85 py-1.5 pe-3.5 ps-1.5 sm:mb-5 sm:gap-3 sm:pe-4">
        <span className="grid size-7 place-items-center rounded-full bg-pine font-plate text-[11px] font-black text-paper">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow text-pine-deep">{copy.eyebrow}</span>
      </div>

      {/*
        `.plate-title` لا `font-plate`: العنوان يأتي من القاموس، فهو لاتيني في
        الإنجليزية وعربي في العربية — والصنف يبدّل الوجه والتتبّع مع الاتجاه.
        و`.hero-title` يحمل المقاس.
      */}
      <Title className="plate-title hero-title leading-[0.9] rtl:leading-[1.02] font-black text-ink">
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
      </Title>

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
  const { input, output, ease } = rangeFor(index)
  const opacity = useTransform(progress, input, output, { ease })
  const scale = useTransform(
    progress,
    input,
    output.map((o) => 0.6 + o * 0.4),
    { ease }
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
  const desktop = useIsDesktop()
  const coarse = useCoarsePointer()

  /*
   * المشهد يثبت على مرحلته الأولى بلا أي ربط بالتمرير في حالتين: تفضيل تقليل
   * الحركة، أو شاشة هاتف حيث لا إطار مثبّتاً يقود التعاقب أصلاً — ولو بقي الربط
   * هناك لتلاشت الدراجة من العمود بعد ثلث الطريق بلا سبب.
   */
  const reduced = useReducedMotion() === true
  const still = reduced || desktop === false

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
   * السحب ويظلّ يستقرّ بعد رفعه. لذلك يمرّ تقدّم التمرير على اللمس كما هو.
   */
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.0005,
  })
  const p = coarse ? scrollYProgress : smoothed

  // الدراجة المقصوصة: بصرية المرحلة الأولى — تندفع للأمام ثم تسلّم للصور.
  const bikeRange = rangeFor(0)
  const bikeOpacity = useTransform(p, bikeRange.input, bikeRange.output, {
    ease: bikeRange.ease,
  })
  // الاندفاع يهدأ قبل التسليم (`easeOutSoft`) فلا تغادر الدراجة وهي في ذروة
  // سرعتها، ومداه أقصر من السابق: حركة أقلّ تعني شبحاً أقلّ خلف النص.
  const bikeScale = useTransform(p, [0, 1 / N], [0.94, 1.1], {
    ease: easeOutSoft,
  })
  const bikeY = useTransform(p, [0, 1 / N], [14, -40], { ease: easeOutSoft })

  /*
   * حجاب العاج يشتدّ مع دخول الصور. المرحلة الأولى خلفيتها ورق فاتح أصلاً فلا
   * تحتاج حجاباً كاملاً — ونصفه يكفي ليذوب طرف الدراجة في الورق بدل أن يُمحى.
   */
  const veilOpacity = useTransform(
    p,
    bikeRange.input,
    bikeRange.output.map((o) => 1 - o * 0.5),
    { ease: bikeRange.ease }
  )

  const railProgress = useTransform(p, [0, 1], [0, 1])

  return (
    // ارتفاع القسم — أي مسار التمرير — لا وجود له إلا حيث يوجد تثبيت.
    <section ref={ref} className="relative md:h-[300svh]">
      {/*
        الإطار شفاف عمداً: الطبقة الخلفية الدائمة تُرى من خلاله، فتبقى العلامة
        المائية متصلة من المرحلة الأولى إلى ما بعد نهاية القسم.

        `overflow-hidden` من `md` فصاعداً فقط — وهو ما يحتاجه الإطار المثبّت
        ليقصّ الصور الممتدة. على الهاتف لا صور ممتدة ولا تثبيت، ووجوده هناك لا
        يضيف إلا كسر فيزياء الـ sticky في iOS Safari وقصّ ما يفيض من العمود.
      */}
      <div className="hero-frame relative isolate flex min-h-[100dvh] w-full flex-col md:sticky md:top-0 md:h-svh md:min-h-0 md:justify-center md:overflow-hidden">
        {/* z-0 — صورتا المرحلتين الثانية والثالثة، سطح المكتب وحده */}
        <div className="absolute inset-0 z-0 hidden md:block">
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

        {/*
          z-30 — نسخة المرحلة. على الهاتف أول عضو في العمود، ومن `md` تعود إلى
          نصف الإطار القريب من حافة القراءة ومعها النص الثابت والأزرار.
        */}
        <div className="shell relative z-30 order-1">
          <div className="md:grid">
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

          {/* النص الثابت + الأزرار — لا يتبدّلان بين المراحل */}
          <div className="mt-10 hidden max-w-2xl border-t border-line pt-6 md:block">
            <p className="hero-drop max-w-xl text-sm leading-loose text-ink-soft">
              {dict.hero.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
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

        {/*
          z-10 — الدراجة المقصوصة. عنصر واحد بتخطيطين: على الهاتف عضو في العمود
          يجلس تحت النص لا فوقه، و`my-auto` تُعطيه ما فضل من ارتفاع موزّعاً على
          طرفيه فيتوسّط بين العنوان والأزرار؛ ومن `md` يخرج من التدفّق إلى النصف
          البعيد عن حافة القراءة.

          سقف ارتفاع الصورة `svh` لا `dvh` ولا نسبة من الفراغ المتبقّي: العمود
          نفسه `dvh` — وهذا مقصود، فالأزرار يجب أن تستقرّ فوق شريط المتصفح لا
          تحته — لكن ذلك يعني أن طوله يكبر لحظة ينطوي الشريط. فلو اشتقّت الصورة
          مقاسها من ذلك الطول لتمدّدت تحت الإصبع في أول دفعة تمرير. `svh` ثابتة
          لا يحرّكها الشريط، فتنزاح الأزرار وحدها وتبقى الصورة على حالها.
        */}
        <motion.div
          style={
            still
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: bikeOpacity, scale: bikeScale, y: bikeY }
          }
          className="gpu pointer-events-none order-2 z-10 my-auto w-full px-5 py-4 md:absolute md:inset-y-0 md:end-0 md:m-0 md:h-full md:w-[54%] md:p-0"
        >
          <Image
            src={HERO_STAGES[0].image}
            alt={dict.hero.slides.discover.alt}
            width={BIKE_W}
            height={BIKE_H}
            preload
            sizes="(min-width: 768px) 56vw, (min-width: 420px) 24rem, 92vw"
            className="mx-auto h-auto max-h-[34svh] w-full max-w-sm object-contain object-center md:h-full md:max-h-none md:max-w-none"
          />
        </motion.div>

        {/*
          z-20 — حجاب العاج التحريري، سطح المكتب وحده: وظيفته حراسة تباين النص
          فوق الصور الممتدة، ولا صور ممتدة على الهاتف.
          لا يغطّي الإطار بكثافة واحدة: أقواه في المنطقة التي قد يلتقي فيها النص
          بالصورة، ثم يخفّ نحو الحافة البعيدة (لتبقى الصورة صورة) ونحو حافة
          القراءة (لتبقى العلامة المائية مقروءة تحت النص بدل أن تُطمس).
        */}
        <motion.div
          style={still ? { opacity: 0.5 } : { opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 z-20 hidden md:block"
        >
          <div className="absolute inset-0 ltr:bg-[linear-gradient(to_left,rgba(247,245,240,0)_0%,rgba(247,245,240,0.34)_26%,rgba(247,245,240,0.86)_55%,rgba(247,245,240,0.6)_80%,rgba(247,245,240,0.38)_100%)] rtl:bg-[linear-gradient(to_right,rgba(247,245,240,0)_0%,rgba(247,245,240,0.34)_26%,rgba(247,245,240,0.86)_55%,rgba(247,245,240,0.6)_80%,rgba(247,245,240,0.38)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(247,245,240,0.6),rgba(247,245,240,0)_58%)]" />
        </motion.div>

        {/* النقش الورقي فوق الصور — شبكة النقاط تأتي من الطبقة الخلفية الدائمة */}
        <div className="grain-stage pointer-events-none absolute inset-0 z-20" />

        {/*
          z-30 — الأزرار على الهاتف. آخر عضو في العمود، فتستقرّ في قاع الشاشة
          المرئية — والعمود `100dvh` لا `100vh`، فلا يبتلع شريط المتصفح الزرّين
          ولا يقصّهما أب ذو `overflow-hidden`. من `md` تعود إلى كتلة النص أعلاه.
        */}
        <div className="shell relative z-30 order-3 border-t border-line pt-5 md:hidden">
          <p className="line-clamp-2 text-[13px] leading-loose text-ink-soft">
            {dict.hero.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild variant="pine" size="lg">
              <Link href={href("/submissions")}>
                {dict.hero.primaryCta}
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={href("/about")}>{dict.hero.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        {/* سكة التقدم — على الحافة المقابلة للنص، حيث يوجد تعاقب تدلّ عليه */}
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
