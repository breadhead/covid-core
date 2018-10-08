import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import Company from '../company/Company.entity'
import InvariantViolationException from '../exception/InvariantViolationException'

@Entity()
export default class Quota {
  @PrimaryColumn()
  public readonly id: string

  public get name() {
    return this._name
  }

  public get balance() {
    return this._balance
  }

  @JoinColumn()
  @ManyToOne((type) => Company, { eager: true })
  public readonly company?: Company

  @Column()
  private _balance: number

  @Column({ length: 500, unique: true })
  private _name: string

  public constructor(id: string, name: string, company?: Company) {
    this.id = id
    this._name = name
    this._balance = 0
    this.company = company
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
}
