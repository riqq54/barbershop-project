/** biome-ignore-all lint/suspicious/useAwait: Repository Interface */
import type { User } from '@/app/entities/user.ts'
import { PaginationParams } from '@/app/repositories/pagination-params.ts'
import type {
  FindManyUsersQueryParams,
  UsersRepository,
} from '@/app/repositories/users-repository.ts'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByLogin(login: string): Promise<User | null> {
    const user = this.items.find((item) => item.login === login)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findMany(
    { page }: PaginationParams,
    queryParams?: FindManyUsersQueryParams
  ): Promise<{ users: User[]; totalCount: number }> {
    let filteredItems = this.items

    if (queryParams?.q) {
      const search = queryParams?.q.toLowerCase()

      filteredItems = filteredItems.filter(
        (item) =>
          item.login.toLowerCase().includes(search) ||
          item.name.toLowerCase().includes(search)
      )
    }

    if (queryParams?.role) {
      filteredItems = filteredItems.filter(
        (item) => item.role === queryParams?.role
      )
    }

    const totalCount = filteredItems.length
    const users = filteredItems.slice((page - 1) * 20, page * 20)

    return { users, totalCount }
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }
}
