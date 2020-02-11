import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm'
import BaseDoctor from '../base-doctor/BaseDoctor.entity';

@Entity('baseClinic')
export default class BaseClinic {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly name: string

  @ManyToMany(type => BaseDoctor, { lazy: true })
  @JoinTable({ name: 'baseDoctor_baseClinic' })
  private doctor: Promise<BaseDoctor[]>

  public async getDoctors(): Promise<BaseDoctor[]> {
    const doctor = await this.doctor

    return doctor
  }

  public async setDoctors(doctor: BaseDoctor[]): Promise<void> {
    this.doctor = Promise.resolve(doctor)
  }

  public constructor(
    id: string,
    name: string,
  ) {
    this.id = id,
      this.name = name
  }

}
