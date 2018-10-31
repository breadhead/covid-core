import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import Company from '../company/Company.entity'
import InvariantViolationException from '../exception/InvariantViolationException'
import defineType from './utils/defineType'

export enum QuotaType {
  Common = 'Common',
  Corporate = 'Corporate',
  Special = 'Special',
}

@Entity()
export default class Quota {
  @PrimaryColumn()
  public readonly id: string

  @Column({ default: '2018-10-21 13:00:00' })
  public readonly createdAt: Date

  public get name() { return this._name }

  public get balance() { return this._balance }

  public get publicCompany() { return this._publicCompany }

  public get type() {
    return defineType({
      corporate: this.corporate,
      constraints: this.constraints,
    }) as QuotaType
  }

  public get constraints() { return this._constraints }

  public get corporate() { return this._corporate }

  public get comment() { return this._comment }

  public get company() { return this._company }

  @JoinColumn()
  @ManyToOne((type) => Company, { eager: true })
  private _company?: Company

  @Column()
  private _publicCompany: boolean

  @Column()
  private _comment: string

  @Column()
  private _balance: number

  @Column({ length: 500, unique: true })
  private _name: string

  @Column('simple-array')
  private _constraints: string[]

  @Column()
  private _corporate: boolean

  public constructor(
    id: string,
    name: string,
    constraints: string[] = [],
    company?: Company,
    corporate = false,
    publicCompany = true,
    comment = '',
    createdAt = new Date(),
  ) {
    this.id = id
    this._name = name
    this._balance = 0
    this._constraints = constraints || []
    this._corporate = corporate
    this._company = company
    this._publicCompany = publicCompany
    this._comment = comment
    this.createdAt = createdAt
  }

  public decreaseBalance(diff: number): void {
    if (diff > this._balance) {
      throw new InvariantViolationException(Quota.name, 'Balance must be positive')
    }

    this._balance = this._balance - diff
  }

  public increaseBalance(diff: number): void {
    this._balance = this._balance + diff
  }

  public rename(newName: string): void {
    this._name = newName
  }

  public newConstraints(newConstraints: string[]): void {
    this._constraints = newConstraints
  }

  public adjustCorporate(newCorparate: boolean): void {
    this._corporate = newCorparate
  }

  public changeCompanyPublicity(newPublicity: boolean): void {
    this._publicCompany = newPublicity
  }

  public changeComment(newComment: string): void {
    this._comment = newComment
  }

  public changeCompany(newCompany: Company): void {
    this._company = newCompany
  }

  public editContent(
    name: string,
    constraints: string[],
    corporate: boolean = false,
    publicCompany: boolean = false,
    comment: string = '',
  ) {
    this.rename(name)
    this.newConstraints(constraints)
    this.adjustCorporate(corporate)
    this.changeCompanyPublicity(!!publicCompany)
    this.changeComment(comment || '')
  }
}
