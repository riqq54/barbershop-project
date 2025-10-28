/** biome-ignore-all lint/suspicious/useAwait: Repository Interface */
import { Appointment } from '@/app/entities/appointment.ts'
import { AppointmentsRepository } from '@/app/repositories/appointments-repository.ts'

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  public items: Appointment[] = []

  async findOverlappingAppointment(
    barberId: string,
    startsAt: Date,
    durationInMinutes: number
  ): Promise<Appointment | null> {
    const endsAt = new Date(startsAt.getTime() + durationInMinutes * 60_000)

    const barberAppointments = this.items.filter(
      (item) => item.barberId.toString() === barberId
    )

    const overlappingAppointment = barberAppointments.find(
      (existingAppointment) => {
        const existingEndsAt = new Date(
          existingAppointment.startsAt.getTime() +
            existingAppointment.durationInMinutes * 60_000
        )

        const isOverlapping =
          startsAt < existingEndsAt && endsAt > existingAppointment.startsAt

        return isOverlapping
      }
    )

    return overlappingAppointment ?? null
  }

  async findConfirmedByBarberAndDate(
    barberId: string,
    date: Date
  ): Promise<Appointment[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const appointmentsOnDate = this.items.filter((item) => {
      const itemStartsAt = item.startsAt.getTime()

      const isSameBarber = item.barberId.toString() === barberId

      const isSameDate =
        itemStartsAt >= startOfDay.getTime() &&
        itemStartsAt <= endOfDay.getTime()

      return isSameBarber && isSameDate
    })

    return appointmentsOnDate
  }

  async create(appointment: Appointment): Promise<void> {
    this.items.push(appointment)
  }
}
