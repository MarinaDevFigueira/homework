import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/password.ts'
import { UserRole } from '@homework/types/user.enum'
import { ResourceCategory } from '@homework/types/resource-category.enum'
import { TaskStatus } from '@homework/types/task.enum'
import { RecurringFrequency } from '@homework/types/recurring.enum'

const prisma = new PrismaClient()

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000)
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000)

// ── Users ──────────────────────────────────────────────────────────────────

const SEED_USERS = [
  { name: 'Administrador',  email: 'admin@homework.local',   password: 'admin123',   role: UserRole.Admin    },
  { name: 'Morador Demo',   email: 'morador@homework.local', password: 'morador123', role: UserRole.Morador  },
  { name: 'João Silva',     email: 'joao@homework.local',    password: 'joao123',    role: UserRole.Morador  },
  { name: 'Maria Souza',    email: 'maria@homework.local',   password: 'maria123',   role: UserRole.Morador  },
  { name: 'Pedro Costa',    email: 'pedro@homework.local',   password: 'pedro123',   role: UserRole.Morador  },
]

// ── Resources ─────────────────────────────────────────────────────────────

type SeedResource = {
  name: string
  category: ResourceCategory
  unit: string
  notes?: string
  minUnits: number
  instances: number[]
}

const SEED_RESOURCES: SeedResource[] = [
  // Limpeza
  { name: 'Detergente Multiuso',  category: ResourceCategory.Limpeza,     unit: 'un',   minUnits: 2, instances: [100, 100, 100, 100, 60] },
  { name: 'Esponja de Limpeza',   category: ResourceCategory.Limpeza,     unit: 'un',   minUnits: 3, instances: [100, 100] },        // 2 < mínimo 3
  { name: 'Água Sanitária',       category: ResourceCategory.Limpeza,     unit: 'L',    minUnits: 2, instances: [100, 80, 40]  },
  { name: 'Sabão em Pó',          category: ResourceCategory.Limpeza,     unit: 'kg',   minUnits: 1, instances: [100, 100]    },
  { name: 'Pano de Chão',         category: ResourceCategory.Limpeza,     unit: 'un',   minUnits: 2, instances: [70, 40]      },
  { name: 'Desinfetante',         category: ResourceCategory.Limpeza,     unit: 'L',    minUnits: 2, instances: [100, 60, 20] },
  // Higiene
  { name: 'Pasta de Dente',       category: ResourceCategory.Higiene,     unit: 'un',   minUnits: 2, instances: [100, 100, 100, 50] },
  { name: 'Desodorante',          category: ResourceCategory.Higiene,     unit: 'un',   minUnits: 2, instances: [50, 50, 50, 50]   },
  { name: 'Papel Higiênico',      category: ResourceCategory.Higiene,     unit: 'rolo', minUnits: 6, instances: [100, 100, 100]    }, // 3 rolos < mínimo 6
  { name: 'Sabonete Líquido',     category: ResourceCategory.Higiene,     unit: 'un',   minUnits: 2, instances: [100, 80]          },
  // Alimentação
  { name: 'Biscoito',             category: ResourceCategory.Alimentacao, unit: 'cx',   minUnits: 1, instances: [100, 50]    },
  { name: 'Arroz',                category: ResourceCategory.Alimentacao, unit: 'kg',   minUnits: 2, instances: [80, 80, 60] },
  { name: 'Azeite de Oliva',      category: ResourceCategory.Alimentacao, unit: 'un',   minUnits: 1, instances: [60]         },
  // Manutenção
  { name: 'Lâmpada LED',          category: ResourceCategory.Manutencao,  unit: 'un',   minUnits: 3, instances: [100, 100, 100, 100] },
  { name: 'Fita Isolante',        category: ResourceCategory.Manutencao,  unit: 'un',   minUnits: 1, instances: [100]               },
  // Jardinagem
  { name: 'Adubo',                category: ResourceCategory.Jardinagem,  unit: 'kg',   minUnits: 1, instances: [80, 40] },
]

// ── Tasks ─────────────────────────────────────────────────────────────────

type SeedTask = {
  title: string
  description?: string
  status: TaskStatus
  dueDate?: Date
  completedAt?: Date
  startedAt?: Date
  durationMinutes?: number
  assigneeKey: string
  creatorKey: string
}

const SEED_TASKS: SeedTask[] = [
  // Concluídas — com histórico de duração
  {
    title: 'Lavar louça',
    status: TaskStatus.Done,
    startedAt: daysAgo(1), completedAt: daysAgo(1), durationMinutes: 20,
    assigneeKey: 'morador', creatorKey: 'admin',
  },
  {
    title: 'Limpar banheiro principal',
    description: 'Incluindo espelho e box',
    status: TaskStatus.Done,
    startedAt: daysAgo(3), completedAt: daysAgo(3), durationMinutes: 45,
    assigneeKey: 'maria', creatorKey: 'admin',
  },
  {
    title: 'Comprar mantimentos',
    description: 'Arroz, feijão, azeite e biscoitos',
    status: TaskStatus.Done,
    completedAt: daysAgo(5), durationMinutes: 60,
    assigneeKey: 'joao', creatorKey: 'admin',
  },
  {
    title: 'Trocar filtro do purificador',
    status: TaskStatus.Done,
    completedAt: daysAgo(7), durationMinutes: 15,
    assigneeKey: 'pedro', creatorKey: 'pedro',
  },
  {
    title: 'Organizar despensa',
    description: 'Vencer produtos, reorganizar prateleiras',
    status: TaskStatus.Done,
    startedAt: daysAgo(10), completedAt: daysAgo(10), durationMinutes: 35,
    assigneeKey: 'maria', creatorKey: 'maria',
  },
  // Em andamento
  {
    title: 'Instalar prateleira na cozinha',
    status: TaskStatus.InProgress,
    startedAt: daysAgo(0), dueDate: daysFromNow(1),
    assigneeKey: 'joao', creatorKey: 'joao',
  },
  {
    title: 'Pintar parede da sala',
    description: 'Tinta bege — 2 demãos',
    status: TaskStatus.InProgress,
    startedAt: daysAgo(2), dueDate: daysFromNow(5),
    assigneeKey: 'morador', creatorKey: 'admin',
  },
  {
    title: 'Organizar quarto de ferramentas',
    status: TaskStatus.InProgress,
    startedAt: daysAgo(1), dueDate: daysFromNow(3),
    assigneeKey: 'pedro', creatorKey: 'admin',
  },
  // Pendentes — com prazo futuro
  {
    title: 'Passar aspirador',
    status: TaskStatus.Pending,
    dueDate: daysFromNow(2),
    assigneeKey: 'morador', creatorKey: 'admin',
  },
  {
    title: 'Lavar janelas da sala',
    status: TaskStatus.Pending,
    dueDate: daysFromNow(5),
    assigneeKey: 'maria', creatorKey: 'admin',
  },
  {
    title: 'Revisar extintores',
    description: 'Verificar validade e carga de todos os extintores',
    status: TaskStatus.Pending,
    dueDate: daysFromNow(10),
    assigneeKey: 'admin', creatorKey: 'admin',
  },
  {
    title: 'Trocar lâmpada da cozinha',
    status: TaskStatus.Pending,
    dueDate: daysFromNow(1),
    assigneeKey: 'joao', creatorKey: 'morador',
  },
  {
    title: 'Limpar geladeira',
    status: TaskStatus.Pending,
    dueDate: daysFromNow(7),
    assigneeKey: 'pedro', creatorKey: 'admin',
  },
  {
    title: 'Reformar área de serviço',
    description: 'Aguardando orçamento do pedreiro',
    status: TaskStatus.Pending,
    dueDate: daysFromNow(30),
    assigneeKey: 'admin', creatorKey: 'admin',
  },
  // Atrasadas — prazo vencido
  {
    title: 'Desentupir pia do banheiro',
    status: TaskStatus.Overdue,
    dueDate: daysAgo(3),
    assigneeKey: 'morador', creatorKey: 'admin',
  },
  {
    title: 'Renovar seguro do apartamento',
    description: 'Contato: corretora Segura+',
    status: TaskStatus.Overdue,
    dueDate: daysAgo(7),
    assigneeKey: 'admin', creatorKey: 'admin',
  },
  {
    title: 'Limpar caixa d\'água',
    status: TaskStatus.Overdue,
    dueDate: daysAgo(14),
    assigneeKey: 'pedro', creatorKey: 'admin',
  },
  // Canceladas
  {
    title: 'Contratar faxineira extra',
    status: TaskStatus.Cancelled,
    assigneeKey: 'admin', creatorKey: 'admin',
  },
  {
    title: 'Trocar sofá da sala',
    description: 'Cancelado — decidimos recuperar o atual',
    status: TaskStatus.Cancelled,
    assigneeKey: 'morador', creatorKey: 'admin',
  },
]

// ── Purchases ─────────────────────────────────────────────────────────────

type SeedPurchase = {
  title: string
  amount: number
  month: string
  paidByKey: string
}

const SEED_PURCHASES: SeedPurchase[] = [
  // Maio 2026
  { title: 'Mercado — compra mensal',   amount: 487.90, month: '2026-05', paidByKey: 'admin'   },
  { title: 'Conta de luz',              amount: 213.40, month: '2026-05', paidByKey: 'morador' },
  { title: 'Condomínio',                amount: 680.00, month: '2026-05', paidByKey: 'admin'   },
  // Junho 2026
  { title: 'Mercado — compra mensal',   amount: 523.15, month: '2026-06', paidByKey: 'joao'    },
  { title: 'Conta de luz',              amount: 198.70, month: '2026-06', paidByKey: 'maria'   },
  { title: 'Condomínio',                amount: 680.00, month: '2026-06', paidByKey: 'admin'   },
  { title: 'Produtos de limpeza',       amount:  94.50, month: '2026-06', paidByKey: 'pedro'   },
  { title: 'Reparo torneira cozinha',   amount: 150.00, month: '2026-06', paidByKey: 'admin'   },
  // Julho 2026
  { title: 'Mercado — compra mensal',   amount: 501.30, month: '2026-07', paidByKey: 'morador' },
  { title: 'Conta de luz',              amount: 224.80, month: '2026-07', paidByKey: 'joao'    },
  { title: 'Condomínio',                amount: 680.00, month: '2026-07', paidByKey: 'admin'   },
  { title: 'Internet',                  amount: 119.90, month: '2026-07', paidByKey: 'maria'   },
]

// ── Recurring Templates ───────────────────────────────────────────────────

type SeedRecurring = {
  title: string
  description?: string
  frequency: RecurringFrequency
  nextDueOffsetDays: number
  isActive: boolean
  assigneeKey: string
}

const SEED_RECURRING: SeedRecurring[] = [
  { title: 'Lavar louça',           frequency: RecurringFrequency.Daily,     nextDueOffsetDays: 1,  isActive: true,  assigneeKey: 'morador' },
  { title: 'Tirar o lixo',          frequency: RecurringFrequency.Daily,     nextDueOffsetDays: 1,  isActive: true,  assigneeKey: 'joao'    },
  { title: 'Passar aspirador',      description: 'Sala e corredores',
                                    frequency: RecurringFrequency.Weekly,    nextDueOffsetDays: 5,  isActive: true,  assigneeKey: 'maria'   },
  { title: 'Limpar banheiros',      description: 'Todos os banheiros da casa',
                                    frequency: RecurringFrequency.Weekly,    nextDueOffsetDays: 3,  isActive: true,  assigneeKey: 'pedro'   },
  { title: 'Comprar mantimentos',   frequency: RecurringFrequency.Biweekly,  nextDueOffsetDays: 10, isActive: true,  assigneeKey: 'admin'   },
  { title: 'Pagar condomínio',      frequency: RecurringFrequency.Monthly,   nextDueOffsetDays: 15, isActive: true,  assigneeKey: 'admin'   },
  { title: 'Verificar extintores',  frequency: RecurringFrequency.Monthly,   nextDueOffsetDays: 20, isActive: false, assigneeKey: 'admin'   },
]

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...\n')

  // 1. Upsert users — coletar IDs por prefixo de email
  const userIdByKey: Record<string, string> = {}
  for (const userData of SEED_USERS) {
    const passwordHash = hashPassword(userData.password)
    const userPayload = {
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: userData.role,
    }
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userPayload,
    })
    const emailKey = userData.email.split('@')[0]
    userIdByKey[emailKey] = user.id
    console.log(`✅ Usuário: ${user.email} (${user.role})`)
  }

  // 2. Limpar dados transacionais em ordem segura (respeitar FK constraints)
  console.log('\n🗑️  Limpando dados anteriores...')
  await prisma.resourceSnapshot.deleteMany()
  await prisma.taskResource.deleteMany()
  await prisma.resourceBooking.deleteMany()
  await prisma.task.deleteMany()
  await prisma.recurringTemplate.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.resourceInstance.deleteMany()
  await prisma.resource.deleteMany()

  // 3. Criar resources
  console.log('\n📦 Criando recursos...')
  const adminId = userIdByKey['admin']
  for (const resourceData of SEED_RESOURCES) {
    const notes = resourceData.notes ?? null
    const resourcePayload = {
      name: resourceData.name,
      category: resourceData.category,
      unit: resourceData.unit,
      notes,
      minUnits: resourceData.minUnits,
      createdById: adminId,
    }
    const resource = await prisma.resource.create({ data: resourcePayload })
    for (const capacity of resourceData.instances) {
      await prisma.resourceInstance.create({
        data: { resourceId: resource.id, capacity },
      })
    }
    console.log(`  ✅ ${resource.name} — ${resourceData.instances.length} instâncias`)
  }

  // 4. Criar recurring templates
  console.log('\n🔄 Criando tarefas recorrentes...')
  for (const recurringData of SEED_RECURRING) {
    const assigneeId = userIdByKey[recurringData.assigneeKey]
    const nextDue = daysFromNow(recurringData.nextDueOffsetDays)
    const description = recurringData.description ?? null
    const recurringPayload = {
      title: recurringData.title,
      description,
      frequency: recurringData.frequency,
      nextDue,
      isActive: recurringData.isActive,
      assignedToId: assigneeId,
    }
    const template = await prisma.recurringTemplate.create({ data: recurringPayload })
    const activeLabel = template.isActive ? 'ativa' : 'inativa'
    console.log(`  ✅ ${template.title} — ${template.frequency} (${activeLabel})`)
  }

  // 5. Criar tasks
  console.log('\n📋 Criando tarefas...')
  for (const taskData of SEED_TASKS) {
    const assigneeId = userIdByKey[taskData.assigneeKey]
    const creatorId = userIdByKey[taskData.creatorKey] ?? adminId
    const description = taskData.description ?? null
    const dueDate = taskData.dueDate ?? null
    const completedAt = taskData.completedAt ?? null
    const startedAt = taskData.startedAt ?? null
    const durationMinutes = taskData.durationMinutes ?? null
    const taskPayload = {
      title: taskData.title,
      description,
      status: taskData.status,
      dueDate,
      completedAt,
      startedAt,
      durationMinutes,
      isRecurring: false,
      assignedToId: assigneeId,
      createdById: creatorId,
    }
    const task = await prisma.task.create({ data: taskPayload })
    console.log(`  ✅ ${task.title} — ${task.status}`)
  }

  // 6. Criar purchases
  console.log('\n💳 Criando compras...')
  for (const purchaseData of SEED_PURCHASES) {
    const paidById = userIdByKey[purchaseData.paidByKey]
    const purchasePayload = {
      title: purchaseData.title,
      amount: purchaseData.amount,
      month: purchaseData.month,
      paidById,
    }
    await prisma.purchase.create({ data: purchasePayload })
    console.log(`  ✅ ${purchaseData.title} — R$ ${purchaseData.amount.toFixed(2)} (${purchaseData.month})`)
  }

  console.log('\n✅ Seed concluído com sucesso.\n')
  console.log('  Usuários disponíveis:')
  for (const userData of SEED_USERS) {
    console.log(`    ${userData.email}  /  ${userData.password}`)
  }
}

main()
  .catch((error) => {
    console.error('❌ Erro no seed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
