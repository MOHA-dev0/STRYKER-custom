"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"

/*
 * الظهور عند التمرير: شفافية وإزاحة فقط.
 *
 * كانت النسخة السابقة تحرّك `filter: blur()` كذلك؛ وهو تأثير يُجبر المتصفح
 * على إعادة رسم العنصر في كل إطار، فحين تدخل عدة عناصر الإطار معاً — وهو
 * الحال في كل شبكة هنا — يسقط معدّل الإطارات أثناء التمرير. الإزاحة والشفافية
 * تبقيان على مسار التركيب وحده.
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
}

/** غلاف ظهور عند التمرير — يُستخدم في كل الأقسام للحفاظ على إيقاع واحد. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: keyof typeof tags
}) {
  const MotionTag = tags[as]
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  )
}

/** حاوية تُرتّب ظهور أبنائها بتتابع. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

/** عنصر داخل RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
