import { Option } from 'tsoption'

export default abstract class Configuration {
  public abstract get(key: string): Option<string>
}
