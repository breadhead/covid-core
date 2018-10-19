import { ApiModelProperty } from '@nestjs/swagger'

export default class FileResponse {
  @ApiModelProperty({ example: '/path/to/file.jpg' })
  public readonly path: string
}
