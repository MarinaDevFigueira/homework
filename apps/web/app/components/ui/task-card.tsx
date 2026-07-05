import * as React from "react"
import { cn } from "~/lib/utils"

function TaskCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="task-card"
      className={cn(
        "rounded-lg border border-border bg-card p-3.5 text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function TaskCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="task-card-header"
      className={cn("mb-2 flex items-center justify-between", className)}
      {...props}
    />
  )
}

function TaskCardUser({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="task-card-user"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function TaskCardUserInfo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="task-card-user-info"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

function TaskCardUserName({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="task-card-user-name"
      className={cn("block text-[0.8125rem] font-semibold leading-tight", className)}
      {...props}
    />
  )
}

function TaskCardUserDate({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="task-card-user-date"
      className={cn("block text-[0.6875rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

function TaskCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="task-card-title"
      className={cn("mb-1.5 text-sm font-semibold leading-snug", className)}
      {...props}
    />
  )
}

function TaskCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="task-card-description"
      className={cn("mb-2 text-xs leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function TaskCardMeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="task-card-meta"
      className={cn("flex flex-wrap gap-1.5", className)}
      {...props}
    />
  )
}

function TaskCardActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="task-card-actions"
      className={cn("mt-3 flex items-center justify-between border-t border-border pt-2.5", className)}
      {...props}
    />
  )
}

export {
  TaskCard,
  TaskCardHeader,
  TaskCardUser,
  TaskCardUserInfo,
  TaskCardUserName,
  TaskCardUserDate,
  TaskCardTitle,
  TaskCardDescription,
  TaskCardMeta,
  TaskCardActions,
}
