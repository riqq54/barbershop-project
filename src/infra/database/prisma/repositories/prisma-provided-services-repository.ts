import { ProvidedService } from "@/app/entities/provided-service.ts";
import { ProvidedServicesRepository } from "@/app/repositories/provided-services-repository.ts";
import { PrismaProvidedServicesMapper } from "../mappers/prisma-provided-services-mapper.ts";
import { PrismaClient } from "@prisma/client";

export class PrismaProvidedServicesRepository implements ProvidedServicesRepository {

  constructor(private prisma: PrismaClient) {}
  
  async create(providedService: ProvidedService): Promise<void> {
    const data =  PrismaProvidedServicesMapper.toPrisma(providedService)

    await this.prisma.providedService.create({data})
  }
}