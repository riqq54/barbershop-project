import { GetPopularServicesUseCase } from '@/app/use-cases/get-popular-services.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'

export function makeGetPopularServicesUseCase() {
  const providedServicesRepository = new PrismaProvidedServicesRepository(
    prisma
  )

  const useCase = new GetPopularServicesUseCase(providedServicesRepository)

  return useCase
}
