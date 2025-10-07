import type { UseCaseError } from './use-case-error.ts'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found.')
  }
}
