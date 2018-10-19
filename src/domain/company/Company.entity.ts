import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Company {
  @PrimaryColumn()
  public readonly name: string

  @Column({ nullable: true })
  public readonly logo?: string

  @Column({ nullable: true })
  public site?: string

  public constructor(name: string, logo?: string, site?: string) {
    this.name = name
    this.logo = logo
    this.site = site
  }
}
