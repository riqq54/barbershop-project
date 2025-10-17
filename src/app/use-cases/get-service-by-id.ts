import { Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { Service } from '../entities/service.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'

interface GetServiceByIdUseCaseRequest {
  serviceId: string
}

type GetServiceByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { service: Service }
>

export class GetServiceByIdUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
  }: GetServiceByIdUseCaseRequest): Promise<GetServiceByIdUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      return left(new ResourceNotFoundError())
    }

    return right({ service })
  }
}
