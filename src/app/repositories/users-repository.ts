import type { User, UserRole } from '../entities/user.ts'
import { PaginationParams } from './pagination-params.ts'

export interface FindManyUsersQueryParams {
  q?: string
  role?: UserRole
}

export interface UsersRepository {
  findByLogin(login: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findMany(
    params: PaginationParams,
    queryParams?: FindManyUsersQueryParams
  ): Promise<{ users: User[]; totalCount: number }>
  create(user: User): Promise<void>
}
