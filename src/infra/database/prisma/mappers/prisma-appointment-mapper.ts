import { Appointment } from "@/app/entities/appointment.ts";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.ts";
import { Appointment as PrismaAppointment, Prisma } from "@prisma/client";

export class AppointmentMapper {
  static toPrisma(appointment: Appointment): Prisma.AppointmentUncheckedCreateInput {
    return {
      id: appointment.id.toString(),
      barberId: appointment.barberId.toString(),
      clientId: appointment.clientId.toString(),
      serviceId: appointment.serviceId.toString(),
      durationInMinutes: appointment.durationInMinutes,
      startsAt: appointment.startsAt,
      completedAt: appointment.completedAt,
      canceledAt: appointment.canceledAt,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }

  static toDomain(raw: PrismaAppointment): Appointment {
    return Appointment.create(
      {
        barberId: new UniqueEntityID(raw.barberId),
        clientId: new UniqueEntityID(raw.clientId),
        serviceId: new UniqueEntityID(raw.serviceId),
        durationInMinutes: raw.durationInMinutes,
        startsAt: raw.startsAt,
        completedAt: raw.completedAt,
        canceledAt: raw.canceledAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }
}