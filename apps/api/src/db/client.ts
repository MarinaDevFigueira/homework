import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => new PrismaClient()

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

const isNotProduction = process.env.NODE_ENV !== 'production'
if (isNotProduction) {
  globalThis.prisma = prisma
}

export { prisma }
