import * as bcrypt from 'bcryptjs'
import { promisify } from 'util'

import { PasswordEncoder } from './PasswordEncoder'

type GetHash = (raw: string, saltRounds: number) => Promise<string>
const getHash: GetHash = promisify(bcrypt.hash)

type Compare = (raw: string, encoded: string) => Promise<boolean>
const compare: Compare = promisify(bcrypt.compare)

export class BcryptPasswordEncoder implements PasswordEncoder {
  public encodePassword(raw: string) {
    const SALT_ROUNDS = 12

    return getHash(raw, SALT_ROUNDS)
  }

  public isPasswordValid(encoded: string, raw: string) {
    return compare(raw, encoded)
  }
}
