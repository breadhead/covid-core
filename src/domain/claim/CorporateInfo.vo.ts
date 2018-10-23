import { Column } from 'typeorm'

export interface CorporateParams {
  company?: string
  position?: string
}

export default class CorporateInfo {
  @Column({ nullable: true })
  public readonly name: string

  @Column({ nullable: true })
  public readonly position: string

  public constructor({ company, position }: CorporateParams) {
    this.name = company
    this.position = position
  }
}
