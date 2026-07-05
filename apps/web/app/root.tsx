import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router"

import type { Route } from "./+types/root"
import { buildHomeMeta } from "~/lib/seo"
import "./app.css"

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Homework",
  description:
    "Gerencie atividades domésticas, controle recursos e acompanhe tarefas dos moradores de forma simples e colaborativa.",
  url: "https://homework.app",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web Browser",
  inLanguage: "pt-BR",
}

const webAppSchemaJson = JSON.stringify(webAppSchema)

export function meta() {
  return buildHomeMeta()
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a3d34" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Homework" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: webAppSchemaJson }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Erro"
  let details = "Ocorreu um erro inesperado."
  let stack: string | undefined

  const isRouteError = isRouteErrorResponse(error)

  if (isRouteError) {
    const isNotFound = error.status === 404
    message = isNotFound ? "404 — Página não encontrada" : "Erro"
    details = isNotFound
      ? "A página solicitada não existe."
      : error.statusText || details
  } else {
    const isDev = import.meta.env.DEV
    const isError = error instanceof Error
    const hasDevError = isDev && isError
    if (hasDevError) {
      details = error.message
      stack = error.stack
    }
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
