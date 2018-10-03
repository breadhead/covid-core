import { Option } from 'tsoption'

import Configuration from './Configuration'

export default class ProdConfiguration extends Configuration {
  public get(key: string): Option<string> {
    return Option.of(process.env[key])
  }
}
