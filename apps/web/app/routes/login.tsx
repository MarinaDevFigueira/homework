import { useState } from "react"
import { redirect, useNavigate } from "react-router"
import { z } from "zod"
import type { Route } from "./+types/login"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { authStore } from "~/lib/stores/auth.store"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? ""
  const hasAuthCookie = cookieHeader.includes("auth_token=")
  if (hasAuthCookie) {
    throw redirect("/")
  }
  return null
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError("")
    setErrors({})

    const parseResult = loginSchema.safeParse({ email, password })
    const hasValidationErrors = !parseResult.success

    if (hasValidationErrors) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parseResult.error.issues) {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setIsPending(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001"
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const body = await response.json()
      const isSuccess = response.ok && body.data

      if (!isSuccess) {
        setServerError(body.error ?? "Erro ao entrar")
        return
      }

      authStore.set(body.data)
      navigate("/")
    } catch {
      setServerError("Erro de conexão")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary text-2xl text-primary-foreground">
            🏠
          </div>
          <h1 className="text-xl font-bold">Homework</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Gestão colaborativa de atividades domésticas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="text-xs text-destructive">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span className="text-xs text-destructive">{errors.password}</span>
            )}
          </div>

          {serverError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isPending} size="lg" className="mt-1 w-full">
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
