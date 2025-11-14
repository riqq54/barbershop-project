import { ProvidedService } from "@/app/entities/provided-service.ts";
import { Prisma } from "@prisma/client";

export class PrismaProvidedServicesMapper {
  static toDomain(){}
  static toPrisma(providedService: ProvidedService): Prisma.ProvidedServiceUncheckedCreateInput{
    return {
      id: providedService.id.toString(),
      barberId: providedService.barberId.toString(),
      clientId: providedService.clientId.toString(),
      serviceId: providedService.serviceId.toString(),
      createdAt: providedService.createdAt
    }
  }
}