import type { User } from '@/app/entities/user.ts'
import type { UsersRepository } from '@/app/repositories/users-repository.ts'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByLogin(login: string): Promise<User | null> {
    const user = this.items.find((item) => item.login === login)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }
}
