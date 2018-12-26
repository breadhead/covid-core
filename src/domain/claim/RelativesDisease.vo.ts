import { Column } from 'typeorm'

export default class RelativesDisease {
  @Column()
  public readonly relative: string

  @Column()
  public readonly localization: string

  @Column()
  public readonly diagnosisAge: number

  public constructor(
    relative: string,
    localization: string,
    diagnosisAge: number,
  ) {
    this.relative = relative
    this.localization = localization
    this.diagnosisAge = diagnosisAge
  }
}
