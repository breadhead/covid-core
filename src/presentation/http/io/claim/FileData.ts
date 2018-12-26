import { ApiModelProperty } from '@nestjs/swagger'

export const fileDataExample: FileData = {
  title: 'Фото семьи',
  url: 'https://photo.7i',
}

export default class FileData {
  @ApiModelProperty({ example: fileDataExample.title })
  public readonly title: string
  @ApiModelProperty({ example: fileDataExample.url })
  public readonly url: string
}
