import { Injectable } from '@nestjs/common'
import BaseDoctor from './BaseDoctor.entity'
import { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'

@Injectable()
export class BaseDoctorService {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  public async save(doctors: any[]) {
    doctors.map(doctor =>
      this.em.save(
        new BaseDoctor(doctor.id, doctor._rawJson.fields['Имя'].trim()),
      ),
    )

    await Promise.all(doctors)
  }
}
