import { AuthenticateUserUseCase } from '@/app/use-cases/authenticate-user.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository.ts'

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma)
  const hashGenerator = new BcryptHasher()

  const useCase = new AuthenticateUserUseCase(usersRepository, hashGenerator)

  return useCase
}
