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

  async findPopularServices(): Promise<{ service: string; amount: number }[]> {
    const popularServices: { service: string; amount: number }[] = await this
      .prisma.$queryRaw`
    SELECT
      t2.name AS service,
      CAST(COUNT(t1.id) AS INTEGER) AS amount
    FROM "provided_services" AS t1
    JOIN "services" AS t2 ON t1."service_id" = t2.id
    GROUP BY t2.name
    ORDER BY amount DESC;
  `

    return popularServices
  }

  async findDailyRevenueInPeriod(): Promise<
    { date: string; revenue: string }[]
  > {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    sevenDaysAgo.setHours(0, 0, 0, 0)

    const dailyResults = await this.prisma.$queryRaw<
      {
        date_only: Date
        total_revenue_cents: number
      }[]
    >`
    SELECT
      DATE("created_at") AS date_only,
      SUM("value_in_cents") AS total_revenue_cents
    FROM "provided_services"
    WHERE "created_at" >= ${sevenDaysAgo}
    GROUP BY date_only
    ORDER BY date_only ASC;
  `

    const formattedRevenue = dailyResults.map((row) => {
      const date = row.date_only

      const dateFormatted = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })

      const revenueFormatted = String(row.total_revenue_cents)

      return {
        date: dateFormatted,
        revenue: revenueFormatted,
      }
    })

    return formattedRevenue
  }
}
