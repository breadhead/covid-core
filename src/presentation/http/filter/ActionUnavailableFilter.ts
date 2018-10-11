import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import ActionUnavailableException from '@app/domain/exception/ActionUnavailableException'

const HTTP_STATUS = 410

@Catch(ActionUnavailableException)
export default class ActionUnavailableFilter implements ExceptionFilter {
  public catch(exception: ActionUnavailableException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse()
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: exception.message,
        cause: exception.cause,
      })
  }
}
