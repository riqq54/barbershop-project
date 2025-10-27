import { UseCaseError } from '@/core/errors/use-case-error.ts'

export class OverlappingAppointmentError extends Error implements UseCaseError {
  constructor() {
    super('Appointment time slot is already booked for this barber')
  }
}
