import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BaseClinic from './BaseClinic.entity'
import { get } from 'lodash'
import { BaseClinicRepository } from './BaseClinicRepository'
import ClinicsByRegionResponse from '@app/presentation/http/response/ClinicsByRegionResponse'

@Injectable()
export class BaseClinicService {
  constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(BaseClinicRepository)
    private readonly repo: BaseClinicRepository,
  ) {}

  public async save(clinics: any[]) {
    clinics.map(clinic => {
      const name = get(clinic, '_rawJson.fields["Клиника"]', null)
      const city = get(clinic, '_rawJson.fields["Город"]', null)
      const region = get(clinic, '_rawJson.fields["Регион"]', null)

      const newClinic = new BaseClinic(
        clinic.id,
        name ? name.trim() : null,
        city ? city.trim() : null,
        region ? region.trim() : null,
      )

      return this.em.save(newClinic)
    })

    await Promise.all(clinics)
  }

  public async getClinicsByRegion(
    region,
    name,
  ): Promise<ClinicsByRegionResponse[]> {
    const [regionItems, commonItems] = await Promise.all([
      this.repo.searchByRegion(region),
      this.repo.searchByName(name),
    ])

    const items = Array.from(new Set([...regionItems, ...commonItems]))

    const regionClinics = items.filter(it => it.region === region)
    const commonClinics = items.filter(it => it.region !== region)

    return [
      this.formatItems(regionClinics, 'В выбранном регионе'),
      this.formatItems(commonClinics, 'Во всех регионах'),
    ]
  }

  private formatItems(items, title): ClinicsByRegionResponse {
    const names = items.map(it => it.name)
    const unique = Array.from(new Set(names)) as string[]

    return {
      title,
      children: unique,
    }
  }
}
