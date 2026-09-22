import { headers } from "next/headers"
import { Resend } from "resend"

import { SITE } from "@/lib/data"
import { renderTeamEmail, type EmailField } from "./team-message"

/**
 * القناة التي تسلك عبرها كل نماذج الموقع إلى بريد الفريق.
 *
 * لا تُستدعى إلا من داخل Server Actions — `headers()` يتطلّب سياق طلب.
 */

export type DeliveryResult = { ok: true } | { ok: false; reason: "rateLimited" | "failed" }

/** ثلاث رسائل لكل عنوان خلال عشر دقائق. */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 3

/**
 * حدّ بسيط في الذاكرة. يُعاد ضبطه مع كل نسخة من الخادم، فهو يوقف الضغط
 * المتكرر من متصفح واحد لا هجوماً موزعاً — الحماية الحقيقية عند الحافة.
 */
const hits = new Map<string, number[]>()

function rateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > MAX_PER_WINDOW
}

export async function deliverToTeam({
  scope,
  subject,
  fields,
  rtl,
  replyTo,
}: {
  /** اسم النموذج — يفصل حصّة كل نموذج عن الآخر داخل حدّ المعدّل. */
  scope: string
  subject: string
  fields: EmailField[]
  rtl: boolean
  /** يُترك فارغاً حين لا يعطينا المرسِل بريداً — نموذج المشاركة يقبل جوالاً. */
  replyTo?: string
}): Promise<DeliveryResult> {
  const headerList = await headers()
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  if (rateLimited(`${scope}:${ip}`)) return { ok: false, reason: "rateLimited" }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    console.error("email: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL غير مضبوطة")
    return { ok: false, reason: "failed" }
  }

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to: [to],
    replyTo,
    /* اسم المرسِل يدخل ترويسة Subject، وسطر الترويسة لا يحتمل أسطراً جديدة. */
    subject: subject.replace(/\s+/g, " "),
    html: renderTeamEmail({ fields, brand: { short: SITE.short, name: SITE.name }, rtl }),
    text: fields.map(({ label, value }) => `${label}:\n${value}`).join("\n\n"),
  })

  if (error) {
    console.error(`email (${scope}): Resend رفض الإرسال —`, error)
    return { ok: false, reason: "failed" }
  }

  return { ok: true }
}
