import { PrismaClient } from '@prisma/client'
import { User } from '@/app/entities/user.ts'
import { UsersRepository } from '@/app/repositories/users-repository.ts'
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper.ts'

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async findByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prisma.user.create({ data })
  }
}
