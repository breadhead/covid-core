import { Injectable } from '@nestjs/common'
import axios from 'axios'

import { LinkShortener } from './LinkShortener'

@Injectable()
export class ClckLinkShortener implements LinkShortener {
  getShort(link: string) {
    return axios
      .get(`https://clck.ru/--?url=${link}`)
      .then(response => response.data)
      .catch(error => {
        console.log('error here', error)
        return link
      })
  }
}
