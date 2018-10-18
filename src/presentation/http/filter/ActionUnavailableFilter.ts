import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import ActionUnavailableException from '@app/domain/exception/ActionUnavailableException'
import Logger from '@app/infrastructure/Logger/Logger'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 410

@Catch(ActionUnavailableException)
export default class ActionUnavailableFilter implements ExceptionFilter {
  public constructor(
    private readonly logger: Logger,
  ) {}

  public catch(exception: ActionUnavailableException, host: ArgumentsHost) {
    const res = host
      .switchToHttp()
      .getResponse()

    res
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: exception.message,
        cause: exception.cause,
      })

    this.logger.log(responseToLog(res))
  }
}
