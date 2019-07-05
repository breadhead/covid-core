import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'
import { Logger } from '@app/utils/service/Logger/Logger'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 404

@Catch(EntityNotFoundException)
export default class EntityNotFoundFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: exception.message,
      parameters: exception.parameters,
    })

    this.logger.warn(responseToLog(res))
  }
}
