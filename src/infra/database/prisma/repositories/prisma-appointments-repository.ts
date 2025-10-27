import { Appointment } from "@/app/entities/appointment.ts";
import { AppointmentsRepository } from "@/app/repositories/appointments-repository.ts";
import { PrismaClient } from "@prisma/client";
import { AppointmentMapper } from "../mappers/prisma-appointment-mapper.ts";

export class PrismaAppointmentsRepository implements AppointmentsRepository {

  constructor(private prisma: PrismaClient) {}

  async findOverlappingAppointment(barberId: string, startsAt: Date, durationInMinutes: number): Promise<Appointment | null> {

    const endsAt = new Date(startsAt.getTime() + durationInMinutes * 60000)

    const overlappingAppointment = await this.prisma.appointment.findFirst({
      where: {
        barberId,
        startsAt: {
          lt: endsAt
        },
        NOT: {
          startsAt: {
            gte: endsAt
          },
          canceledAt: {
            not: null
          }
        },
      }
    })

    if (!overlappingAppointment){
      return null
    }

    return AppointmentMapper.toDomain(overlappingAppointment)
  }

  async create(appointment: Appointment): Promise<void> {
    const data = AppointmentMapper.toPrisma(appointment)
    
    await this.prisma.appointment.create({ data })
  }
}