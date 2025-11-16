import { GetDayProvidedServicesAmountUseCase } from '@/app/use-cases/get-day-provided-services-amount.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'

export function makeGetDayProvidedServicesAmountUseCase() {
  const providedServicesRepository = new PrismaProvidedServicesRepository(
    prisma
  )

  const useCase = new GetDayProvidedServicesAmountUseCase(
    providedServicesRepository
  )

  return useCase
}
