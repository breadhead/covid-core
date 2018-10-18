import { HttpService, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'

import Configuration from '../Configuration/Configuration'
import Logger from '../Logger/Logger'

@Injectable()
export default class NenaprasnoCabinetClient {
  public constructor(
    private readonly http: HttpService,
    private readonly config: Configuration,
    private readonly logger: Logger,
  ) {}

  /** @returns nenaprasnoUserId */
  public signIn(login: string, password: string): Promise<number | null> {
    return this.request('auth/sign-in', { login , password })
      .then((response) => Number(response.data))
      .catch(() => null)
  }

  private request(suffix: string, data: object): Promise<AxiosResponse<any>> {
    const nenaprasnoCabinetUrl = this.config
      .get('NENAPRASNO_CABINET_URL')
      .getOrElse('https://cabinet.nenaprasno.ru')

    return this.http.post(`${nenaprasnoCabinetUrl}/external/${suffix}`, data)
      .toPromise()
      .catch((e) => {
        this.logger.error('Nenaprasno cabinet returns error')
        throw e
      })
  }
}
