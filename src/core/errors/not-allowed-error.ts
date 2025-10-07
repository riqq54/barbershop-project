import type { UseCaseError } from './use-case-error.ts'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed.')
  }
}
