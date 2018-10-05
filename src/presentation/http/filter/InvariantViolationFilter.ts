import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import InvariantViolationException from '@app/domain/exception/InvariantViolationException'

const HTTP_STATUS = 400

@Catch(InvariantViolationException)
export default class InvariantViolationFilter implements ExceptionFilter {
  public catch(exception: InvariantViolationException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse()
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: exception.message,
        invariant: exception.invariant,
      })
  }
}
