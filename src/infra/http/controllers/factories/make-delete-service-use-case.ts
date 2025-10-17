import { DeleteServiceUseCase } from '@/app/use-cases/delete-service-use-case.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeDeleteServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new DeleteServiceUseCase(servicesRepository)

  return useCase
}
