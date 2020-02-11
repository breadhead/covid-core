import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm'
import BaseClinic from '../base-clinic/BaseClinic.entity';

@Entity('baseDoctor')
export default class BaseDoctor {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly name: string

  @ManyToMany(type => BaseClinic, { lazy: true })
  @JoinTable({ name: 'base_doctor_base_clinic' })
  private clinic: Promise<BaseClinic[]>

  public async getClinics(): Promise<BaseClinic[]> {
    const clinic = await this.clinic

    return clinic
  }

  public async setClinics(clinic: BaseClinic[]): Promise<void> {
    this.clinic = Promise.resolve(clinic)
  }

  public constructor(
    id: string,
    name: string,
  ) {
    this.id = id,
      this.name = name
  }

}
