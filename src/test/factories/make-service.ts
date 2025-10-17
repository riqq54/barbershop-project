import { faker } from '@faker-js/faker'
import { Service, ServiceProps } from '@/app/entities/service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export function makeService(
  override: Partial<ServiceProps> = {},
  id?: UniqueEntityID
) {
  const service = Service.create(
    {
      name: faker.lorem.word(),
      valueInCents: faker.number.int({ min: 1000, max: 15_000 }),
      durationInMinutes: faker.number.int({ min: 25, max: 90 }),
      description: faker.lorem.sentence(),
      ...override,
    },
    id
  )

  return service
}
