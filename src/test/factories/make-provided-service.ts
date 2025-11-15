import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import {
  ProvidedService,
  ProvidedServiceProps,
} from '@/app/entities/provided-service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaProvidedServicesMapper } from '@/infra/database/prisma/mappers/prisma-provided-services-mapper.ts'

export function makeProvidedService(
  override: Partial<ProvidedServiceProps> = {},
  id?: UniqueEntityID
) {
  const providedService = ProvidedService.create(
    {
      barberId: new UniqueEntityID(),
      clientId: new UniqueEntityID(),
      serviceId: new UniqueEntityID(),
      valueInCents: faker.number.int({ min: 1500, max: 15_000 }),
      ...override,
    },
    id
  )

  return providedService
}

export class ProvidedServiceFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaProvidedService(
    data: Partial<ProvidedServiceProps> = {}
  ): Promise<ProvidedService> {
    const providedService = makeProvidedService(data)

    await this.prisma.providedService.create({
      data: PrismaProvidedServicesMapper.toPrisma(providedService),
    })

    return providedService
  }
}
