import z from 'zod'
import { User } from '@/app/entities/user.ts'

export const UserProfilePresenterSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  login: z.string(),
  role: z.string(),
})

type userProfilePresenterSchema = z.infer<typeof UserProfilePresenterSchema>

export class UserProfilePresenter {
  static toHTTP(user: User): userProfilePresenterSchema {
    return {
      id: user.id.toString(),
      name: user.name,
      login: user.login,
      role: user.role,
    }
  }
}
