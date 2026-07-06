import { useNavigate, Outlet } from "react-router"
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
import { useAuth } from "~/lib/hooks/use-auth"
import { authStore } from "~/lib/stores/auth.store"
import { authService } from "~/lib/services/auth.service"

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
  const navigate = useNavigate()
  const { session } = useAuth()

  async function handleLogout() {
    await authService.logout()
    authStore.clear()
    navigate("/login")
  }

  const firstNameInitial = session?.name?.[0]?.toUpperCase() ?? "?"

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
          <div className="flex items-center gap-2 px-1 py-1 mb-1">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
              {firstNameInitial}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{session?.name ?? "..."}</p>
              <p className="text-[0.625rem] text-muted-foreground truncate">{session?.email ?? ""}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <span>↩</span>
            <span>Sair</span>
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
