import { type Either, left, right } from '@/core/either.ts'
import type { HashGenerator } from '../cryptography/hash-generator.ts'
import { User, UserRole } from '../entities/user.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

interface CreateUserUseCaseRequest {
  name: string
  login: string
  password: string
  role: UserRole
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    login,
    role,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameLogin = await this.usersRepository.findByLogin(login)

    if (userWithSameLogin) {
      return left(new UserAlreadyExistsError(login))
    }

    const hashedPassword = await this.hashGenerator.hashString(password)

    const user = User.create({
      name,
      login,
      role,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
