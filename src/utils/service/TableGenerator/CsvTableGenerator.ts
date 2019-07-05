import { Parser } from 'json2csv'

import { TableGenerator } from './TableGenerator'
import { Header } from './Header'
import { Item } from './Item'

export class CsvTableGenerator extends TableGenerator {
  public async generate<T>(
    items: Array<Item<T>>,
    header: Header<T>,
  ): Promise<string> {
    const fields = this.createFieldsDeclaration(header)

    const parser = new Parser({ fields })

    return parser.parse(items)
  }

  private createFieldsDeclaration<T>(header: Header<T>) {
    return Object.entries(header).map(([key, value]: [string, string]) => ({
      label: value,
      value: key,
    }))
  }
}
