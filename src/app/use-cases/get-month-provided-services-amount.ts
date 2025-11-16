import { Either, right } from '@/core/either.ts'
import { ProvidedServicesRepository } from '../repositories/provided-services-repository.ts'

type GetMonthProvidedServicesAmountUseCaseResponse = Either<
  null,
  {
    amount: number
    diffFromLastMonth: number
  }
>

export class GetMonthProvidedServicesAmountUseCase {
  constructor(private providedServicesRepository: ProvidedServicesRepository) {}

  async execute(): Promise<GetMonthProvidedServicesAmountUseCaseResponse> {
    const providedServicesOnCurrentMonth =
      await this.providedServicesRepository.findManyOnCurrentMonth()

    const amount = providedServicesOnCurrentMonth.length

    const providedServicesOnLastMonth =
      await this.providedServicesRepository.findManyOnLastMonth()

    const lastMonthAmount = providedServicesOnLastMonth.length

    const diffFromLastMonth =
      ((amount - lastMonthAmount) / lastMonthAmount) * 100

    return right({ amount, diffFromLastMonth })
  }
}
