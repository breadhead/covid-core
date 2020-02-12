import { Injectable } from '@nestjs/common'
import BaseDoctor from './BaseDoctor.entity'
import { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { get } from 'lodash'

@Injectable()
export class BaseDoctorService {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  public async save(doctors: any[]) {
    const newDoctors = doctors.map(doctor => {
      const name = get(doctor, '_rawJson.fields["Имя"]', null)
      const newDoctor = new BaseDoctor(doctor.id, name ? name.trim() : null)

      const clinics = get(doctor, '_rawJson.fields["Клиники"]', []).map(
        clinic => {
          return { id: clinic }
        },
      )

      newDoctor.clinic = clinics

      return this.em.save(newDoctor)
    })

    await Promise.all(newDoctors)
  }
}
