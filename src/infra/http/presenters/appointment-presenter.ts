import { Appointment } from "@/app/entities/appointment.ts";
import z from "zod";

export const AppointmentPresenterSchema = z.object({
  id: z.uuid(),
  barberId: z.uuid(),
  clientId: z.uuid(),
  serviceId: z.uuid(),
  startsAt: z.date(),
  durationInMinutes: z.number().int(),
  completedAt: z.date().optional().nullable(),
  canceledAt: z.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
})

type appointmentPresenterSchema = z.infer<typeof AppointmentPresenterSchema>

export class AppointmentPresenter {
  static toHTTP(appointment: Appointment): appointmentPresenterSchema {
    return {
      id: appointment.id.toString(),
      barberId: appointment.barberId.toString(),
      clientId: appointment.clientId.toString(),
      serviceId: appointment.serviceId.toString(),
      startsAt: appointment.startsAt,
      durationInMinutes: appointment.durationInMinutes,
      completedAt: appointment.completedAt,
      canceledAt: appointment.canceledAt,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }
}