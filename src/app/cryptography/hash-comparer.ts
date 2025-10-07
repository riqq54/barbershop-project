export interface HashComparer {
  compareStringWithHash(plain: string, hash: string): Promise<boolean>
}
