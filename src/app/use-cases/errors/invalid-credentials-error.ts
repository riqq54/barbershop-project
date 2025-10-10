import { UseCaseError } from '@/core/errors/use-case-error.ts'

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Invalid Credentials')
  }
}
