import { Injectable } from '@nestjs/common'
import Airtable from 'airtable'
import BaseTable from './BaseTable'

@Injectable()
export class AirBaseTable implements BaseTable {
  private airtable: any = Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'AIRTABLE_API_KEY',
  })

  private base: any = this.airtable.base('AIRTABLE_ID')

  public async load(name) {
    this.base(name)
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
        },
        function done(err) {
          console.log(`${name} done`)
          if (err) {
            console.error(err)
            return
          }
        },
      )
  }
}
