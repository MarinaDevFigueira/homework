import * as React from "react"
import { cn } from "~/lib/utils"

interface ResourceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  low?: boolean
}

function ResourceCard({ low, className, ...props }: ResourceCardProps) {
  return (
    <div
      data-slot="resource-card"
      data-low={low ? "" : undefined}
      className={cn(
        "rounded-lg border border-border bg-card p-3.5",
        "data-low:border-status-overdue-foreground",
        className
      )}
      {...props}
    />
  )
}

function ResourceCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="resource-card-header"
      className={cn("mb-2.5 flex items-center gap-2.5", className)}
      {...props}
    />
  )
}

interface ResourceCardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  low?: boolean
}

function ResourceCardIcon({ low, className, ...props }: ResourceCardIconProps) {
  return (
    <div
      data-slot="resource-card-icon"
      data-low={low ? "" : undefined}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xl",
        "data-low:bg-status-overdue",
        className
      )}
      {...props}
    />
  )
}

function ResourceCardName({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="resource-card-name"
      className={cn("text-sm font-bold", className)}
      {...props}
    />
  )
}

function ResourceCardMeta({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="resource-card-meta"
      className={cn("mt-0.5 block text-[0.6875rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

function ResourceCardInstances({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="resource-card-instances"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function ResourceCardInstanceRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="resource-card-instance-row"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ResourceCardInstanceLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="resource-card-instance-label"
      className={cn("w-11 shrink-0 text-[0.6875rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

interface CapacityBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent: number
  low?: boolean
  warn?: boolean
}

function CapacityBar({ percent, low, warn, className, ...props }: CapacityBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent))
  const fillClass = low
    ? "bg-status-overdue-foreground"
    : warn
      ? "bg-brand"
      : "bg-primary"

  return (
    <div
      data-slot="capacity-bar"
      className={cn("h-1.5 flex-1 overflow-hidden rounded-full bg-border", className)}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-300", fillClass)}
        style={{ width: `${clampedPercent}%` }}
      />
    </div>
  )
}

function ResourceCardPercent({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="resource-card-percent"
      className={cn("w-8 shrink-0 text-right text-[0.6875rem] font-semibold", className)}
      {...props}
    />
  )
}

export {
  ResourceCard,
  ResourceCardHeader,
  ResourceCardIcon,
  ResourceCardName,
  ResourceCardMeta,
  ResourceCardInstances,
  ResourceCardInstanceRow,
  ResourceCardInstanceLabel,
  CapacityBar,
  ResourceCardPercent,
}
