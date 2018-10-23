import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Company {
  @PrimaryColumn()
  public readonly name: string

  public get logo() { return this._logo }

  public get site() { return this._site }

  @Column({ nullable: true })
  private _logo?: string

  @Column({ nullable: true })
  private _site?: string

  public constructor(name: string, logo?: string, site?: string) {
    this.name = name
    this._logo = logo
    this._site = site
  }

  public changeLogo(newLogo?: string): void {
    this._logo = newLogo
  }

  public changeSite(newSite?: string): void {
    this._site = newSite
  }
}
