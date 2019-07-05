import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import InvariantViolationException from '@app/domain/exception/InvariantViolationException'
import { Logger } from '@app/utils/service/Logger/Logger'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 400

@Catch(InvariantViolationException)
export default class InvariantViolationFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: InvariantViolationException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      invariant: exception.invariant,
    })

    this.logger.warn(responseToLog(res))
  }
}
