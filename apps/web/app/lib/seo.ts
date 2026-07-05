import type { MetaDescriptor } from "react-router"

const SITE_NAME = "Homework"
const SITE_URL = "https://homework.app"
const DEFAULT_DESCRIPTION =
  "Gerencie atividades domésticas, controle recursos e acompanhe tarefas dos moradores de forma simples e colaborativa."

interface SeoOptions {
  title: string
  description?: string
  path?: string
  noIndex?: boolean
}

export function buildMeta(options: SeoOptions): MetaDescriptor[] {
  const { title, description, path, noIndex } = options

  const resolvedDescription = description ?? DEFAULT_DESCRIPTION
  const pageTitle = `${title} | ${SITE_NAME}`
  const canonicalUrl = path ? `${SITE_URL}${path}` : SITE_URL

  const baseMeta: MetaDescriptor[] = [
    { title: pageTitle },
    { name: "description", content: resolvedDescription },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: resolvedDescription },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "pt_BR" },
  ]

  const isNoIndex = noIndex === true
  const robotsMeta: MetaDescriptor[] = isNoIndex
    ? [{ name: "robots", content: "noindex, nofollow" }]
    : []

  return [...baseMeta, ...robotsMeta]
}

export function buildHomeMeta(): MetaDescriptor[] {
  const homeTitle = SITE_NAME
  const homeDescription = DEFAULT_DESCRIPTION
  const homeUrl = SITE_URL

  const homeMeta: MetaDescriptor[] = [
    { title: homeTitle },
    { name: "description", content: homeDescription },
    { tagName: "link", rel: "canonical", href: homeUrl },
    { property: "og:title", content: homeTitle },
    { property: "og:description", content: homeDescription },
    { property: "og:url", content: homeUrl },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: homeTitle },
    { property: "og:locale", content: "pt_BR" },
  ]

  return homeMeta
}
