import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { capitalize } from 'lodash'
import { head } from 'lodash'
import { Option } from 'tsoption'
import { QueryFailedError } from 'typeorm'
import { matches } from 'z'

import Logger from '@app/infrastructure/Logger/Logger'

import responseToLog from '../logging/responseToLog'

const HTTP_STATUS = 400

@Catch(QueryFailedError)
export default class EntityNotFoundFilter implements ExceptionFilter {
  public constructor(private readonly logger: Logger) {}

  public catch(exception: QueryFailedError, host: ArgumentsHost) {
    matches(exception)(
      (e = { code: 'ER_DUP_ENTRY' }) => this.duplicateEntry,
      e => this.skipFilter,
    )(exception, host)
  }

  private duplicateEntry(exception: QueryFailedError, host: ArgumentsHost) {
    const regex = /`(.+?)`/gm
    const entryName = Option.of(regex.exec((exception as any).query as string))
      .map(head)
      .map(name => name.replace(/`/g, ''))
      .map(capitalize)
      .getOrElse('Unknown')

    const res = host.switchToHttp().getResponse()

    res.status(HTTP_STATUS).json({
      status: HTTP_STATUS,
      message: `Try to create duplicate "${entryName}" entry`,
    })

    this.logger.warn(responseToLog(res))
  }

  private skipFilter(exception: QueryFailedError, host: ArgumentsHost) {
    throw exception
  }
}
