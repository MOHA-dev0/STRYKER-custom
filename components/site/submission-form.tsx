"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react"

import { sendSubmissionEntry } from "@/app/actions/submission"

import { CITIES } from "@/lib/data"
import { useI18n } from "@/lib/i18n/context"
import type { Dictionary } from "@/lib/i18n/dictionaries/ar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
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

const CONTACT_RE = /^(?:[^\s@]+@[^\s@]+\.[^\s@]{2,}|(?:\+?\d[\d\s-]{7,})$)/

type City = (typeof CITIES)[number]

/** الرسائل تأتي من القاموس، فالمخطط يُبنى لكل لغة. */
function buildSchema(t: Dictionary["submissions"]["form"]["errors"]) {
  return z.object({
    name: z.string().min(3, { message: t.name }),
    contact: z
      .string()
      .min(6, { message: t.contactRequired })
      .regex(CONTACT_RE, { message: t.contactFormat }),
    model: z.string().min(2, { message: t.model }),
    garage: z.string().optional(),
    city: z.string().min(1, { message: t.city }),
    notes: z
      .string()
      .min(20, { message: t.notesMin })
      .max(900, { message: t.notesMax }),
  })
}

type Values = z.infer<ReturnType<typeof buildSchema>>

export function SubmissionForm() {
  const { dict, locale } = useI18n()
  const copy = dict.submissions.form
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const schema = React.useMemo(() => buildSchema(copy.errors), [copy.errors])

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      contact: "",
      model: "",
      garage: "",
      city: "",
      notes: "",
    },
  })

  async function onSubmit(values: Values) {
    setError(null)

    const result = await sendSubmissionEntry({
      ...values,
      /* القائمة لا تعرض إلا مفاتيح CITIES، والخادم يتحقق منها ثانية. */
      city: values.city as City,
      locale,
    })

    if (!result.ok) {
      /* "invalid" لا يُفترض أن يصل إلى هنا — مخطّط الخادم نسخة من مخطّط النموذج. */
      setError(result.reason === "rateLimited" ? copy.rateError : copy.sendError)
      return
    }

    setSent(true)
    form.reset()
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-paper p-7 shadow-lift md:p-10">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="relative mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-ember-deep">{copy.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">{copy.title}</h2>
          <p className="mt-2 max-w-md text-sm leading-loose text-ink-soft">{copy.lead}</p>
        </div>
        <span className="hidden font-plate text-6xl leading-none font-black text-ink/6 sm:block">
          01
        </span>
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
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.contactLabel}</FormLabel>
                        <FormControl>
                          <Input
                            dir="ltr"
                            className="text-start rtl:text-right"
                            placeholder={copy.contactPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.modelLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={copy.modelPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="garage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.garageLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={copy.garagePlaceholder} {...field} />
                        </FormControl>
                        <FormDescription>{copy.garageHint}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{copy.cityLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={copy.cityPlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CITIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {dict.cities[c]}
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{copy.notesLabel}</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder={copy.notesPlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{copy.notesHint}</FormDescription>
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
                  <p className="text-xs text-ink-mute">{copy.privacy}</p>
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
