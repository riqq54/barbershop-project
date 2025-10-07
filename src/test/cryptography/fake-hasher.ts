import type { HashComparer } from '@/app/cryptography/hash-comparer.ts'
import type { HashGenerator } from '@/app/cryptography/hash-generator.ts'

export class FakeHasher implements HashComparer, HashGenerator {
  async hashString(plain: string) {
    return plain.concat('-hashed')
  }

  async compareStringWithHash(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
