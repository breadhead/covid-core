import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  public constructor(id: string) {
    this.id = id
  }

  public isActive() { // TODO: check claim is active
    return Math.random() > 0.2
  }

  public isInactive() {
    return !this.isActive()
  }
}
