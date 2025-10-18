import { Either, right } from '@/core/either.ts'
import { Service } from '../entities/service.ts'
import { ServicePrice } from '../entities/service-price.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'

interface CreateServiceUseCaseRequest {
  name: string
  description?: string
  valueInCents: number
  durationInMinutes: number
}

type CreateServiceUseCaseResponse = Either<null, { service: Service }>

export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    name,
    description,
    valueInCents,
    durationInMinutes,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({
      name,
      description,
      servicePrices: [],
      durationInMinutes,
    })

    const servicePrice = ServicePrice.create({
      serviceId: service.id,
      valueInCents,
    })

    service.servicePrices.push(servicePrice)

    await this.servicesRepository.create(service)

    return right({ service })
  }
}
