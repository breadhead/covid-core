import { Header } from './Header'
import { Item } from './Item'

export abstract class TableGenerator {
  public abstract generate<T>(
    items: Array<Item<T>>,
    header?: Header<T>,
  ): Promise<string>
}
