import {
  ProvidedService as PrismaProvidedService,
  Service as PrismaService,
  User,
} from '@prisma/client'
import { ProvidedServiceDetails } from '@/app/entities/value-objects/provided-service-details.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

type PrismaProvidedServiceDetails = PrismaProvidedService & {
  barber: User
  client: User
  service: PrismaService
}

export class PrismaProvidedServiceDetailsMapper {
  static toDomain(raw: PrismaProvidedServiceDetails): ProvidedServiceDetails {
    return ProvidedServiceDetails.create({
      providedServiceId: new UniqueEntityID(raw.id),
      barberId: new UniqueEntityID(raw.barberId),
      barber: raw.barber.name,
      clientId: new UniqueEntityID(raw.clientId),
      client: raw.client.name,
      serviceId: new UniqueEntityID(raw.serviceId),
      service: raw.service.name,
      valueInCents: raw.valueInCents,
      createdAt: raw.createdAt,
    })
  }
}
