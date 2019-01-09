import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Company {
  @PrimaryColumn()
  public readonly name: string

  public get logo() {
    return this._logo
  }

  public get site() {
    return this._site
  }

  public get comment() {
    return this._comment
  }

  @Column({ nullable: true })
  private _logo?: string

  @Column({ nullable: true })
  private _site?: string

  @Column({ nullable: true })
  private _comment?: string

  public constructor(
    name: string,
    logo?: string,
    site?: string,
    comment?: string,
  ) {
    this.name = name
    this._logo = logo
    this._site = site
    this._comment = comment
  }

  public changeLogo(newLogo?: string): void {
    this._logo = newLogo
  }

  public changeSite(newSite?: string): void {
    this._site = newSite
  }

  public changeComment(newComment?: string): void {
    this._comment = newComment
  }
}
