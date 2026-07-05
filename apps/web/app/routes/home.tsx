import { Button } from "~/components/ui/button"
import { buildHomeMeta } from "~/lib/seo"

export function meta() {
  return buildHomeMeta()
}

export default function Home() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Homework</h1>
          <p>Gestão colaborativa de atividades domésticas.</p>
          <Button className="mt-2">Entrar</Button>
        </div>
      </div>
    </div>
  )
}
