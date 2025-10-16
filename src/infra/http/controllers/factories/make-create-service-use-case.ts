import { CreateServiceUseCase } from '@/app/use-cases/create-service.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeCreateServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new CreateServiceUseCase(servicesRepository)

  return useCase
}
