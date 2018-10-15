import { Option } from 'tsoption'
import { Column, Entity, PrimaryColumn } from 'typeorm'

import PasswordEncoder from '@app/infrastructure/PasswordEncoder/PasswordEncoder'

import PasswordCredentials from './credentials/PasswordCredentials'

@Entity()
export default class User {
  @PrimaryColumn()
  public readonly login: string

  public get passwordCredentials(): Option<PasswordCredentials> {
    return Option.of(this._passwordCredentials)
  }

  @Column((type) => PasswordCredentials)
  private _passwordCredentials?: PasswordCredentials

  public constructor(login: string) {
    this.login = login
  }

  public async changePassword(raw: string, encoder: PasswordEncoder): Promise<void> {
    const password = await encoder.encodePassword(raw)

    this._passwordCredentials = new PasswordCredentials(password)
  }
}
