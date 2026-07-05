import { Outlet } from "react-router"
import {
  SidebarNav,
  SidebarNavLogo,
  SidebarNavBrand,
  SidebarNavLogoIcon,
  SidebarNavSection,
  SidebarNavLabel,
  SidebarNavItem,
  SidebarNavDivider,
  SidebarNavFooter,
} from "./sidebar-nav"
import { Topbar, TopbarBrand, TopbarLogo, TopbarActions } from "./topbar"
import { BottomNav, BottomNavItem } from "./bottom-nav"
import { Button } from "~/components/ui/button"

const primaryNavItems = [
  { to: "/",            icon: "✓",  label: "Tarefas" },
  { to: "/recursos",    icon: "📦", label: "Recursos" },
  { to: "/agenda",      icon: "📅", label: "Agenda" },
  { to: "/compras",     icon: "🛒", label: "Compras" },
]

const secondaryNavItems = [
  { to: "/recorrentes",    icon: "🔁", label: "Recorrentes" },
  { to: "/relatorios",     icon: "📊", label: "Relatórios" },
  { to: "/pessoas",        icon: "👥", label: "Pessoas" },
  { to: "/configuracoes",  icon: "⚙️", label: "Configurações" },
]

const mobileNavItems = [
  { to: "/",         icon: "✓",  label: "Tarefas" },
  { to: "/recursos", icon: "📦", label: "Recursos" },
  { to: "/agenda",   icon: "📅", label: "Agenda" },
  { to: "/compras",  icon: "🛒", label: "Compras" },
  { to: "/pessoas",  icon: "👥", label: "Pessoas" },
]

export function AppShell() {
  return (
    <div className="flex min-h-dvh bg-background">
      <SidebarNav>
        <SidebarNavLogo>
          <SidebarNavBrand>
            <SidebarNavLogoIcon>🏠</SidebarNavLogoIcon>
            Homework
          </SidebarNavBrand>
        </SidebarNavLogo>

        <SidebarNavSection>
          <SidebarNavLabel>Principal</SidebarNavLabel>
          {primaryNavItems.map((item) => (
            <SidebarNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </SidebarNavSection>

        <SidebarNavDivider />

        <SidebarNavSection>
          <SidebarNavLabel>Gestão</SidebarNavLabel>
          {secondaryNavItems.map((item) => (
            <SidebarNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </SidebarNavSection>

        <SidebarNavFooter>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <span>👤</span>
            <span className="truncate">Minha conta</span>
          </Button>
        </SidebarNavFooter>
      </SidebarNav>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar>
          <TopbarBrand>
            <TopbarLogo>🏠</TopbarLogo>
            Homework
          </TopbarBrand>
          <TopbarActions>
            <Button variant="ghost" size="icon" aria-label="Notificações">
              🔔
            </Button>
          </TopbarActions>
        </Topbar>

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-[calc(3.5rem+5rem)] lg:px-6 lg:py-8 lg:pb-16">
          <div className="mx-auto w-full max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav>
        {mobileNavItems.map((item) => (
          <BottomNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </BottomNav>
    </div>
  )
}
