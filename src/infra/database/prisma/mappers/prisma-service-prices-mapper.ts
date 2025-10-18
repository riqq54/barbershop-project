import { Prisma, ServicePrice as PrismaServicePrice } from '@prisma/client'
import { ServicePrice } from '@/app/entities/service-price.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export class PrismaServicePricesMapper {
  static toDomain(raw: PrismaServicePrice): ServicePrice {
    return ServicePrice.create(
      {
        serviceId: new UniqueEntityID(raw.serviceId),
        valueInCents: raw.valueInCents,
        startDate: raw.startDate,
        endDate: raw.endDate,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrismaNested(
    servicePrice: ServicePrice
  ): Prisma.ServicePriceCreateWithoutServiceInput {
    return {
      id: servicePrice.id.toString(),
      valueInCents: servicePrice.valueInCents,
      startDate: servicePrice.startDate,
      endDate: servicePrice.endDate,
    }
  }
}
