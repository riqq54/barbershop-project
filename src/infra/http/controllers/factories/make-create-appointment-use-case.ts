import { CreateAppointmentUseCase } from '@/app/use-cases/create-appointment.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaAppointmentsRepository } from '@/infra/database/prisma/repositories/prisma-appointments-repository.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeCreateAppointmentUseCase() {
  const appointmentRepository = new PrismaAppointmentsRepository(prisma)
  const servicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new CreateAppointmentUseCase(appointmentRepository, servicesRepository)

  return useCase
}
