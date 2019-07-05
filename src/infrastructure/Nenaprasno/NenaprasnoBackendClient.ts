import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import SignUpException from '@app/application/exception/SignUpException'
import { HttpService, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'

import { Configuration } from '../../config/Configuration'
import Logger from '../Logger/Logger'

const ACCOUNT_EXISTS_STATUS = 409

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
      throw new SignUpException(
        { password, confirm },
        'Пароли должны совпадать',
      )
    }

    return this.request('users', { username: login, password })
      .then(response => Number(response.data.id))
      .catch(e => {
        if (e.message.includes(ACCOUNT_EXISTS_STATUS)) {
          throw new SignUpException(
            { login },
            'Email уже занят',
            ACCOUNT_EXISTS_STATUS,
          )
        } else {
          throw new SignUpException({}, 'Ошибка при регистрации')
        }
      })
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
