import { Header } from './types/Header'
import { Item } from './types/Item'

export abstract class TableGenerator {
  public abstract generate<T>(
    items: Array<Item<T>>,
    header?: Header<T>,
  ): Promise<string>
}
