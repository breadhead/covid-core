export abstract class PasswordEncoder {
  abstract encodePassword(raw: string, salt?: string): Promise<string>
  abstract isPasswordValid(
    encoded: string,
    raw: string,
    salt?: string,
  ): Promise<boolean>
}
