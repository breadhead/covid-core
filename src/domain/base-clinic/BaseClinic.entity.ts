import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm'
import BaseDoctor from '../base-doctor/BaseDoctor.entity'

@Entity('base_clinic')
export default class BaseClinic {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly name: string

  @Column()
  public readonly city: string

  @ManyToMany(type => BaseDoctor, { cascade: true })
  @JoinTable({
    name: 'base_doctor_base_clinic',
    joinColumn: { name: 'base_clinic_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'base_doctor_id', referencedColumnName: 'id' },
  })
  public doctor: BaseDoctor[]

  public constructor(id: string, name: string, city: string) {
    ;(this.id = id), (this.name = name), (this.city = city)
  }
}
