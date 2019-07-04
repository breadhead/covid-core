import { None, Option, Some } from 'tsoption'
import { Column, Entity, PrimaryColumn } from 'typeorm'

import { PasswordEncoder } from '@app/utils/infrastructure/PasswordEncoder/PasswordEncoder'

import InvariantViolationException from '../exception/InvariantViolationException'
import Contacts, { Params as ContactsParams } from './Contacts.vo'
import NenaprasnoCabinetCredentials from './credentials/NenaprasnoCabinetCredentials.vo'
import PasswordCredentials from './credentials/PasswordCredentials.vo'
import Role from './Role'

@Entity()
export default class User {
  @PrimaryColumn()
  public readonly login: string

  @Column({ nullable: true })
  public fullName?: string = null

  @Column({ nullable: true })
  public description?: string = null

  @Column({ nullable: true })
  public boardUsername?: string

  public get passwordCredentials(): Option<PasswordCredentials> {
    return this._passwordCredentials.password
      ? new Some(this._passwordCredentials)
      : new None()
  }

  public get nanprasnoCabinetCredentials(): Option<
    NenaprasnoCabinetCredentials
  > {
    return this._nenaprasnoCabinetCredentials.id
      ? new Some(this._nenaprasnoCabinetCredentials)
      : new None()
  }

  public get contacts(): Contacts {
    return this._contacts
  }
  public get verificationCode(): string | null {
    return this._verificationCode
  }

  public get roles(): Role[] {
    return this._roles
  }

  public get isClient(): boolean {
    return this.roles.includes(Role.Client) && this.roles.length === 1
  }

  public get valid(): boolean {
    return this._valid
  }

  @Column(type => Contacts)
  public _contacts: Contacts

  @Column(type => PasswordCredentials)
  private _passwordCredentials: PasswordCredentials

  @Column(type => NenaprasnoCabinetCredentials)
  private _nenaprasnoCabinetCredentials: NenaprasnoCabinetCredentials

  @Column({ nullable: true })
  private _verificationCode?: string

  @Column({ type: 'simple-array' })
  private _roles: Role[]

  @Column({ default: false })
  private _valid: boolean = false

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

  public async changePassword(
    raw: string,
    encoder: PasswordEncoder,
  ): Promise<void> {
    const password = await encoder.encodePassword(raw)

    this._passwordCredentials = new PasswordCredentials(password)
  }

  public async changeVerificationCode(
    raw: string,
    encoder: PasswordEncoder,
  ): Promise<void> {
    const code = await encoder.encodePassword(raw)

    this._verificationCode = code
  }

  public bindToNenaprasnoCabinet(cabinetId: number): void {
    if (this._nenaprasnoCabinetCredentials.id) {
      throw new InvariantViolationException(
        User.name,
        'Try to rebind nenaprasno cabinet',
      )
    }

    this._nenaprasnoCabinetCredentials = new NenaprasnoCabinetCredentials(
      cabinetId,
    )
  }

  public becomeValide(): void {
    this._valid = true
  }
}
