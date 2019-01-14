import { HttpService, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'

import Configuration from '../Configuration/Configuration'
import Logger from '../Logger/Logger'

@Injectable()
export default class NenaprasnoBackendClient {
  public constructor(
    private readonly http: HttpService,
    private readonly config: Configuration,
    private readonly logger: Logger,
  ) {}

  /** @returns nenaprasnoUserId */
  public signUp(
    login: string,
    password: string,
    confirm: string,
  ): Promise<number | null> {
    if (confirm !== password) {
      return Promise.resolve(null)
    }

    return this.request('users', { username: login, password })
      .then(response => Number(response.data.id))
      .catch(() => null)
  }

  /** @returns nenaprasnoUserId */
  public signIn(login: string, password: string): Promise<number | null> {
    return this.request('login', { username: login, password })
      .then(response => Number(response.data.userId))
      .catch(() => null)
  }

  private request(suffix: string, data: object): Promise<AxiosResponse<any>> {
    const nenaprasnoBackendUrl = this.config
      .get('NENAPRASNO_BACKEND_URL')
      .getOrElse('https://appercode.nenaprasno.ru/v1/notnap/')

    return this.http
      .post(`${nenaprasnoBackendUrl}/${suffix}`, data)
      .toPromise()
      .catch(e => {
        this.logger.error('Nenaprasno backend returns error')
        throw e
      })
  }
}
