import { PrismaClient } from '@prisma/client'
import { Service } from '@/app/entities/service.ts'
import { ServicesRepository } from '@/app/repositories/services-repository.ts'
import { PrismaServicesMapper } from '../mappers/prisma-services-mapper.ts'

export class PrismaServicesRepository implements ServicesRepository {
  constructor(private prisma: PrismaClient) {}

  async create(service: Service): Promise<void> {
    const data = PrismaServicesMapper.toPrisma(service)

    await this.prisma.service.create({ data })
  }
}
