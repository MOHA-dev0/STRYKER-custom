import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-xl border border-line bg-sand-soft px-4 py-2 text-sm text-ink transition-colors duration-200",
        "placeholder:text-ink-mute",
        "focus-visible:border-pine focus-visible:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/25",
        "aria-[invalid=true]:border-ember aria-[invalid=true]:ring-ember/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
