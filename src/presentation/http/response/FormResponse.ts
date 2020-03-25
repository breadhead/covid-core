import { ApiModelProperty } from '@nestjs/swagger';

export default class FormResponse {
  @ApiModelProperty({ example: true })
  public readonly status: boolean;
}
