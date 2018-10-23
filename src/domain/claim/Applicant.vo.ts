import { Column } from 'typeorm'

import Gender from '@app/infrastructure/customTypes/Gender'

export default class Applicant {
  @Column()
  public readonly name: string

  @Column()
  public readonly age: number

  @Column({ type: 'enum', enum: Gender, default: Gender.unknown })
  public readonly gender: Gender

  @Column()
  public readonly region: string

  public constructor(name: string, age: number, gender: Gender, region: string) {
    this.name = name
    this.age = age
    this.gender = gender
    this.region = region
  }
}
