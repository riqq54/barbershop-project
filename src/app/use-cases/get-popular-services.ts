import { Either, right } from '@/core/either.ts'
import { ProvidedServicesRepository } from '../repositories/provided-services-repository.ts'

type GetPopularServicesUseCaseResponse = Either<
  null,
  {
    service: string
    amount: number
  }[]
>

export class GetPopularServicesUseCase {
  constructor(private providedServicesRepository: ProvidedServicesRepository) {}

  async execute(): Promise<GetPopularServicesUseCaseResponse> {
    const popularServices =
      await this.providedServicesRepository.findPopularServices()

    return right(popularServices)
  }
}
