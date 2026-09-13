"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  closeLabel = "Close",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "bottom" | "left" | "right"
  /**
   * التسمية الصوتية لزر الإغلاق. تُمرَّر من القاموس؛ القيمة الافتراضية
   * إنجليزية حتى لا تُخبّئ هذه البدائية نصاً بلغة واحدة داخلها.
   */
  closeLabel?: string
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-paper shadow-[0_0_90px_-24px_rgba(26,31,29,0.45)] transition ease-out",
          side === "right" &&
            "inset-y-0 right-0 h-full w-4/5 max-w-sm border-l border-line data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right",
          side === "left" &&
            "inset-y-0 left-0 h-full w-4/5 max-w-sm border-r border-line data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left",
          side === "top" && "inset-x-0 top-0 border-b border-line",
          side === "bottom" && "inset-x-0 bottom-0 border-t border-line",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute end-5 top-5 grid size-9 place-items-center rounded-full border border-line text-ink-mute transition hover:border-pine/35 hover:bg-pine-soft hover:text-pine-deep focus:outline-none">
          <X className="size-4" />
          <span className="sr-only">{closeLabel}</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1 p-6 pb-2", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-display text-lg font-bold text-ink", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-ink-soft", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
