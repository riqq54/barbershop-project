import { InMemoryProvidedServicesRepository } from "@/test/repositories/in-memory-provided-services-repository.ts"
import { CreateProvidedServiceUseCase } from "./create-provided-service.ts"
import { InMemoryServicesRepository } from "@/test/repositories/in-memory-services-repository.ts"
import { makeUser } from "@/test/factories/make-user.ts"
import { makeService } from "@/test/factories/make-service.ts"

let inMemoryProvidedServicesRepository: InMemoryProvidedServicesRepository
let inMemoryServicesRepository: InMemoryServicesRepository

let sut: CreateProvidedServiceUseCase

describe('Create Provided Service Use Case', () => {
  beforeEach(() => {
    inMemoryProvidedServicesRepository = new InMemoryProvidedServicesRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository()

    sut = new CreateProvidedServiceUseCase(inMemoryServicesRepository, inMemoryProvidedServicesRepository)
  })

  it('should be possible to register a provided service', async () => {

    const barbeiro = makeUser({
      login: 'barbeiro',
      role: 'BARBER'
    })

    const cliente = makeUser({
      login: 'cliente',
      role: 'CLIENT'
    })

    const servico = makeService({
      name: 'service1',
      initialValueInCents: 4500
    })

    await inMemoryServicesRepository.create(servico)

    const result = await sut.execute({
      barberId: barbeiro.id.toString(),
      clientId: cliente.id.toString(),
      serviceId: servico.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      providedService: inMemoryProvidedServicesRepository.items[0],
    })
  })
})
