/* eslint-disable no-unused-expressions, no-sequences */

import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm'
import BaseClinic from '../base-clinic/BaseClinic.entity'

@Entity('base_doctor')
export default class BaseDoctor {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly name: string

  @ManyToMany(type => BaseClinic, { eager: true })
  @JoinTable({
    name: 'base_doctor_base_clinic',
    joinColumn: { name: 'base_doctor_id' },
    inverseJoinColumn: { name: 'base_clinic_id' },
  })
  public clinic: BaseClinic[]

  public setClinics(clinic: BaseClinic[]) {
    this.clinic = clinic
  }

  public constructor(id: string, name: string) {
    ;(this.id = id), (this.name = name)
  }
}
