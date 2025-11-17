import { GetDailyRevenueInPeriodUseCase } from '@/app/use-cases/get-daily-revenue-in-period.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'

export function makeGetDailyRevenueInPeriodUseCase() {
  const providedServicesRepository = new PrismaProvidedServicesRepository(
    prisma
  )

  const useCase = new GetDailyRevenueInPeriodUseCase(providedServicesRepository)

  return useCase
}
