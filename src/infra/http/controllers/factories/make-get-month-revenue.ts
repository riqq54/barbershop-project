import { GetMonthRevenueUseCase } from '@/app/use-cases/get-month-revenue.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaProvidedServicesRepository } from '@/infra/database/prisma/repositories/prisma-provided-services-repository.ts'

export function makeGetMonthRevenue() {
  const providedServicesRepository = new PrismaProvidedServicesRepository(
    prisma
  )

  const useCase = new GetMonthRevenueUseCase(providedServicesRepository)

  return useCase
}
