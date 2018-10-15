import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'

const HTTP_STATUS = 401

@Catch(InvalidCredentialsException)
export default class InvalidCredentialsFilter implements ExceptionFilter {
  public catch(exception: InvalidCredentialsException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse()
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: exception.message,
        credentials: exception.credentials,
      })
  }
}
