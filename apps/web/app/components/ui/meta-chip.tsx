import * as React from "react"
import { cn } from "~/lib/utils"

function MetaChip({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="meta-chip"
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-border bg-muted px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function MetaChipIcon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="meta-chip-icon"
      className={cn("text-xs opacity-70", className)}
      {...props}
    />
  )
}

export { MetaChip, MetaChipIcon }
