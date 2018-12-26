import { ApiModelProperty } from '@nestjs/swagger'

import FileLink from '@app/domain/claim/analysis/FileLink.vo'

export const fileDataExample: FileData = {
  title: 'Фото семьи',
  url: 'https://photo.7i',
}

export default class FileData {
  public static fromFileLink(link: FileLink): FileData | undefined {
    const file: FileData | undefined =
      link.title && link.url
        ? {
            title: link.title,
            url: link.url,
          }
        : undefined

    return file
  }

  @ApiModelProperty({ example: fileDataExample.title })
  public readonly title: string
  @ApiModelProperty({ example: fileDataExample.url })
  public readonly url: string
}
