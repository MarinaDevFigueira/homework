import { Hono } from 'hono'
import type { AppVariables } from '../types/hono.interface.ts'

export function createRouter() {
  return new Hono<{ Variables: AppVariables }>()
}
