import { Injectable } from '@nestjs/common'
import * as nanoid from 'nanoid'
const generate = require('nanoid/generate')

import { IdGenerator } from './IdGenerator'

const DEFAULT_LENGTH = 14
const DEFAULT_NUMCODE_LENGTH = 4

@Injectable()
export class NanoIdGenerator implements IdGenerator {
  public get(length?: number): string {
    return nanoid(length || DEFAULT_LENGTH)
  }

  public getNumeric(length?: number): string {
    return generate('1234567890', length || DEFAULT_NUMCODE_LENGTH)
  }
}
