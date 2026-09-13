"use client"

import * as React from "react"
import Image from "next/image"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

/*
 * الطبقة الخلفية الدائمة.
 *
 * لوح واحد مثبّت بالنافذة (`fixed`) يُركَّب مرة واحدة في التخطيط، ويحمل كل ما
 * كان مبعثراً بين الأقسام:
 *   1. غسيلا الضوء الدافئان — كانا على `body` بـ `background-attachment: fixed`،
 *      وهو من أشهر أسباب تقطّع التمرير لأنه يُجبر المتصفح على إعادة رسم خلفية
 *      الصفحة كلها مع كل إطار.
 *   2. الشعار كعلامة مائية ذهبية على هالة صنوبرية، بكثافة ~14% تهبط إلى ~10%.
 *   3. النقش الورقي وشبكة النقاط.
 *
 * لأنه مثبّت بالنافذة ولا يُفكَّك بين مسار وآخر، فالعلامة المائية لا تختفي ولا
 * تُعيد الظهور عند حدود الأقسام: تبقى في مكانها بينما تمرّ الأقسام فوقها — من
 * الـ Hero إلى «HOSAM 1 / CUSTOM 2026» وما بعدها. الأقسام فوقه تُبقي خلفياتها
 * نصف شفافة حتى تقرأ العلامة من خلالها.
 *
 * على الهاتف تتغيّر قاعدتان:
 *
 *   — الحجم والكثافة: العلامة هناك تقع خلف العنوان والزرّين مباشرة لا خلف نصف
 *     إطارٍ فارغ، فتُصغَّر وتُخفَّض إلى ما دون ثلث كثافتها حتى تبقى أثراً في
 *     الورق لا شكلاً ينافس النص.
 *
 *   — الحركة: تُنزع كلياً. هذه طبقة بملء النافذة، وتحريكها يعني إعادة تركيب
 *     الشاشة كاملة مع كل إطار تمرير — أغلى ما يمكن دفعه على هاتف متوسط مقابل
 *     انزياح 5% لا يكاد يُرى. فوق `md` وحدها تبقى الحياة.
 */

/** يُشغَّل قبل الرسم على العميل حتى لا تُرى الطبقة بإعداد الشاشة الخطأ. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

function useIsDesktop() {
  const [desktop, setDesktop] = React.useState(false)

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
 * الشعار نفسه — مشترك بين النسختين الساكنة والمتحركة، فلا يختلف ما يُرسم
 * باختلاف ما يُحرَّك.
 */
function EmblemArt() {
  return (
    <>
      <div className="emblem-halo absolute aspect-square w-[min(90vw,42rem)] opacity-50 md:w-[min(130vw,70rem)] md:opacity-100" />
      <div className="fade-oval relative aspect-[493/507] h-[min(46vw,26svh)] max-h-[36rem] md:h-[min(62svh,38rem)]">
        {/* التدرج الذهبي بشكل الدرع — الشفافيتان معاً تبقيان الكثافة ~14% */}
        <div className="emblem-gold absolute inset-0 opacity-[0.05] md:opacity-[0.14]" />
        {/*
          نقش الشعار نفسه، أخفت، ليعيد التفاصيل فوق التدرج.

          كان `loading="eager"` — و Next يحقن له حينها `<link rel="preload">`،
          فيقف ملفٌ زخرفي بكثافة 7% في طابور واحد مع دراجة الـ Hero التي هي
          عنصر الـ LCP. الأولوية الصريحة المنخفضة تتركه يُحمَّل فوراً (فهو داخل
          النافذة أصلاً) لكن خلف ما يُقاس عليه الأداء، لا أمامه.
        */}
        <Image
          src="/logo.png"
          alt=""
          width={493}
          height={507}
          fetchPriority="low"
          sizes="(min-width: 768px) 38rem, 46vw"
          className="absolute inset-0 h-full w-full object-contain opacity-[0.025] saturate-[0.55] md:opacity-[0.07]"
        />
      </div>
    </>
  )
}

/**
 * النسخة المتحركة — انزياح وتكبير طفيفان، حياة بلا مغادرة الإطار.
 *
 * خطّافات التمرير كلها هنا لا في الأب: المكوّن لا يُركَّب أصلاً على الهاتف،
 * فلا نابض يعمل ولا اشتراك تمرير قائم هناك.
 */
function DriftingEmblem() {
  const { scrollYProgress } = useScroll()

  // نابض واحد يقود الطبقة كلها: يمتصّ تقطيع عجلة الفأرة قبل أن يصل إلى الرسم.
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const y = useTransform(p, [0, 1], ["-2.5%", "2.5%"])
  const scale = useTransform(p, [0, 1], [1, 1.08])
  // الكثافة تهبط من 14% إلى ~10% فقط؛ لا تصل الصفر في أي نقطة من الصفحة.
  const opacity = useTransform(p, [0, 1], [1, 0.72])

  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="gpu absolute inset-0 grid place-items-center"
    >
      <EmblemArt />
    </motion.div>
  )
}

export function BrandBackdrop() {
  const still = useReducedMotion() === true
  const desktop = useIsDesktop()

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="brand-wash absolute inset-0" />

      {desktop && !still ? (
        <DriftingEmblem />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <EmblemArt />
        </div>
      )}

      <div className="dot-grid absolute inset-0 opacity-[0.12] md:opacity-[0.22]" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
