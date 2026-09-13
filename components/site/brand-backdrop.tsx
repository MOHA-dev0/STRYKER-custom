"use client"

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
 * كل ما يتحرك هنا `transform` و`opacity` على عنصر واحد مرقّى إلى طبقة عرض،
 * فالتمرير لا يُطلق أي إعادة تخطيط.
 */
export function BrandBackdrop() {
  const still = useReducedMotion() === true
  const { scrollYProgress } = useScroll()

  // نابض واحد يقود الطبقة كلها: يمتصّ تقطيع عجلة الفأرة قبل أن يصل إلى الرسم.
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // انزياح وتكبير طفيفان — حياة بلا مغادرة الإطار.
  const y = useTransform(p, [0, 1], ["-2.5%", "2.5%"])
  const scale = useTransform(p, [0, 1], [1, 1.08])
  // الكثافة تهبط من 14% إلى ~10% فقط؛ لا تصل الصفر في أي نقطة من الصفحة.
  const opacity = useTransform(p, [0, 1], [1, 0.72])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="brand-wash absolute inset-0" />

      <motion.div
        style={still ? undefined : { y, scale, opacity }}
        className="gpu absolute inset-0 grid place-items-center"
      >
        <div className="emblem-halo absolute aspect-square w-[min(130vw,70rem)]" />
        <div className="fade-oval relative aspect-[493/507] h-[min(72vw,46vh)] max-h-[36rem] md:h-[min(62vh,38rem)]">
          {/* التدرج الذهبي بشكل الدرع — الشفافيتان معاً تبقيان الكثافة ~14% */}
          <div className="emblem-gold absolute inset-0 opacity-[0.14]" />
          {/* نقش الشعار نفسه، أخفت، ليعيد التفاصيل فوق التدرج */}
          <Image
            src="/logo.png"
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 768px) 38rem, 72vw"
            className="object-contain opacity-[0.07] saturate-[0.55]"
          />
        </div>
      </motion.div>

      <div className="dot-grid absolute inset-0 opacity-[0.22]" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
