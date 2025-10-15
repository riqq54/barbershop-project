import { FakeHasher } from '@/test/cryptography/fake-hasher.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { CreateUserUseCase } from './create-user.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be possible to create a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      login: 'john.doe',
      role: 'BARBER',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      login: 'john.doe',
      role: 'CLIENT',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hashString('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be possible to register a user with the same login', async () => {
    const user = makeUser({
      login: 'john.doe',
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      name: 'John Doe',
      login: 'john.doe',
      role: 'BARBER',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
    expect(inMemoryUsersRepository.items).toHaveLength(1)
  })
})
