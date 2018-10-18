import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly applicantName: string

  public readonly status: string = 'Fake Status'

  public constructor(id: string, applicantName: string) {
    this.id = id
    this.applicantName = applicantName
  }

  public isActive() { // TODO: check claim is active
    return Math.random() > 0.2
  }

  public isInactive() {
    return !this.isActive()
  }
}
