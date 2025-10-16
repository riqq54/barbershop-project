import { Prisma, PrismaClient } from '@prisma/client'
import { User } from '@/app/entities/user.ts'
import { PaginationParams } from '@/app/repositories/pagination-params.ts'
import {
  FindManyUsersQueryParams,
  UsersRepository,
} from '@/app/repositories/users-repository.ts'
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

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async findMany(
    { page }: PaginationParams,
    queryParams?: FindManyUsersQueryParams
  ): Promise<{ users: User[]; totalCount: number }> {
    const whereObject: Prisma.UserWhereInput = {}

    if (queryParams?.role) {
      whereObject.role = queryParams.role
    }

    if (queryParams?.q) {
      whereObject.OR = [
        {
          name: { contains: queryParams?.q, mode: 'insensitive' },
        },
        {
          login: { contains: queryParams?.q, mode: 'insensitive' },
        },
      ]
    }

    const users = await this.prisma.user.findMany({
      where: whereObject,
      take: 20,
      skip: (page - 1) * 20,
    })

    const totalCount = await this.prisma.user.count({
      where: whereObject,
    })

    return { users: users.map(PrismaUsersMapper.toDomain), totalCount }
  }

  async create(user: User): Promise<void> {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prisma.user.create({ data })
  }
}
