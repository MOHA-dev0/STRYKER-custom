"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      // لا `flex-wrap` هنا: الحاوية `rounded-full`، وكسر التبويبات إلى سطرين
      // داخل حبّة كاملة الاستدارة يعطي الشكل المشوّه الذي لا نصف قطر فيه يطابق
      // ارتفاعه. من يحتاج أكثر من سطر يطلب تخطيطاً آخر من الخارج (كما يفعل
      // `Squad` بشبكة 2×2 على الهاتف) بدل أن يُترك الالتفاف يقرّر عنه.
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-full border border-line bg-paper/85 p-1.5 sm:bg-paper/70 sm:backdrop-blur",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // `min-h-11` = 44px: مساحة لمس كاملة مهما صغر النص — التبويب هدف إصبع
        // لا هدف مؤشّر.
        "inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-ink-mute transition-all duration-300",
        "hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/40",
        "data-[state=active]:bg-pine data-[state=active]:text-paper data-[state=active]:shadow-lift",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
