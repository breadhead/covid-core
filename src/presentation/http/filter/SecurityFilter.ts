import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import { Logger } from '@app/utils/infrastructure/Logger/Logger'
import SecurityException from '@app/infrastructure/security/SecurityException'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 403

@Catch(SecurityException)
export default class SecurityFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: SecurityException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      token: exception.token,
    })

    this.logger.warn(responseToLog(res))
  }
}
