import { FetchAvailableAppointmentTimesUseCase } from '@/app/use-cases/fetch-available-appointment-times.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { PrismaAppointmentsRepository } from '@/infra/database/prisma/repositories/prisma-appointments-repository.ts'
import { PrismaServicesRepository } from '@/infra/database/prisma/repositories/prisma-services-repository.ts'

export function makeFetchAvailableAppointmentTimesUseCase() {
  const appointmentRepository = new PrismaAppointmentsRepository(prisma)
  const servicesRepository = new PrismaServicesRepository(prisma)

  const useCase = new FetchAvailableAppointmentTimesUseCase(
    appointmentRepository,
    servicesRepository
  )

  return useCase
}
