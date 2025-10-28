import { PrismaClient } from '@prisma/client'
import { Appointment } from '@/app/entities/appointment.ts'
import { AppointmentsRepository } from '@/app/repositories/appointments-repository.ts'
import { AppointmentMapper } from '../mappers/prisma-appointment-mapper.ts'

export class PrismaAppointmentsRepository implements AppointmentsRepository {
  constructor(private prisma: PrismaClient) {}

  async findOverlappingAppointment(
    barberId: string,
    startsAt: Date,
    durationInMinutes: number
  ): Promise<Appointment | null> {
    const endsAt = new Date(startsAt.getTime() + durationInMinutes * 60_000)

    const overlappingAppointment = await this.prisma.appointment.findFirst({
      where: {
        barberId,
        startsAt: {
          lt: endsAt,
        },
        NOT: {
          startsAt: {
            gte: endsAt,
          },
          canceledAt: {
            not: null,
          },
        },
      },
    })

    if (!overlappingAppointment) {
      return null
    }

    return AppointmentMapper.toDomain(overlappingAppointment)
  }

  async findConfirmedByBarberAndDate(
    barberId: string,
    date: Date
  ): Promise<Appointment[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const prismaAppointments = await this.prisma.appointment.findMany({
      where: {
        barberId,
        startsAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        canceledAt: null,
        completedAt: null,
      },
      orderBy: {
        startsAt: 'asc',
      },
    })

    return prismaAppointments.map(AppointmentMapper.toDomain)
  }

  async create(appointment: Appointment): Promise<void> {
    const data = AppointmentMapper.toPrisma(appointment)

    await this.prisma.appointment.create({ data })
  }
}
