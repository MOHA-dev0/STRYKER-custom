import { getDictionary } from "@/lib/i18n/dictionaries"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"

export async function Faq() {
  const dict = await getDictionary()
  const copy = dict.faq

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-line bg-sand-soft py-24 md:py-32"
    >
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />

      <div className="shell relative grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <SectionHeading
          index="03"
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titleLead}
              <span className="accent-word">{copy.titleAccent}</span>
            </>
          }
          lead={copy.lead}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal delay={0.08}>
          <div className="rounded-xl border border-line bg-paper px-6 shadow-soft md:px-9">
            <Accordion type="single" collapsible className="w-full">
              {copy.items.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger>
                    <span className="flex items-baseline gap-4">
                      <span className="font-plate text-xs font-black tracking-[0.2em] text-pine-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
