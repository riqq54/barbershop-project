import { compare, hash } from 'bcryptjs'
import { HashComparer } from '@/app/cryptography/hash-comparer.ts'
import { HashGenerator } from '@/app/cryptography/hash-generator.ts'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hashString(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compareStringWithHash(plain: string, hashedString: string): Promise<boolean> {
    return compare(plain, hashedString)
  }
}
