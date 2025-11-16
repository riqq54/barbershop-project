import { GetMonthProvidedServicesAmountUseCase } from '@/app/use-cases/get-month-provided-services-amount.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'

export function makeGetMonthProvidedServicesAmountUseCase() {
  const providedServicesRepository = new PrismaProvidedServicesRepository(
    prisma
  )

  const useCase = new GetMonthProvidedServicesAmountUseCase(
    providedServicesRepository
  )

  return useCase
}
