import { Prisma } from '@prisma/client'
import { Service } from '@/app/entities/service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { PrismaServicePricesMapper } from './prisma-service-prices-mapper.ts'

export class PrismaServicesMapper {
  static toDomain(
    raw: Prisma.ServiceGetPayload<{ include: { servicePrices: true } }>
  ): Service {
    const servicePrices = raw.servicePrices.map((servicePrice) =>
      PrismaServicePricesMapper.toDomain(servicePrice)
    )

    return Service.create(
      {
        name: raw.name,
        description: raw.description,
        servicePrices,
        durationInMinutes: raw.durationInMinutes,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(service: Service): Prisma.ServiceCreateInput {
    const servicePrices = service.servicePrices.map((servicePrice) =>
      PrismaServicePricesMapper.toPrismaNested(servicePrice)
    )

    return {
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      durationInMinutes: service.durationInMinutes,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt,

      servicePrices: {
        create: servicePrices,
      },
    }
  }
}
