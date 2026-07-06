import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/password.ts'
import { UserRole } from '@homework/types/user.enum'
import { ResourceCategory } from '@homework/types/resource-category.enum'

const prisma = new PrismaClient()

const SEED_USERS = [
  {
    name: 'Administrador',
    email: 'admin@homework.local',
    password: 'admin123',
    role: UserRole.Admin,
  },
  {
    name: 'Morador Demo',
    email: 'morador@homework.local',
    password: 'morador123',
    role: UserRole.Morador,
  },
]

type SeedResource = {
  name: string
  category: ResourceCategory
  unit: string
  notes?: string
  minUnits: number
  instances: number[]
}

const SEED_RESOURCES: SeedResource[] = [
  {
    name: 'Detergente Multiuso',
    category: ResourceCategory.Limpeza,
    unit: 'un',
    minUnits: 2,
    instances: [100, 100, 100, 100, 60],
  },
  {
    name: 'Esponja de Limpeza',
    category: ResourceCategory.Limpeza,
    unit: 'un',
    minUnits: 3,
    instances: [100, 100],
  },
  {
    name: 'Pasta de Dente',
    category: ResourceCategory.Higiene,
    unit: 'un',
    minUnits: 2,
    instances: [100, 100, 100, 50],
  },
  {
    name: 'Desodorante',
    category: ResourceCategory.Higiene,
    unit: 'un',
    minUnits: 2,
    instances: [50, 50, 50, 50],
  },
  {
    name: 'Biscoito',
    category: ResourceCategory.Alimentacao,
    unit: 'cx',
    minUnits: 1,
    instances: [100, 50],
  },
]

async function main() {
  console.log('🌱 Iniciando seed...')

  let adminId = ''
  for (const userData of SEED_USERS) {
    const passwordHash = hashPassword(userData.password)
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
      },
    })
    console.log(`✅ Usuário criado: ${user.email} (${user.role})`)
    const isAdmin = userData.role === UserRole.Admin
    if (isAdmin) {
      adminId = user.id
    }
  }

  const hasAdminId = !!adminId
  if (hasAdminId) {
    for (const resourceData of SEED_RESOURCES) {
      const existing = await prisma.resource.findFirst({
        where: { name: resourceData.name },
      })

      const alreadyExists = !!existing
      if (alreadyExists) {
        console.log(`⏭️  Recurso já existe: ${resourceData.name}`)
        continue
      }

      const resource = await prisma.resource.create({
        data: {
          name: resourceData.name,
          category: resourceData.category,
          unit: resourceData.unit,
          notes: resourceData.notes ?? null,
          minUnits: resourceData.minUnits,
          createdById: adminId,
        },
      })

      for (const capacity of resourceData.instances) {
        await prisma.resourceInstance.create({
          data: { resourceId: resource.id, capacity },
        })
      }

      console.log(`✅ Recurso criado: ${resource.name} (${resourceData.instances.length} instâncias)`)
    }
  }

  console.log('✅ Seed concluído.')
}

main()
  .catch((error) => {
    console.error('❌ Erro no seed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
