import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import Logger from '@app/infrastructure/Logger/Logger'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 401

@Catch(InvalidCredentialsException)
export default class InvalidCredentialsFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: InvalidCredentialsException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      credentials: exception.credentials,
    })

    this.logger.log(responseToLog(res))
  }
}
