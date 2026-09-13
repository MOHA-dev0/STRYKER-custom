"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-line transition-colors last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 py-5 text-start font-display text-base font-bold text-ink transition-colors",
          "hover:text-pine-deep focus-visible:outline-none focus-visible:text-pine-deep",
          "data-[state=open]:text-pine-deep",
          className
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-sand-soft text-pine transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-line group-data-[state=open]:bg-pine group-data-[state=open]:text-paper">
          <Plus className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-acc-up data-[state=open]:animate-acc-down"
      {...props}
    >
      <div className={cn("pb-6 ps-12 pe-2 text-sm leading-loose text-ink-soft", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
