import {
  Prisma,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from '@prisma/client'
import { User, UserRole } from '@/app/entities/user.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        login: raw.login,
        password: raw.password,
        role: raw.role as UserRole,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      login: user.login,
      password: user.password,
      role: user.role as PrismaUserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
