import { None, Option, Some } from 'tsoption'
import { Column, Entity, PrimaryColumn } from 'typeorm'

import PasswordEncoder from '@app/infrastructure/PasswordEncoder/PasswordEncoder'

import InvariantViolationException from '../exception/InvariantViolationException'
import Contacts, { Params as ContactsParams } from './Contacts.vo'
import NenaprasnoCabinetCredentials from './credentials/NenaprasnoCabinetCredentials.vo'
import PasswordCredentials from './credentials/PasswordCredentials.vo'
import Role from './Role'

@Entity()
export default class User {
  @PrimaryColumn()
  public readonly login: string

  public get passwordCredentials(): Option<PasswordCredentials> {
    return this._passwordCredentials.password
      ? new Some(this._passwordCredentials)
      : new None()
  }

  public get nanprasnoCabinetCredentials(): Option<NenaprasnoCabinetCredentials> {
    return this._nenaprasnoCabinetCredentials.id
      ? new Some(this._nenaprasnoCabinetCredentials)
      : new None()
  }

  public get conatcts(): Contacts { return this._contacts }

  public get roles(): Role[] { return [Role.Admin, Role.Client] }

  public get isClient(): boolean {
    return this.roles.includes(Role.Client)
  }

  @Column((type) => Contacts)
  public _contacts: Contacts

  @Column((type) => PasswordCredentials)
  private _passwordCredentials: PasswordCredentials

  @Column((type) => NenaprasnoCabinetCredentials)
  private _nenaprasnoCabinetCredentials: NenaprasnoCabinetCredentials

  @Column({ type: 'simple-array' })
  private _roles: Role[]

  public constructor(login: string, contacts?: Contacts) {
    this.login = login

    this._contacts = contacts || new Contacts()

    this._passwordCredentials = new PasswordCredentials()
    this._nenaprasnoCabinetCredentials = new NenaprasnoCabinetCredentials()
    this._roles = []
  }

  public newContacts({ email, phone }: ContactsParams) {
    this._contacts = new Contacts({ email, phone })
  }

  public async changePassword(raw: string, encoder: PasswordEncoder): Promise<void> {
    const password = await encoder.encodePassword(raw)

    this._passwordCredentials = new PasswordCredentials(password)
  }

  public bindToNenaprasnoCabinet(cabinetId: number): void {
    if (this._nenaprasnoCabinetCredentials.id) {
      throw new InvariantViolationException(User.name, 'Try to rebind nenaprasno cabinet')
    }

    this._nenaprasnoCabinetCredentials = new NenaprasnoCabinetCredentials(cabinetId)
  }
}
