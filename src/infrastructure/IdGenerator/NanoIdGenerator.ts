import { Injectable } from '@nestjs/common'
import * as nanoid from 'nanoid'

import IdGenerator from './IdGenerator'

const DEFAULT_LENGTH = 14

@Injectable()
export default class NanoIdGenerator implements IdGenerator {
  public get(length?: number): string {
    return nanoid(length || DEFAULT_LENGTH)
  }
}
