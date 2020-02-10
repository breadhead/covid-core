import { Injectable } from '@nestjs/common'
import * as Airtable from 'airtable'
import BaseTable from './BaseTable'

// AIRTABLE_ID = 'appoJF3vF5m6I0Pxs'
// AIRTABLE_API_KEY = 'key43jZPdwh3hE5OB'
@Injectable()
export class AirBaseTable implements BaseTable {
  private base: Promise<any> = null

  constructor() {
    this.base = new Airtable({ apiKey: 'key43jZPdwh3hE5OB' }).base(
      'appoJF3vF5m6I0Pxs',
    )
  }

  public async load(name) {
    const currentBase = await this.base

    const res = await currentBase(name)
      .select({
        maxRecords: 3,
        view: 'Grid view',
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function(record) {
            console.log('Retrieved', record.get('Имя'))
          })
          fetchNextPage()
          return records
        },
        function done(err) {
          if (err) {
            console.error(err)
            return
          }
        },
      )
    console.log('res:', res)
    return res
  }
}
