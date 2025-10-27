import { Appointment, AppointmentProps } from "@/app/entities/appointment.ts";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.ts";
import { faker } from "@faker-js/faker";

export function makeAppointment(override: Partial<AppointmentProps> = {}, id?: UniqueEntityID){
  const appointment = Appointment.create({
    barberId: new UniqueEntityID(),
    serviceId: new UniqueEntityID(),
    clientId: new UniqueEntityID(),
    startsAt: faker.date.future(),
    durationInMinutes: faker.number.int({ min: 25, max: 90 }),
    ...override
  }, id )

  return appointment
}