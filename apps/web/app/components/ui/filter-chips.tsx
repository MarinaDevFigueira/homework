import * as React from "react"
import { cn } from "~/lib/utils"

function FilterChips({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="filter-chips"
      className={cn(
        "flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    />
  )
}

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function FilterChip({ active, className, ...props }: FilterChipProps) {
  return (
    <button
      data-slot="filter-chip"
      data-active={active ? "" : undefined}
      className={cn(
        "rounded-full border-[1.5px] border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap transition-all",
        "data-active:border-primary data-active:bg-secondary data-active:text-secondary-foreground",
        "hover:border-primary/50 hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { FilterChips, FilterChip }
