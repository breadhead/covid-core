import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { Logger } from '@app/utils/service/Logger/Logger'

import responseToLog from './responseToLog'

@Injectable()
export default class LoggerIntercepror implements NestInterceptor {
  public constructor(private readonly logger: Logger) {}

  public intercept(context: ExecutionContext, call$: Observable<any>) {
    return call$.pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<Response>()

        this.logger.log(responseToLog(res))
      }),
    )
  }
}
