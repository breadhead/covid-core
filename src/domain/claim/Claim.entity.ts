import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import InvariantViolationException from '../exception/InvariantViolationException'
import Quota from '../quota/Quota.entity'

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly applicantName: string

  public readonly status: string = 'Fake Status'

  public get quota(): Quota | null { return this._quota }

  @JoinColumn()
  @ManyToOne((type) => Quota, { eager: true, nullable: true })
  private _quota?: Quota

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

  public bindQuota(quota: Quota): void {
    if (this._quota) {
      throw new InvariantViolationException(Quota.name, 'Try to rebind quota')
    }

    this._quota = quota
  }

  public unbindQuota(): void {
    if (!this._quota) {
      throw new InvariantViolationException(Quota.name, 'Try to unbind empty quota')
    }

    this._quota = null
  }
}
