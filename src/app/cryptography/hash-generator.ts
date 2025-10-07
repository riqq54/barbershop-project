export interface HashGenerator {
  hashString(plain: string): Promise<string>
}
