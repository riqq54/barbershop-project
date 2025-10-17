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
      take: 20,
      skip: (page - 1) * 20,
    })

    const totalCount = await this.prisma.service.count({
      where: whereObject,
    })

    return { services: services.map(PrismaServicesMapper.toDomain), totalCount }
  }

  async save(service: Service): Promise<null> {
    const data = PrismaServicesMapper.toPrisma(service)

    await this.prisma.service.update({
      where: {
        id: data.id,
      },
      data,
    })

    return null
  }
}
