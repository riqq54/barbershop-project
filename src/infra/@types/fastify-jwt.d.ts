import { UserRole } from '@/app/entities/user.ts'
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: UserRole
    }
  }
}
