import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import Logger from '@app/infrastructure/Logger/Logger'

import QuotaAllocationFailedException from '@app/domain/quota/exception/QuotaAllocationFailedException'
import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 400

@Catch(QuotaAllocationFailedException)
export default class QuotaAllocationFailedFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: QuotaAllocationFailedException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      quotaId: exception.quota.id,
    })

    this.logger.warn(responseToLog(res))
  }
}
