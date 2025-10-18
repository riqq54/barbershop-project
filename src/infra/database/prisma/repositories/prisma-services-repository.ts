import { Prisma, PrismaClient } from '@prisma/client'
import { Service } from '@/app/entities/service.ts'
import { PaginationParams } from '@/app/repositories/pagination-params.ts'
import {
  FindManyServicesQueryParams,
  ServicesRepository,
} from '@/app/repositories/services-repository.ts'
import { PrismaServicesMapper } from '../mappers/prisma-services-mapper.ts'

export class PrismaServicesRepository implements ServicesRepository {
  constructor(private prisma: PrismaClient) {}

  async create(service: Service): Promise<void> {
    const data = PrismaServicesMapper.toPrisma(service)

    await this.prisma.service.create({ data })
  }

  async findById(id: string): Promise<null | Service> {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        servicePrices: true,
      },
    })

    if (!service) {
      return null
    }

    return PrismaServicesMapper.toDomain(service)
  }

  async findMany(
    { page }: PaginationParams,
    queryParams?: FindManyServicesQueryParams
  ): Promise<{ services: Service[]; totalCount: number }> {
    const whereObject: Prisma.ServiceWhereInput = {}

    whereObject.deletedAt = null

    if (queryParams?.q) {
      whereObject.AND = {
        name: { contains: queryParams?.q, mode: 'insensitive' },
      }
    }

    const services = await this.prisma.service.findMany({
      where: whereObject,
      include: {
        servicePrices: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const totalCount = await this.prisma.service.count({
      where: whereObject,
    })

    return { services: services.map(PrismaServicesMapper.toDomain), totalCount }
  }

  async save(service: Service): Promise<null> {
    const serviceId = service.id.toString()
    const newServicePrice = service.currentValueInCents
    const serviceOnlyUpdateData = PrismaServicesMapper.toPrismaUpdate(service)

    await this.prisma.$transaction(async (tx) => {
      const serviceOnDatabase = await tx.service.findUniqueOrThrow({
        where: {
          id: serviceId,
        },
        include: {
          servicePrices: {
            where: {
              endDate: null,
            },
          },
        },
      })

      const {
        valueInCents: servicePriceOnDatabase,
        id: previousServicePriceId,
      } = serviceOnDatabase.servicePrices[0]

      await tx.service.update({
        where: {
          id: serviceId,
        },
        data: serviceOnlyUpdateData,
      })

      const hasPriceChanged = newServicePrice !== servicePriceOnDatabase

      if (hasPriceChanged) {
        await tx.servicePrice.update({
          where: {
            id: previousServicePriceId,
          },
          data: {
            endDate: new Date(),
          },
        })

        await tx.servicePrice.create({
          data: {
            serviceId,
            valueInCents: newServicePrice,
            startDate: new Date(),
          },
        })
      }
    })

    return null
  }
}
