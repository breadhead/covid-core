import { Parser } from 'json2csv'

import { TableGenerator } from './TableGenerator'
import { Header } from './types/Header'
import { Item } from './types/Item'

export class CsvTableGenerator extends TableGenerator {
  public async generate<T>(
    items: Array<Item<T>>,
    header?: Header<T>,
  ): Promise<string> {
    if (items.length === 0 && !header) {
      // no data
      return ''
    }

    const fields = this.createFieldsDeclaration(header)

    const parser = new Parser({ fields })
    return parser.parse(items)
  }

  // eslint-disable-next-line consistent-return
  private createFieldsDeclaration<T>(header?: Header<T>) {
    if (header) {
      return Object.entries(header).map(([key, value]: [string, string]) => ({
        label: value,
        value: key,
      }))
    }
  }
}
