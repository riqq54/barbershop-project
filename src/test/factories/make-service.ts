import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { Service, ServiceProps } from '@/app/entities/service.ts'
import { ServicePrice } from '@/app/entities/service-price.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaServicesMapper } from '@/infra/database/prisma/mappers/prisma-services-mapper.ts'

interface MakeServiceOverride extends Partial<ServiceProps> {
  initialValueInCents?: number
}
export function makeService(
  override: MakeServiceOverride = {},
  id?: UniqueEntityID
) {
  const service = Service.create(
    {
      name: faker.lorem.word(),
      durationInMinutes: faker.number.int({ min: 25, max: 90 }),
      description: faker.lorem.sentence(),
      servicePrices: [],
      ...override,
    },
    id
  )

  const servicePrice = ServicePrice.create({
    serviceId: service.id,
    valueInCents:
      override.initialValueInCents ??
      faker.number.int({ min: 1500, max: 15_000 }),
  })

  service.servicePrices.push(servicePrice)

  return service
}

export class ServiceFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaService(data: MakeServiceOverride = {}): Promise<Service> {
    const service = makeService(data)

    await this.prisma.service.create({
      data: PrismaServicesMapper.toPrisma(service),
    })

    return service
  }
}
