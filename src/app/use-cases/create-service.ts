import { Either, right } from '@/core/either.ts'
import { Service } from '../entities/service.ts'
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
      valueInCents,
      durationInMinutes,
    })

    await this.servicesRepository.create(service)

    return right({ service })
  }
}
