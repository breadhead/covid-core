import SignUpException from '@app/application/exception/SignUpException'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import Logger from '@app/infrastructure/Logger/Logger'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 400

@Catch(SignUpException)
export default class SignUpFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: SignUpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      fields: exception.fields,
    })

    this.logger.log(responseToLog(res))
  }
}
