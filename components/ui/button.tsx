import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * الأزرار حبّات كاملة الاستدارة بلا تكبير حروف: النص العربي لا يستفيد من
 * `uppercase` ويتضرر من التباعد الكبير، فالتمييز هنا يأتي من اللون والوزن.
 */
const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full",
    "text-sm font-bold whitespace-nowrap transition-all duration-300 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-pine/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sand",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-ink text-paper shadow-soft hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lift",
        pine:
          "bg-pine text-paper shadow-soft hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lift",
        ember:
          "bg-ember text-paper shadow-soft hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-lift",
        outline:
          "border border-line bg-paper/60 text-ink backdrop-blur-sm hover:-translate-y-0.5 hover:border-pine/35 hover:bg-pine-soft hover:text-pine-deep",
        ghost: "text-ink-soft hover:bg-pine-soft hover:text-pine-deep",
        link: "rounded-none px-0 text-pine-deep underline-offset-[6px] hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-14 px-8 text-[15px]",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
