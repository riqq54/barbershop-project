import { Either, left, right } from '@/core/either.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'
import { ProvidedService } from '../entities/provided-service.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { ProvidedServicesRepository } from '../repositories/provided-services-repository.ts'

interface CreateProvidedServiceUseCaseRequest {
  barberId: string
  clientId: string
  serviceId: string
}

type CreateProvidedServiceUseCaseResponse = Either<ResourceNotFoundError, { providedService: ProvidedService }>

export class CreateProvidedServiceUseCase {
  constructor(private servicesRepository: ServicesRepository,
    private providedServicesRepository: ProvidedServicesRepository
  ) {}

  async execute({
    barberId,
    clientId,
    serviceId,
  }: CreateProvidedServiceUseCaseRequest): Promise<CreateProvidedServiceUseCaseResponse> {

    const service = await this.servicesRepository.findById(serviceId)

    if(!service){
      return left(new ResourceNotFoundError())
    }

    const providedService = ProvidedService.create({
      barberId: new UniqueEntityID(barberId),
      clientId: new UniqueEntityID(clientId),
      serviceId: new UniqueEntityID(serviceId),
      valueInCents: service?.currentValueInCents,
    })

    await this.providedServicesRepository.create(providedService)

    return right({ providedService })
  }
}
