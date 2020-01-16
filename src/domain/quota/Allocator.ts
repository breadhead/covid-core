import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { sample } from 'lodash'
import { EntityManager } from 'typeorm'

import Claim from '../claim/Claim.entity'
import QuotaAllocationFailedException from './exception/QuotaAllocationFailedException'
import Quota from './Quota.entity'
import QuotaRepository from './QuotaRepository'
import { CommonLocalizationsEnum } from '../claim/CommonLocalizationsEnum'
import { CorporateStatus } from '../claim/CorporateStatus'

@Injectable()
export default class Allocator {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(QuotaRepository)
    private readonly quotaRepo: QuotaRepository,
  ) {}

  public allocateAuto(claim: Claim): Promise<void> {
    if (claim.quota) {
      this.throwAllocatorException(claim.quota, 'Quota already allocated')
    }

    const enableAutoAllocation = true
    if (!enableAutoAllocation) {
      this.throwAllocatorException(null, 'Auto allocation disabled')
    }

    return this.em
      .transaction(async em => {
        const corporateQuotas =
          claim.corporateStatus === CorporateStatus.Checking
            ? await this.quotaRepo.findCorporateByCompanyName(
                claim.corporateInfo
                  .map(info => ({
                    name: info.name,
                    position: info.position,
                  }))
                  .getOrElse(null).name,
              )
            : null

        const [commonQuotas, specialQuotas] = await Promise.all([
          this.quotaRepo.findCommonAvailable(),
          this.quotaRepo.findByLocalization(
            claim.localization as CommonLocalizationsEnum,
          ),
        ])

        if (
          commonQuotas.length === 0 &&
          specialQuotas.length === 0 &&
          corporateQuotas.length === 0
        ) {
          throw new QuotaAllocationFailedException(null, 'Quota not found')
        }

        let quota
        if (corporateQuotas.length > 0) {
          quota = sample(corporateQuotas)
        } else {
          quota =
            specialQuotas.length > 0
              ? sample(specialQuotas)
              : sample(commonQuotas)
        }

        claim.bindQuota(quota)

        quota.decreaseBalance(1)

        await em.save([claim, quota])
      })
      .catch(this.throwAllocatorException())
  }

  public allocate(claim: Claim, quota: Quota): Promise<void> {
    return this.em
      .transaction(async em => {
        const entitiesForSave = []

        const oldQuota = claim.quota

        if (oldQuota && oldQuota.id !== quota.id) {
          oldQuota.increaseBalance(1)
          entitiesForSave.push(oldQuota)
        }

        if (!oldQuota || oldQuota.id !== quota.id) {
          quota.decreaseBalance(1)
        }

        claim.bindQuota(quota)

        entitiesForSave.push(claim)
        entitiesForSave.push(quota)

        await em.save(entitiesForSave)
      })
      .catch(this.throwAllocatorException(quota))
  }

  public deallocate(
    claim: Claim,
    restoreQuota: boolean = false,
  ): Promise<void> {
    return this.em.transaction(async em => {
      const entitiesForSave = []

      if (claim.quota) {
        if (restoreQuota) {
          // restore quota if needed
          const { quota } = claim
          quota.increaseBalance(1)

          entitiesForSave.push(quota)
        }

        claim.unbindQuota()
        entitiesForSave.push(claim)
      }

      await em.save(entitiesForSave)
    })
  }

  private throwAllocatorException(quota?: Quota, cause?: string) {
    return (e: Error) => {
      const realCause = cause || e.message

      throw new QuotaAllocationFailedException(quota, realCause, e)
    }
  }
}
