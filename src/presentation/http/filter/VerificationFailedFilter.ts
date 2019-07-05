import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import { Logger } from '@app/utils/service/Logger/Logger'

import { VerificationFailedException } from '@app/user/application/exception/VerificationFailedException'
import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 400

@Catch(VerificationFailedException)
export default class VerificationFailedFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: VerificationFailedException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      code: exception.code,
    })

    this.logger.warn(responseToLog(res))
  }
}
