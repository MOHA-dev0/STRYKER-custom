"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react"

import { sendContactMessage } from "@/app/actions/contact"

import { CONTACT_SUBJECTS } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import type { Dictionary } from "@/lib/i18n/dictionaries/ar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Subject = (typeof CONTACT_SUBJECTS)[number]

const VALID = new Set<string>(CONTACT_SUBJECTS)

/** الرسائل تأتي من القاموس، فالمخطط يُبنى لكل لغة. */
function buildSchema(t: Dictionary["contact"]["form"]["errors"]) {
  return z.object({
    name: z.string().min(3, { message: t.name }),
    email: z
      .string()
      .min(1, { message: t.emailRequired })
      .regex(EMAIL_RE, { message: t.emailFormat }),
    subject: z.string().min(1, { message: t.subject }),
    message: z
      .string()
      .min(15, { message: t.messageMin })
      .max(1200, { message: t.messageMax }),
  })
}

type Values = z.infer<ReturnType<typeof buildSchema>>

export function ContactForm() {
  const { dict, locale } = useI18n()
  const copy = dict.contact.form
  const params = useSearchParams()
  const preset = params.get("subject")
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const schema = React.useMemo(() => buildSchema(copy.errors), [copy.errors])

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: preset && VALID.has(preset) ? preset : "",
      message: "",
    },
  })

  async function onSubmit(values: Values) {
    setError(null)

    const result = await sendContactMessage({
      ...values,
      /* القائمة لا تعرض إلا مفاتيح CONTACT_SUBJECTS، والخادم يتحقق منها ثانية. */
      subject: values.subject as Subject,
      locale,
    })

    if (!result.ok) {
      /* "invalid" لا يُفترض أن يصل إلى هنا — مخطّط الخادم نسخة من مخطّط النموذج. */
      setError(result.reason === "rateLimited" ? copy.rateError : copy.sendError)
      return
    }

    setSent(true)
    form.reset({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-paper p-7 shadow-lift md:p-10">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="relative mb-8">
        <p className="eyebrow text-ember-deep">{copy.eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">{copy.title}</h2>
        <p className="mt-2 max-w-md text-sm leading-loose text-ink-soft">{copy.lead}</p>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center gap-4 border border-line bg-sand-soft px-6 py-14 text-center"
          >
            <span className="grid size-14 place-items-center rounded-full border border-pine/50 bg-pine-soft text-pine-deep">
              <CheckCircle2 className="size-7" />
            </span>
            <h3 className="font-display text-xl font-bold text-ink">{copy.doneTitle}</h3>
            <p className="max-w-sm text-sm leading-loose text-ink-soft">{copy.doneBody}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null)
                setSent(false)
              }}
            >
              {copy.doneCta}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.nameLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={copy.namePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.emailLabel}</FormLabel>
                        <FormControl>
                          <Input
                            dir="ltr"
                            className="text-start rtl:text-right"
                            placeholder={copy.emailPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{copy.subjectLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={copy.subjectPlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTACT_SUBJECTS.map((value) => (
                            <SelectItem key={value} value={value}>
                              {dict.contact.subjects[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{copy.messageLabel}</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder={copy.messagePlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button
                    type="submit"
                    variant="pine"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {copy.submitting}
                      </>
                    ) : (
                      <>
                        {copy.submit}
                        <Send className="size-4 rtl:-scale-x-100" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-ink-mute">{copy.replyNote}</p>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-ember/30 bg-ember/5 px-4 py-3 text-xs leading-relaxed text-ember-deep"
                  >
                    <AlertCircle className="mt-px size-4 shrink-0" />
                    {error}
                  </p>
                ) : null}
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
