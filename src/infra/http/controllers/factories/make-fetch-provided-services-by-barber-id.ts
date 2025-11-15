import { FetchProvidedServicesByBarberIdUseCase } from '@/app/use-cases/fetch-provided-services-by-barber-id.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'

export function makeFetchProvidedServicesByBarberIdUseCase() {
  const providedServicesRepository = new PrismaProvidedServicesRepository(
    prisma
  )

  const useCase = new FetchProvidedServicesByBarberIdUseCase(
    providedServicesRepository
  )

  return useCase
}
