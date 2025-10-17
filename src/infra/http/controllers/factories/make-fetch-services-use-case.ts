import { FetchServicesUseCase } from '@/app/use-cases/fetch-services.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeFetchServicesUseCase() {
  const ServicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new FetchServicesUseCase(ServicesRepository)

  return useCase
}
