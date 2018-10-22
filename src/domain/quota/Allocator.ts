import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { sample } from 'lodash'
import { EntityManager } from 'typeorm'

import Claim from '../claim/Claim.entity'
import Quota from './Quota.entity'
import QuotaRepository from './QuotaRepository'

@Injectable()
export default class Allocator {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
  ) { }

  public allocateAuto(claim: Claim): Promise<void> {
    return this.em.transaction(async (em) => {
      const commonQuotas = await this.quotaRepo.findCommon()

      const quota = sample(
        commonQuotas.filter((q) => q.balance > 0),
      )

      claim.bindQuota(quota)
      quota.decreaseBalance(1)

      await em.save([
        claim,
        quota,
      ])
    })
  }

  public allocate(claim: Claim, quota: Quota): Promise<void> {
    return this.em.transaction(async (em) => {
      claim.bindQuota(quota)
      quota.decreaseBalance(1)

      await em.save([
        claim,
        quota,
      ])
    })
  }
}
