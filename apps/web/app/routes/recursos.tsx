import { PageHeader, PageHeaderContent, PageHeaderTitle } from "~/components/ui/page-header"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"

export default function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Recursos</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>
      <EmptyState>
        <EmptyStateIcon>📦</EmptyStateIcon>
        <EmptyStateTitle>Em breve</EmptyStateTitle>
        <EmptyStateDescription>Esta seção está em desenvolvimento.</EmptyStateDescription>
      </EmptyState>
    </>
  )
}
