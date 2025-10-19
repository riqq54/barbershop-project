import { Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { Service } from '../entities/service.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'

interface EditServiceUseCaseRequest {
  serviceId: string
  name: string
  description?: string
  valueInCents: number
  durationInMinutes: number
}

type EditServiceUseCaseResponse = Either<
  ResourceNotFoundError,
  { service: Service }
>

export class EditServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
    name,
    description,
    valueInCents,
    durationInMinutes,
  }: EditServiceUseCaseRequest): Promise<EditServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      return left(new ResourceNotFoundError())
    }

    service.name = name
    service.description = description
    service.durationInMinutes = durationInMinutes

    service.updatePrice(valueInCents)

    await this.servicesRepository.save(service)

    return right({ service })
  }
}
