import { GetServiceByIdUseCase } from '@/app/use-cases/get-service-by-id.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeGetServiceByIdUseCase() {
  const servicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new GetServiceByIdUseCase(servicesRepository)

  return useCase
}
