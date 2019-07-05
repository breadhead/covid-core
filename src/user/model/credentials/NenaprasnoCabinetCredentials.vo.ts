import { Column } from 'typeorm'

export class NenaprasnoCabinetCredentials {
  @Column({ nullable: true })
  public readonly id: number

  constructor(id?: number) {
    this.id = id
  }
}
