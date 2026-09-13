"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Arabic letters join, so the 0.18em tracking of the latin label
        // style has to come back off under rtl (`uppercase` is a no-op there).
        "text-[11px] font-bold uppercase tracking-[0.18em] rtl:text-xs rtl:tracking-normal text-ink-soft select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Label }
