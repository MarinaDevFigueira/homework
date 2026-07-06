import { Skeleton } from "~/components/ui/skeleton"

function TarefasSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </>
  )
}

function RecursosSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-1.5 flex-1 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function AgendaSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex}>
            <Skeleton className="h-5 w-20 mb-3" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-card flex items-start gap-3">
                  <Skeleton className="size-7 rounded-full mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ComprasSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-card flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function PessoasSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-card flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function RecorrentesSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-card flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </>
  )
}

function RelatoriosSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6 bg-card">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}

        <div className="border rounded-lg p-6 bg-card md:col-span-2 lg:col-span-4">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </>
  )
}

function ConfiguracoesSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-40" />
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6">
            <Skeleton className="h-5 w-20 mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </>
  )
}

const ROUTE_SKELETON_MAP: Record<string, () => React.ReactNode> = {
  "/": TarefasSkeleton,
  "/recursos": RecursosSkeleton,
  "/agenda": AgendaSkeleton,
  "/compras": ComprasSkeleton,
  "/pessoas": PessoasSkeleton,
  "/relatorios": RelatoriosSkeleton,
  "/recorrentes": RecorrentesSkeleton,
  "/configuracoes": ConfiguracoesSkeleton,
}

interface PageSkeletonProps {
  path: string
}

function PageSkeleton({ path }: PageSkeletonProps) {
  const SkeletonComponent = ROUTE_SKELETON_MAP[path]
  const hasMatchingSkeleton = !!SkeletonComponent
  if (!hasMatchingSkeleton) return null
  return <SkeletonComponent />
}

export { PageSkeleton }
