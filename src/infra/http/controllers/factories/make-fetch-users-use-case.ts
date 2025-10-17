import { FetchUserUseCase } from '@/app/use-cases/fetch-users.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository.ts'

export function makeFetchUsersUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma)

  const useCase = new FetchUserUseCase(usersRepository)

  return useCase
}
