import { Either, right } from '@/core/either.ts'
import { ProvidedServicesRepository } from '../repositories/provided-services-repository.ts'

type GetDayProvidedServicesAmountUseCaseResponse = Either<
  null,
  {
    amount: number
    diffFromYesterday: number
  }
>

export class GetDayProvidedServicesAmountUseCase {
  constructor(private providedServicesRepository: ProvidedServicesRepository) {}

  async execute(): Promise<GetDayProvidedServicesAmountUseCaseResponse> {
    const providedServicesOnCurrentMonth =
      await this.providedServicesRepository.findManyOnCurrentMonth()

    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(today.getDate() - 1)

    const amount = providedServicesOnCurrentMonth.filter(
      (item) => item.createdAt.toDateString() === today.toDateString()
    ).length

    const yesterdayAmount = providedServicesOnCurrentMonth.filter(
      (item) => item.createdAt.toDateString() === yesterday.toDateString()
    ).length

    const diffFromYesterday =
      ((amount - yesterdayAmount) / yesterdayAmount) * 100

    return right({ amount, diffFromYesterday })
  }
}
