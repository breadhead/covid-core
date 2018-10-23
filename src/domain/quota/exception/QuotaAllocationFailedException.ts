import Quota from '../Quota.entity'

export default class QuotaAllocationFailedException extends Error {
  public readonly quota?: Quota
  public readonly originalException?: Error

  public constructor(quota?: Quota, cause?: string, originalException?: Error) {
    super(cause || 'Something went wrong')

    this.quota = quota
    this.originalException = originalException
  }
}
