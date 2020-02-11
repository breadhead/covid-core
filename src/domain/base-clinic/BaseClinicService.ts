import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import BaseClinic from './BaseClinic.entity'
import { get } from 'lodash'

@Injectable()
export class BaseClinicService {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  public async save(clinics: any[]) {
    clinics.map(clinic => {
      const name = get(clinic, '_rawJson.fields["Клиника"]', null)
      const city = get(clinic, '_rawJson.fields["Город"]', null)

      this.em.save(
        new BaseClinic(
          clinic.id,
          name ? name.trim() : null,
          city ? city.trim() : null,
        ),
      )
    })

    await Promise.all(clinics)
  }
}
