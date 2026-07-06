import { prisma } from '../db/client.ts'

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async updateRole(id: string, role: string) {
    return prisma.user.update({ where: { id }, data: { role } })
  }

  async remove(id: string) {
    return prisma.user.delete({ where: { id } })
  }
}

export const userRepository = new UserRepository()
