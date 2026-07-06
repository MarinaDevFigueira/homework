import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  route("login", "routes/login.tsx"),
  layout("routes/_app.tsx", [
    index("routes/tarefas.tsx"),
    route("recursos",       "routes/recursos.tsx"),
    route("agenda",         "routes/agenda.tsx"),
    route("compras",        "routes/compras.tsx"),
    route("pessoas",        "routes/pessoas.tsx"),
    route("relatorios",     "routes/relatorios.tsx"),
    route("recorrentes",    "routes/recorrentes.tsx"),
    route("configuracoes",  "routes/configuracoes.tsx"),
  ]),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig
