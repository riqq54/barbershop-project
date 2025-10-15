import { RegisterClientUseCase } from '@/app/use-cases/register-client.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository.ts'

export function makeRegisterClientUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma)
  const hashGenerator = new BcryptHasher()

  const useCase = new RegisterClientUseCase(usersRepository, hashGenerator)

  return useCase
}
