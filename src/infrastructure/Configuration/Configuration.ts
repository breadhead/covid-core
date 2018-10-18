import { Option } from 'tsoption'

export default abstract class Configuration {
  public abstract get(key: string): Option<string>

  public isDev(): boolean {
    return false
  }

  public isProd(): boolean {
    return !this.isDev()
  }
}
