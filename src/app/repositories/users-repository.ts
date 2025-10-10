import type { User } from '../entities/user.ts'

export interface UsersRepository {
  findByLogin(login: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(user: User): Promise<void>
}
