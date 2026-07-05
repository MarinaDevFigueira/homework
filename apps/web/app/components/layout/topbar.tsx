import * as React from "react"
import { cn } from "~/lib/utils"

function Topbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      data-slot="topbar"
      className={cn(
        "sticky top-0 z-30 flex h-13 items-center justify-between border-b border-border bg-background px-4 lg:hidden",
        className
      )}
      {...props}
    />
  )
}

function TopbarBrand({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="topbar-brand"
      className={cn("flex items-center gap-2 font-bold", className)}
      {...props}
    />
  )
}

function TopbarLogo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="topbar-logo"
      className={cn(
        "flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-sm",
        className
      )}
      {...props}
    />
  )
}

function TopbarActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="topbar-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export { Topbar, TopbarBrand, TopbarLogo, TopbarActions }
