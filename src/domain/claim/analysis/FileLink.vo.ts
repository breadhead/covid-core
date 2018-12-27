import { Column } from 'typeorm'

interface FileLinkParams {
  title?: string
  url?: string
}

export default class FileLink {
  @Column({ nullable: true })
  public readonly title?: string

  @Column({ nullable: true })
  public readonly url?: string

  public constructor(params: FileLinkParams) {
    this.title = params.title
    this.url = params.url
  }
}
