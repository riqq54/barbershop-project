import { CreateProvidedServiceUseCase } from '@/app/use-cases/create-provided-service.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeCreateProvidedServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository(prisma)
  const providedServicesRepository = new PrismaProvidedServicesRepository(prisma)

  const useCase = new CreateProvidedServiceUseCase(servicesRepository, providedServicesRepository)

  return useCase
}
