/** biome-ignore-all lint/suspicious/useAwait: fastify async function */

import { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from '@/app/entities/user.ts'

export function verifyUserRole(rolesToVerify: UserRole[]) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user

    if (!rolesToVerify.includes(role)) {
      return res.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
