import { useEffect, useState } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { Resource } from "@homework/types/resource.interface"
import { ResourceCategory } from "@homework/types/resource-category.enum"
import { listResources } from "~/lib/services/resources.service.server"
import { resourcesService } from "~/lib/services/resources.service"
import type { ResourceCardViewProps } from "~/routes/recursos.types"
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderAction } from "~/components/ui/page-header"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "~/components/ui/dialog"
import { StatusBadge } from "~/components/ui/status-badge"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"
import {
  ResourceCard,
  ResourceCardHeader,
  ResourceCardIcon,
  ResourceCardName,
  ResourceCardMeta,
  ResourceCardInstances,
  ResourceCardInstanceRow,
  ResourceCardInstanceLabel,
  CapacityBar,
  ResourceCardPercent,
} from "~/components/ui/resource-card"

export async function loader({ request }: LoaderFunctionArgs) {
  const resources = await listResources(request)
  return { resources }
}

const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  [ResourceCategory.Limpeza]: "Limpeza",
  [ResourceCategory.Manutencao]: "Manutenção",
  [ResourceCategory.Alimentacao]: "Alimentação",
  [ResourceCategory.Jardinagem]: "Jardinagem",
  [ResourceCategory.Higiene]: "Higiene",
  [ResourceCategory.Outro]: "Outro",
}

const CATEGORY_ICON: Record<ResourceCategory, string> = {
  [ResourceCategory.Limpeza]: "🧴",
  [ResourceCategory.Manutencao]: "🔧",
  [ResourceCategory.Alimentacao]: "🍽️",
  [ResourceCategory.Jardinagem]: "🌱",
  [ResourceCategory.Higiene]: "🪥",
  [ResourceCategory.Outro]: "📦",
}

const CATEGORY_OPTIONS = Object.values(ResourceCategory)

function ResourceCardView({ resource, onAddInstance }: ResourceCardViewProps) {
  const categoryLabel = CATEGORY_LABEL[resource.category]
  const categoryIcon = CATEGORY_ICON[resource.category]
  const activeUnits = resource.instances.filter((instance) => instance.capacity > 0).length
  const isBelowMin = activeUnits <= resource.minUnits
  const hasInstances = resource.instances.length > 0

  const activeUnitsText = isBelowMin
    ? `⚠️ ${activeUnits} un. ativas`
    : `${activeUnits} un. ativas`

  return (
    <ResourceCard low={isBelowMin}>
      <ResourceCardHeader>
        <ResourceCardIcon low={isBelowMin}>{categoryIcon}</ResourceCardIcon>
        <div className="min-w-0 flex-1">
          <ResourceCardName>{resource.name}</ResourceCardName>
          <ResourceCardMeta>
            <StatusBadge variant="brand" className="mr-1">{categoryLabel}</StatusBadge>
            · min: {resource.minUnits}
          </ResourceCardMeta>
        </div>
      </ResourceCardHeader>

      <ResourceCardMeta className="mb-2 font-medium">{activeUnitsText}</ResourceCardMeta>

      {hasInstances && (
        <ResourceCardInstances>
          {resource.instances.map((instance, index) => {
            const isLow = instance.capacity < 30
            const isWarn = instance.capacity >= 30 && instance.capacity < 70
            return (
              <ResourceCardInstanceRow key={instance.id}>
                <ResourceCardInstanceLabel>Un.{index + 1}</ResourceCardInstanceLabel>
                <CapacityBar percent={instance.capacity} low={isLow} warn={isWarn} />
                <ResourceCardPercent>{instance.capacity}%</ResourceCardPercent>
              </ResourceCardInstanceRow>
            )
          })}
        </ResourceCardInstances>
      )}

      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full text-xs"
        onClick={() => onAddInstance(resource.id)}
      >
        + Adicionar unidade
      </Button>
    </ResourceCard>
  )
}

export default function Recursos() {
  const { resources: loaderResources } = useLoaderData<typeof loader>()
  const [resources, setResources] = useState<Resource[]>(loaderResources)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newCategory, setNewCategory] = useState<ResourceCategory>(ResourceCategory.Outro)
  const [newUnit, setNewUnit] = useState("un")
  const [newMinUnits, setNewMinUnits] = useState("2")
  const [newInitialCount, setNewInitialCount] = useState("1")
  const [newNotes, setNewNotes] = useState("")

  useEffect(() => {
    setResources(loaderResources)
  }, [loaderResources])

  async function handleCreate() {
    const isNameEmpty = newName.trim() === ""
    if (isNameEmpty) return

    const parsedMinUnits = parseInt(newMinUnits, 10)
    const parsedInitialCount = parseInt(newInitialCount, 10)
    const minUnits = isNaN(parsedMinUnits) ? 2 : parsedMinUnits
    const initialCount = isNaN(parsedInitialCount) ? 1 : parsedInitialCount

    const created = await resourcesService.create({
      name: newName.trim(),
      category: newCategory,
      unit: newUnit.trim() || "un",
      notes: newNotes.trim() || undefined,
      minUnits,
      initialCount,
    })

    const isSuccess = !!created
    if (isSuccess) {
      setResources([...resources, created])
      setNewName("")
      setNewCategory(ResourceCategory.Outro)
      setNewUnit("un")
      setNewMinUnits("2")
      setNewInitialCount("1")
      setNewNotes("")
      setIsCreating(false)
    }
  }

  async function handleAddInstance(resourceId: string) {
    const instance = await resourcesService.addInstance(resourceId)
    const isSuccess = !!instance
    if (isSuccess) {
      const updatedResources = resources.map((resource) => {
        const isMatch = resource.id === resourceId
        if (!isMatch) return resource
        const updatedInstances = [...resource.instances, instance]
        const updatedResource = { ...resource, instances: updatedInstances }
        return updatedResource
      })
      setResources(updatedResources)
    }
  }

  const hasResources = resources.length > 0

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Recursos</PageHeaderTitle>
        </PageHeaderContent>
        <PageHeaderAction>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger render={<Button size="sm" />}>+ Novo Recurso</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Recurso</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Nome do recurso"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value as ResourceCategory)}
                    className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>{CATEGORY_LABEL[category]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Unidade</label>
                    <Input
                      placeholder="un, ml, kg…"
                      value={newUnit}
                      onChange={(event) => setNewUnit(event.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Mínimo</label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={newMinUnits}
                      onChange={(event) => setNewMinUnits(event.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Qtd inicial</label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={newInitialCount}
                      onChange={(event) => setNewInitialCount(event.target.value)}
                    />
                  </div>
                </div>
                <Input
                  placeholder="Observações (opcional)"
                  value={newNotes}
                  onChange={(event) => setNewNotes(event.target.value)}
                />
              </div>
              <DialogFooter>
                <Button size="sm" onClick={handleCreate}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeaderAction>
      </PageHeader>

      {hasResources ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCardView
              key={resource.id}
              resource={resource}
              onAddInstance={handleAddInstance}
            />
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon>📦</EmptyStateIcon>
          <EmptyStateTitle>Nenhum recurso encontrado</EmptyStateTitle>
          <EmptyStateDescription>Crie seu primeiro recurso para gerenciar o estoque.</EmptyStateDescription>
        </EmptyState>
      )}
    </>
  )
}
