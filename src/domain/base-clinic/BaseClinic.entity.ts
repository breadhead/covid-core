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

  @ManyToMany(type => BaseDoctor, { lazy: true })
  @JoinTable({ name: 'base_doctor_base_clinic' })
  private doctor: Promise<BaseDoctor[]>

  public async getDoctors(): Promise<BaseDoctor[]> {
    const doctor = await this.doctor

    return doctor
  }

  public async setDoctors(doctor: BaseDoctor[]): Promise<void> {
    this.doctor = Promise.resolve(doctor)
  }

  public constructor(id: string, name: string, city: string) {
    ;(this.id = id), (this.name = name), (this.city = city)
  }
}
