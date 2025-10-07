import type { UseCaseError } from '@/core/errors/use-case-error.ts'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User ${identifier} already exists`)
  }
}
