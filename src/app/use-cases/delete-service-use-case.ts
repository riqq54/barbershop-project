import { Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'

interface DeleteServiceUseCaseRequest {
  serviceId: string
}

type DeleteServiceUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
  }: DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      return left(new ResourceNotFoundError())
    }

    service.inactivate()

    await this.servicesRepository.save(service)

    return right({})
  }
}
