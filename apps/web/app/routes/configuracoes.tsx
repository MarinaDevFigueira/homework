import { useNavigate } from "react-router"
import { authStore } from "~/lib/stores/auth.store"
import { authService } from "~/lib/services/auth.service"
import { useTheme } from "~/lib/hooks/use-theme"
import { PageHeader, PageHeaderContent, PageHeaderTitle } from "~/components/ui/page-header"
import { Button } from "~/components/ui/button"
import { FilterChips, FilterChip } from "~/components/ui/filter-chips"

const THEME_OPTIONS = [
  { value: "light", label: "☀️ Claro" },
  { value: "dark",  label: "🌙 Escuro" },
  { value: "system", label: "💻 Sistema" },
] as const

export default function Configuracoes() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    await authService.logout()
    authStore.clear()
    navigate("/login")
  }

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Configurações</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="max-w-md">
        <div className="border rounded-lg p-6 mb-4">
          <h3 className="font-semibold mb-4">Sobre</h3>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Versão: 1.0.0</p>
            <p>Gerenciador de tarefas domésticas</p>
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-4">
          <h3 className="font-semibold mb-4">Tema</h3>
          <FilterChips>
            {THEME_OPTIONS.map((option) => {
              const isActive = theme === option.value
              return (
                <FilterChip
                  key={option.value}
                  active={isActive}
                  onClick={() => setTheme(option.value)}
                  className="flex-1 justify-center"
                >
                  {option.label}
                </FilterChip>
              )
            })}
          </FilterChips>
        </div>

        <div className="border rounded-lg p-6">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sair
          </Button>
        </div>
      </div>
    </>
  )
}
