import * as React from "react"
import { cn } from "~/lib/utils"

function EmptyState({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}
      {...props}
    />
  )
}

function EmptyStateIcon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-state-icon"
      className={cn("text-4xl text-muted-foreground/50", className)}
      {...props}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="empty-state-title"
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function EmptyStateDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn("max-w-xs text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function EmptyStateAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-state-action"
      className={cn("mt-1", className)}
      {...props}
    />
  )
}

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
}
