import { Appointment } from "@/app/entities/appointment.ts";
import { AppointmentsRepository } from "@/app/repositories/appointments-repository.ts";

export class InMemoryAppointmentsRepository implements AppointmentsRepository {

  public items: Appointment[] = []

  async findOverlappingAppointment(barberId: string, startsAt: Date, durationInMinutes: number): Promise<Appointment | null> {
    const endsAt = new Date(startsAt.getTime() + durationInMinutes * 60000)

    const barberAppointments = this.items.filter(
      (item) => item.barberId.toString() === barberId,
    )

    const overlappingAppointment = barberAppointments.find((existingAppointment) => {
      
      const existingEndsAt = new Date(
        existingAppointment.startsAt.getTime() +
          existingAppointment.durationInMinutes * 60000,
      )

      const isOverlapping =
        startsAt < existingEndsAt && endsAt > existingAppointment.startsAt
      
      return isOverlapping
    })

    return overlappingAppointment ?? null
  }
  async create(appointment: Appointment): Promise<void> {
    this.items.push(appointment)
  }

}