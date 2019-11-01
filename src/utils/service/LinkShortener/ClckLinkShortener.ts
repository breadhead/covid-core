import { Injectable } from '@nestjs/common'
import axios from 'axios'

import { LinkShortener } from './LinkShortener'
import { Logger } from '../Logger/Logger'

@Injectable()
export class ClckLinkShortener implements LinkShortener {
  public constructor(private readonly logger: Logger) {}

  getShort(link: string) {
    this.logger.warn(link)
    console.log('link', link)

    return axios
      .get(`'https://clck.ru/--?url='${link}`)
      .then(response => response.data)
      .catch(() => {
        this.logger.warn(`error ${link}`)
        console.log(`error ${link}`)
        return link
      })
  }
}
