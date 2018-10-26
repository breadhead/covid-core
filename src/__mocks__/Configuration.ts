import { Option } from 'tsoption'

import Configuration from '@app/infrastructure/Configuration/Configuration'

export default class MockConfiguration extends Configuration {
  public constructor(
    private readonly values: { [key: string]: string },
  ) {
    super()
  }

  public get(key: string): Option<string> {
    return Option.of(this.values[key])
  }

  public isDev() {
    return false
  }
}
