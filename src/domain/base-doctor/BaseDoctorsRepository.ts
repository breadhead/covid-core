import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm'

@Entity('baseDoctor')
export default class BaseDoctor {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly name: string

  @ManyToMany(type => BaseClinic, { lazy: true })
  @JoinTable({ name: 'baseDoctor_baseClinic' })
  private clinic: Promise<BaseClinic[]>

  public async getClinics(): Promise<BaseClinic[]> {
    const clinic = await this.clinic

    return clinic
  }

  public async setClinics(clinic: BaseClinic[]): Promise<void> {
    this.clinic = Promise.resolve(clinic)
  }

  @Column()
  public readonly communication: number

  @Column()
  public readonly expertScore: number

  @Column()
  public readonly status: string

  @Column()
  public readonly localization: string[]

  @Column()
  public readonly interventionMethod: string[]

  public constructor(
    id: string,
    name: string,
    communication: number,
    expertScore: number,
    status: string,
    localization: string[],
    interventionMethod: string[],
  ) {
    ;(this.id = id),
      (this.name = name),
      (this.communication = communication),
      (this.expertScore = expertScore),
      (this.status = status),
      (this.localization = localization),
      (this.interventionMethod = interventionMethod)
  }
}
