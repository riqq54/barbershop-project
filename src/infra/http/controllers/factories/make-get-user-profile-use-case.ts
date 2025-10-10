import { GetUserProfileUseCase } from '@/app/use-cases/get-user-profile.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository.ts'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma)

  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}
