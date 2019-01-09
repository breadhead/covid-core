import { Column } from 'typeorm'
import FileLink from './FileLink.vo'

interface AnalysisParams {
  histology?: FileLink
  discharge?: FileLink
  other?: FileLink[]
}

export default class Analysis {
  @Column(type => FileLink)
  public readonly histology: FileLink

  @Column(type => FileLink)
  public readonly discharge: FileLink

  @Column({ type: 'json' })
  public readonly other: FileLink[] = []

  public constructor({ histology, discharge, other }: AnalysisParams) {
    this.histology = histology || new FileLink({})
    this.discharge = discharge || new FileLink({})
    this.other = other || []
  }
}
