import { Injectable } from '@nestjs/common'
import * as Airtable from 'airtable'
import BaseTable from './BaseTable'
import { Configuration } from '../../config/Configuration'

@Injectable()
export class AirBaseTable implements BaseTable {
  private base: Promise<any> = null

  constructor(private readonly config: Configuration) {
    this.base = new Airtable({
      apiKey: this.config.getOrElse('AIRTABLE_API_KEY', null),
    }).base(this.config.getOrElse('AIRTABLE_ID', null))
  }

  public async load(name) {
    const currentBase = await this.base

    const all = currentBase(name).select({
      view: 'Grid view',
    })

    return new Promise((resolve, reject) => {
      all.eachPage(
        (record, fetchNextPage) => {
          fetchNextPage()
          resolve(record)
        },
        function done(err) {
          if (err) {
            console.error(err)
            reject(err)
          }
        },
      )
    })
  }
}
