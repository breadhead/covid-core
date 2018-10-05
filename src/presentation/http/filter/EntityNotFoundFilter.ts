import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'

const HTTP_STATUS = 404

@Catch(EntityNotFoundException)
export default class EntityNotFoundFilter implements ExceptionFilter {
  public catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse()
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: exception.message,
        parameters: exception.parameters,
      })
  }
}
