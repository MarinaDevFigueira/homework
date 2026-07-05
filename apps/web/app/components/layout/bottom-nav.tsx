import * as React from "react"
import { NavLink } from "react-router"
import { cn } from "~/lib/utils"

function BottomNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex h-14 border-t border-border bg-background pb-[env(safe-area-inset-bottom,0px)] lg:hidden",
        className
      )}
      {...props}
    />
  )
}

interface BottomNavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  className?: string
}

function BottomNavItem({ to, icon, label, className }: BottomNavItemProps) {
  return (
    <NavLink
      to={to}
      data-slot="bottom-nav-item"
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.5625rem] font-medium text-muted-foreground transition-colors",
          isActive && "text-primary",
          className
        )
      }
    >
      <span className="text-xl leading-none">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export { BottomNav, BottomNavItem }
