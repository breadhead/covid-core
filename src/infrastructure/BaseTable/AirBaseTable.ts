import { Injectable, Inject } from '@nestjs/common'
import * as Airtable from 'airtable'
import BaseTable from './BaseTable'
import { Configuration } from '../../config/Configuration'
import { BaseTabeViewEnum } from './BaseTabeViewEnum'
import { BaseClinicService } from '@app/domain/base-clinic/BaseClinicService'
import { BaseDoctorService } from '@app/domain/base-doctor/BaseDoctorService'

@Injectable()
export class AirBaseTable implements BaseTable {
  private readonly base: Promise<any> = null

  constructor(
    private readonly config: Configuration,
    @Inject(BaseDoctorService)
    private readonly baseDoctor: BaseDoctorService,
    @Inject(BaseClinicService)
    private readonly baseClinic: BaseClinicService,
  ) {
    this.base = new Airtable({
      apiKey: this.config.getOrElse('AIRTABLE_API_KEY', null),
    }).base(this.config.getOrElse('AIRTABLE_ID', null))
  }

  public async update(authHeader: string): Promise<void> {
    if (authHeader !== this.config.getOrElse('PIPEDREAM_ID', null)) {
      // TODO: throw error
      return
    }

    const doctors = await this.load('Врачи', BaseTabeViewEnum.Grid)
    const clinics = await this.load('Учреждения', BaseTabeViewEnum.Table)

    if (clinics) {
      await this.baseClinic.save(clinics)
    }

    if (doctors) {
      await this.baseDoctor.save(doctors)
    }
  }

  public async load(name: string, view: BaseTabeViewEnum): Promise<any[]> {
    const currentBase = await this.base

    const all = currentBase(name).select({ view })

    let records = []

    return new Promise((resolve, reject) => {
      all.eachPage(
        (record, fetchNextPage) => {
          records = [...records, ...record]
          fetchNextPage()
        },
        err => {
          if (err) {
            console.error(err)
            reject(err)
          }
          resolve(records)
        },
      )
    }) as Promise<any[]>
  }
}
