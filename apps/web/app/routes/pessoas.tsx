import { useEffect, useState } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { User } from "@homework/types/user.interface"
import { UserRole } from "@homework/types/user.enum"
import { listUsers } from "~/lib/services/users.service.server"
import { usersService } from "~/lib/services/users.service"
import { useAuth } from "~/lib/hooks/use-auth"
import { PageHeader, PageHeaderContent, PageHeaderTitle } from "~/components/ui/page-header"
import { Avatar } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { StatusBadge } from "~/components/ui/status-badge"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await listUsers(request)
  return { users }
}

const ROLE_BADGE_VARIANT: Record<UserRole, "admin" | "resident"> = {
  [UserRole.Admin]: "admin",
  [UserRole.Morador]: "resident",
}

const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.Admin]: "Admin",
  [UserRole.Morador]: "Morador",
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const firstInitial = parts[0]?.[0] ?? ""
  const lastInitial = parts[parts.length - 1]?.[0] ?? ""
  const isDifferentParts = parts.length > 1
  const initials = isDifferentParts ? firstInitial + lastInitial : firstInitial
  return initials.toUpperCase()
}

export default function Pessoas() {
  const { users: loaderUsers } = useLoaderData<typeof loader>()
  const [users, setUsers] = useState<User[]>(loaderUsers)
  const { session } = useAuth()

  useEffect(() => {
    setUsers(loaderUsers)
  }, [loaderUsers])

  const isCurrentUserAdmin = session?.role === UserRole.Admin
  const hasUsers = users.length > 0

  async function handleToggleRole(user: User) {
    const nextRole = user.role === UserRole.Admin ? UserRole.Morador : UserRole.Admin
    const updated = await usersService.updateRole(user.id, nextRole)
    const isSuccess = !!updated
    if (isSuccess) {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)))
    }
  }

  async function handleRemove(userId: string) {
    const isConfirmed = window.confirm("Remover este usuário do sistema?")
    if (!isConfirmed) return
    await usersService.remove(userId)
    setUsers(users.filter((u) => u.id !== userId))
  }

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Pessoas</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>

      {hasUsers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const badgeVariant = ROLE_BADGE_VARIANT[user.role]
            const label = ROLE_LABEL[user.role]
            const initials = getInitials(user.name)
            const isSelf = session?.id === user.id
            return (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar initials={initials} size="md" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <StatusBadge variant={badgeVariant} className="mt-1">
                      {label}
                    </StatusBadge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                {isCurrentUserAdmin && !isSelf && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleRole(user)}
                    >
                      {user.role === UserRole.Admin ? "Rebaixar" : "Promover"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(user.id)}
                    >
                      Remover
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon>👥</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma pessoa encontrada</EmptyStateTitle>
          <EmptyStateDescription>Não há usuários cadastrados no sistema.</EmptyStateDescription>
        </EmptyState>
      )}
    </>
  )
}
