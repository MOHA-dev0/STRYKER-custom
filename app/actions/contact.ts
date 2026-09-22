"use server"

import { z } from "zod"

import { CONTACT_SUBJECTS, SITE } from "@/lib/data"
import { deliverToTeam, type DeliveryResult } from "@/lib/email/deliver"
import { LOCALES } from "@/lib/i18n/config"
import { loadDictionary } from "@/lib/i18n/dictionaries"

/**
 * إرسال نموذج التواصل إلى بريد الفريق.
 *
 * الـ Server Action نقطة دخول عامة: أي أحد يستطيع إرسال POST إليها دون المرور
 * بالنموذج، فالتحقق هنا يُعاد من الصفر ولا يُعتمد على مخطّط الواجهة.
 *
 * `next/root-params` لا يعمل داخل Server Actions، لذا تصل اللغة من العميل
 * ضمن الحمولة — تُستخدم لعرض اسم الموضوع في نص البريد فقط، لا للصلاحيات.
 */
const schema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().max(200).pipe(z.email()),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().trim().min(15).max(1200),
  locale: z.enum(LOCALES),
})

export type ContactInput = z.input<typeof schema>

export type ContactResult = DeliveryResult | { ok: false; reason: "invalid" }

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: "invalid" }

  const { name, email, subject, message, locale } = parsed.data

  const copy = (await loadDictionary(locale)).contact
  const subjectLabel = copy.subjects[subject]

  return deliverToTeam({
    scope: "contact",
    subject: `${SITE.short} — ${subjectLabel} — ${name}`,
    rtl: locale === "ar",
    /* الرد يذهب إلى صاحب الرسالة مباشرة، لا إلى عنوان الإرسال. */
    replyTo: email,
    fields: [
      { label: copy.form.nameLabel, value: name },
      { label: copy.form.emailLabel, value: email },
      { label: copy.form.subjectLabel, value: subjectLabel },
      { label: copy.form.messageLabel, value: message },
    ],
  })
}
