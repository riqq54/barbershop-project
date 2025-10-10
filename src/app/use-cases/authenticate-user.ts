import { Either, left, right } from '@/core/either.ts'
import { HashComparer } from '../cryptography/hash-comparer.ts'
import { User } from '../entities/user.ts'
import { UsersRepository } from '../repositories/users-repository.ts'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.ts'

interface AuthenticateUserUseCaseRequest {
  login: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  { user: User }
>

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer
  ) {}

  async execute({
    login,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByLogin(login)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compareStringWithHash(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    return right({
      user,
    })
  }
}
