import { Prisma, PrismaClient } from '@prisma/client'
import { ProvidedService } from '@/app/entities/provided-service.ts'
import { ProvidedServiceDetails } from '@/app/entities/value-objects/provided-service-details.ts'
import { PaginationParams } from '@/app/repositories/pagination-params.ts'
import {
  FindManyProvidedServicesDetailsByBarberIdQueryParams,
  ProvidedServicesRepository,
} from '@/app/repositories/provided-services-repository.ts'
import { PrismaProvidedServiceDetailsMapper } from '../mappers/prisma-provided-service-details-mapper.ts'
import { PrismaProvidedServicesMapper } from '../mappers/prisma-provided-services-mapper.ts'

export class PrismaProvidedServicesRepository
  implements ProvidedServicesRepository
{
  constructor(private prisma: PrismaClient) {}

  async create(providedService: ProvidedService): Promise<void> {
    const data = PrismaProvidedServicesMapper.toPrisma(providedService)

    await this.prisma.providedService.create({ data })
  }

  async findManyDetailsByBarberId(
    barberId: string,
    { page }: PaginationParams,
    queryParams?: FindManyProvidedServicesDetailsByBarberIdQueryParams
  ): Promise<{
    providedServices: ProvidedServiceDetails[]
    totalCount: number
  }> {
    const whereObject: Prisma.ProvidedServiceWhereInput = {}

    whereObject.barberId = barberId

    if (queryParams?.q) {
      whereObject.OR = [
        {
          client: { name: { contains: queryParams?.q, mode: 'insensitive' } },
        },
        {
          service: { name: { contains: queryParams?.q, mode: 'insensitive' } },
        },
      ]
    }

    const providedServices = await this.prisma.providedService.findMany({
      where: whereObject,
      include: {
        barber: true,
        client: true,
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const totalCount = await this.prisma.providedService.count({
      where: whereObject,
    })

    return {
      providedServices: providedServices.map(
        PrismaProvidedServiceDetailsMapper.toDomain
      ),
      totalCount,
    }
  }

  async findManyOnCurrentMonth(): Promise<ProvidedService[]> {
    const now = new Date()

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const providedServices = await this.prisma.providedService.findMany({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lt: nextMonthStart,
        },
      },
    })

    return providedServices.map(PrismaProvidedServicesMapper.toDomain)
  }

  async findManyOnLastMonth(): Promise<ProvidedService[]> {
    const now = new Date()

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const providedServices = await this.prisma.providedService.findMany({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: currentMonthStart,
        },
      },
    })

    return providedServices.map(PrismaProvidedServicesMapper.toDomain)
  }
}
