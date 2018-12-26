import { Column } from 'typeorm'

interface FileLinkParams {
  title?: string
  url?: string
}

export default class FileLink {
  @Column()
  public readonly title?: string

  @Column()
  public readonly url?: string

  public constructor(params: FileLinkParams) {
    this.title = params.title
    this.url = params.url
  }
}
