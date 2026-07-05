import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { AppVariables } from './types/hono.interface.ts'
import { authRoutes } from './routes/auth.ts'

const app = new Hono<{ Variables: AppVariables }>()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.WEB_URL ?? 'http://localhost:5173',
    credentials: true,
  }),
)

app.get('/health', (context) => {
  return context.json({ status: 'ok' })
})

app.route('/auth', authRoutes)

const port = Number(process.env.PORT ?? 3001)

serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`)
})
