import { Either, right } from '@/core/either.ts'
import { User } from '../entities/user.ts'
import {
  FindManyUsersQueryParams,
  UsersRepository,
} from '../repositories/users-repository.ts'

interface FetchUserUseCaseRequest {
  page: number
  queryParams?: FindManyUsersQueryParams
}

type FetchUserUseCaseResponse = Either<
  null,
  {
    users: User[]
    totalCount: number
  }
>

export class FetchUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    queryParams,
  }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
    const { users, totalCount } = await this.usersRepository.findMany(
      { page },
      queryParams
    )

    return right({ users, totalCount })
  }
}
