import * as React from "react"
import { cn } from "~/lib/utils"

function PageHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="page-header"
      className={cn("mb-4 flex items-start justify-between", className)}
      {...props}
    />
  )
}

function PageHeaderContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="page-header-content"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  )
}

function PageHeaderTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("text-lg font-bold leading-tight", className)}
      {...props}
    />
  )
}

function PageHeaderSubtitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="page-header-subtitle"
      className={cn("mt-0.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function PageHeaderAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="page-header-action"
      className={cn("ml-4 flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderSubtitle,
  PageHeaderAction,
}
