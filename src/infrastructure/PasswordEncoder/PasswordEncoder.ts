export default interface PasswordEncoder {
  encodePassword(raw: string, salt?: string): Promise<string>
  isPasswordValid(encoded: string, raw: string, salt?: string): Promise<boolean>
}

const PasswordEncoder = Symbol('PasswordEncoder')

export { PasswordEncoder }
