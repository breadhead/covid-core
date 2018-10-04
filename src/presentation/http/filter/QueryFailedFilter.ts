import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import * as R from 'ramda'
import { QueryFailedError } from 'typeorm'
import { matches } from 'z'

const HTTP_STATUS = 400

@Catch(QueryFailedError)
export default class EntityNotFoundFilter implements ExceptionFilter {
  public catch(exception: QueryFailedError, host: ArgumentsHost) {
    const handler = matches(exception)(
      (e = { code: 'ER_DUP_ENTRY'}) => this.duplicateEntry,
      (e)                           => this.skipFilter,
    )

    handler(exception, host)
  }

  private duplicateEntry(exception: QueryFailedError, host: ArgumentsHost) {
    const regex = /`(.+?)`/gm
    const entryName = capitalize(
      regex.exec((exception as any).query as string)[1],
    )

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

const capitalize: (s: string) => string = R.converge(
  R.concat,
  [
    R.compose(R.toUpper, R.head),
    R.compose(R.toLower, R.tail),
  ],
)
