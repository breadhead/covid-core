import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import Company from '../company/Company.entity'

@Entity()
export default class Quota {
  @PrimaryColumn()
  public readonly id: string

  @Column({ length: 500, unique: true })
  public readonly name: string

  public get balance() {
    return this._balance
  }

  @JoinColumn()
  @OneToOne((type) => Company)
  public readonly company?: Company

  @Column()
  private _balance: number

  public constructor(id: string, name: string, balance: number, company?: Company) {
    this.id = id
    this.name = name
    this._balance = balance
    this.company = company
  }

  public decreaseBalance(diff: number): void {
    this._balance = this._balance - diff
  }

  public increaseBalance(diff: number): void {
    this._balance = this._balance + diff
  }
}
