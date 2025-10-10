import { FakeHasher } from '@/test/cryptography/fake-hasher.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { AuthenticateUserUseCase } from './authenticate-user.ts'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be possible to authenticate as a user', async () => {
    const user = makeUser({
      login: 'john.doe',
      password: await fakeHasher.hashString('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      login: 'john.doe',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: expect.objectContaining({
        login: 'john.doe',
      }),
    })
  })
})
