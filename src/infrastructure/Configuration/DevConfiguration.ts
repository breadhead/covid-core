import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { Option } from 'tsoption'

import Configuration from './Configuration'

export default class DevConfiguration extends Configuration {
  private readonly envConfig: { [key: string]: string }

  constructor(filePath: string) {
    super()
    this.envConfig = dotenv.parse(fs.readFileSync(filePath))
  }

  public get(key: string): Option<string> {
    return Option.of(this.envConfig[key])
  }

  public isDev() {
    return true
  }
}
