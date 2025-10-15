import { type Either, left, right } from '@/core/either.ts'
import type { HashGenerator } from '../cryptography/hash-generator.ts'
import { User } from '../entities/user.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

interface RegisterClientUseCaseRequest {
  name: string
  login: string
  password: string
}

type RegisterClientUseCaseResponse = Either<
  UserAlreadyExistsError,
  { user: User }
>

export class RegisterClientUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    login,
    password,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
    const userWithSameLogin = await this.usersRepository.findByLogin(login)

    if (userWithSameLogin) {
      return left(new UserAlreadyExistsError(login))
    }

    const hashedPassword = await this.hashGenerator.hashString(password)

    const user = User.create({
      name,
      login,
      role: 'CLIENT',
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
