import * as React from "react"
import { NavLink } from "react-router"
import { cn } from "~/lib/utils"

function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      data-slot="sidebar-nav"
      className={cn(
        "hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function SidebarNavLogo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-logo"
      className={cn("border-b border-sidebar-border px-4 pb-3 pt-5", className)}
      {...props}
    />
  )
}

function SidebarNavBrand({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-brand"
      className={cn("flex items-center gap-2 text-base font-bold", className)}
      {...props}
    />
  )
}

function SidebarNavLogoIcon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-logo-icon"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-sm",
        className
      )}
      {...props}
    />
  )
}

function SidebarNavSection({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-section"
      className={cn("p-2", className)}
      {...props}
    />
  )
}

function SidebarNavLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="sidebar-nav-label"
      className={cn(
        "block px-2 pb-1 pt-2 text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

interface SidebarNavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  className?: string
}

function SidebarNavItem({ to, icon, label, className }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      data-slot="sidebar-nav-item"
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium transition-all",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-foreground hover:bg-secondary hover:text-foreground",
          className
        )
      }
    >
      <span className="w-4 shrink-0 text-center text-sm leading-none">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

function SidebarNavDivider({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      data-slot="sidebar-nav-divider"
      className={cn("mx-2 my-1.5 border-sidebar-border", className)}
      {...props}
    />
  )
}

function SidebarNavFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-footer"
      className={cn("mt-auto border-t border-sidebar-border p-2", className)}
      {...props}
    />
  )
}

export {
  SidebarNav,
  SidebarNavLogo,
  SidebarNavBrand,
  SidebarNavLogoIcon,
  SidebarNavSection,
  SidebarNavLabel,
  SidebarNavItem,
  SidebarNavDivider,
  SidebarNavFooter,
}
