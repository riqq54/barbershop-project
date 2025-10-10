import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { User, type UserProps } from '@/app/entities/user.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaUsersMapper } from '@/infra/database/prisma/mappers/prisma-users-mapper.ts'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      login: faker.internet.email(),
      password: faker.internet.password(),
      role: 'CLIENT',
      ...override,
    },
    id
  )

  return user
}

export class UserFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(user),
    })

    return user
  }
}
