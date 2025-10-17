import { Prisma, Service as PrismaService } from '@prisma/client'
import { Service } from '@/app/entities/service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
export class PrismaServicesMapper {
  static toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        name: raw.name,
        description: raw.description,
        valueInCents: raw.valueInCents,
        durationInMinutes: raw.durationInMinutes,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      valueInCents: service.valueInCents,
      durationInMinutes: service.durationInMinutes,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt,
    }
  }
}
