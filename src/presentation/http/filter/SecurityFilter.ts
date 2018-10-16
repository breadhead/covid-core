import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import SecurityException from '@app/infrastructure/security/SecurityException'

const HTTP_STATUS = 403

@Catch(SecurityException)
export default class SecurityFilter implements ExceptionFilter {
  public catch(exception: SecurityException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse()
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: exception.message,
        token: exception.token,
      })
  }
}
