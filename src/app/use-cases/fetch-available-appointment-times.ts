import { Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { AppointmentsRepository } from '../repositories/appointments-repository.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'

interface FetchAvailableAppointmentTimesUseCaseRequest {
  barberId: string
  serviceId: string
  date: Date
}

type FetchAvailableAppointmentTimesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    availableTimes: string[]
  }
>

export class FetchAvailableAppointmentTimesUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository
  ) {}

  async execute({
    barberId,
    serviceId,
    date,
  }: FetchAvailableAppointmentTimesUseCaseRequest): Promise<FetchAvailableAppointmentTimesUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      return left(new ResourceNotFoundError())
    }

    const { durationInMinutes } = service

    const WORK_START_HOUR = 9
    const WORK_END_HOUR = 18

    const AVAILABLE_SLOT_INTERVAL = 10

    const availableTimes: string[] = []

    const currentDate = new Date(date)
    currentDate.setHours(WORK_START_HOUR, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(WORK_END_HOUR, 0, 0, 0)

    const existingAppointments =
      await this.appointmentsRepository.findConfirmedByBarberAndDate(
        barberId,
        date
      )

    while (currentDate.getTime() < endDate.getTime()) {
      const startTime = new Date(currentDate)
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60_000)

      if (endTime.getTime() > endDate.getTime()) {
        break
      }

      if (startTime.getTime() < Date.now()) {
        currentDate.setMinutes(
          currentDate.getMinutes() + AVAILABLE_SLOT_INTERVAL
        )
        continue
      }

      const conflictsWithExisting = existingAppointments.some(
        (appointment) =>
          startTime.getTime() < appointment.endsAt.getTime() &&
          endTime.getTime() > appointment.startsAt.getTime()
      )

      if (!conflictsWithExisting) {
        const timeString = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`
        availableTimes.push(timeString)
      }

      currentDate.setMinutes(currentDate.getMinutes() + AVAILABLE_SLOT_INTERVAL)
    }

    return right({ availableTimes })
  }
}
