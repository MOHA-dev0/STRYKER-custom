"use server"

import { z } from "zod"

import { CITIES, SITE } from "@/lib/data"
import { deliverToTeam, type DeliveryResult } from "@/lib/email/deliver"
import { LOCALES } from "@/lib/i18n/config"
import { loadDictionary } from "@/lib/i18n/dictionaries"

/**
 * إرسال طلب التسجيل المبكر إلى بريد الفريق.
 *
 * نسخة الخادم من مخطّط النموذج — الـ Server Action نقطة دخول عامة، فلا يُعتمد
 * على تحقق الواجهة. اللغة تصل ضمن الحمولة لأن `next/root-params` لا يعمل هنا.
 */
const CONTACT_RE = /^(?:[^\s@]+@[^\s@]+\.[^\s@]{2,}|(?:\+?\d[\d\s-]{7,})$)/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const schema = z.object({
  name: z.string().trim().min(3).max(120),
  contact: z.string().trim().min(6).max(200).regex(CONTACT_RE),
  model: z.string().trim().min(2).max(160),
  garage: z.string().trim().max(160).optional(),
  city: z.enum(CITIES),
  notes: z.string().trim().min(20).max(900),
  locale: z.enum(LOCALES),
})

export type SubmissionInput = z.input<typeof schema>

export type SubmissionResult = DeliveryResult | { ok: false; reason: "invalid" }

export async function sendSubmissionEntry(
  input: SubmissionInput
): Promise<SubmissionResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: "invalid" }

  const { name, contact, model, garage, city, notes, locale } = parsed.data

  const dict = await loadDictionary(locale)
  const copy = dict.submissions.form

  return deliverToTeam({
    scope: "submission",
    subject: `${SITE.short} — ${copy.eyebrow} — ${name}`,
    rtl: locale === "ar",
    /* حقل التواصل يقبل جوالاً أيضاً، فالرد لا يُوجَّه إلا إذا كان بريداً. */
    replyTo: EMAIL_RE.test(contact) ? contact : undefined,
    fields: [
      { label: copy.nameLabel, value: name },
      { label: copy.contactLabel, value: contact },
      { label: copy.modelLabel, value: model },
      /* الورشة اختيارية — لا نرسل صفاً فارغاً للفريق. */
      ...(garage ? [{ label: copy.garageLabel, value: garage }] : []),
      { label: copy.cityLabel, value: dict.cities[city] },
      { label: copy.notesLabel, value: notes },
    ],
  })
}
