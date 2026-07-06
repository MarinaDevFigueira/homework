import type { LoaderFunctionArgs } from "react-router"

export function loader(_: LoaderFunctionArgs) {
  throw new Response(null, { status: 404 })
}

export default function NotFound() {
  return null
}
