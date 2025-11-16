import {
  Prisma,
  ProvidedService as PrismaProvidedService,
} from '@prisma/client'
import { ProvidedService } from '@/app/entities/provided-service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export class PrismaProvidedServicesMapper {
  static toDomain(raw: PrismaProvidedService): ProvidedService {
    return ProvidedService.create({
      barberId: new UniqueEntityID(raw.barberId),
      clientId: new UniqueEntityID(raw.clientId),
      serviceId: new UniqueEntityID(raw.serviceId),
      valueInCents: raw.valueInCents,
      createdAt: raw.createdAt,
    })
  }
  static toPrisma(
    providedService: ProvidedService
  ): Prisma.ProvidedServiceUncheckedCreateInput {
    return {
      id: providedService.id.toString(),
      barberId: providedService.barberId.toString(),
      clientId: providedService.clientId.toString(),
      serviceId: providedService.serviceId.toString(),
      valueInCents: providedService.valueInCents,
      createdAt: providedService.createdAt,
    }
  }
}
