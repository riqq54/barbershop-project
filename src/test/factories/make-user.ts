import { faker } from '@faker-js/faker'
import { User, type UserProps } from '@/app/entities/user.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

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
