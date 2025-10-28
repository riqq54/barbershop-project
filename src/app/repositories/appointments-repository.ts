import { Appointment } from '../entities/appointment.ts'

export interface AppointmentsRepository {
  findOverlappingAppointment(
    barberId: string,
    startsAt: Date,
    durationInMinutes: number
  ): Promise<Appointment | null>
  findConfirmedByBarberAndDate(
    barberId: string,
    date: Date
  ): Promise<Appointment[]>
  create(appointment: Appointment): Promise<void>
}
