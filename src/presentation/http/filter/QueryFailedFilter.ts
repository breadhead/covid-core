import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { head } from 'ramda'
import { Option } from 'tsoption'
import { QueryFailedError } from 'typeorm'
import { matches } from 'z'

import { capitalize, strip } from '@app/infrastructure/utils/string'

const HTTP_STATUS = 400

@Catch(QueryFailedError)
export default class EntityNotFoundFilter implements ExceptionFilter {
  public catch(exception: QueryFailedError, host: ArgumentsHost) {
    matches(exception)(
      (e = { code: 'ER_DUP_ENTRY'}) => this.duplicateEntry,
      (e)                           => this.skipFilter,
    )(exception, host)
  }

  private duplicateEntry(exception: QueryFailedError, host: ArgumentsHost) {
    const regex = /`(.+?)`/gm
    const entryName = Option.of(regex.exec((exception as any).query as string))
      .map(head)
      .map(strip(/`/g))
      .map(capitalize)
      .getOrElse('Unknown')

    host
      .switchToHttp()
      .getResponse()
      .status(HTTP_STATUS)
      .json({
        status: HTTP_STATUS,
        message: `Try to create duplicate "${entryName}" entry`,
      })
  }

  private skipFilter(exception: QueryFailedError, host: ArgumentsHost) {
    throw exception
  }
}
