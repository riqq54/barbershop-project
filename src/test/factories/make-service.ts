import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { Service, ServiceProps } from '@/app/entities/service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaServicesMapper } from '@/infra/database/prisma/mappers/prisma-services-mapper.ts'

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

export class ServiceFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaService(data: Partial<ServiceProps> = {}): Promise<Service> {
    const service = makeService(data)

    await this.prisma.service.create({
      data: PrismaServicesMapper.toPrisma(service),
    })

    return service
  }
}
