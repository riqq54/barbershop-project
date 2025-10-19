import { EditServiceUseCase } from '@/app/use-cases/edit-service.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeEditServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new EditServiceUseCase(servicesRepository)

  return useCase
}
