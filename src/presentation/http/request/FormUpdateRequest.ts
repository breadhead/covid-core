import { ApiModelProperty } from '@nestjs/swagger';

export class FormUpdateRequest {
  @ApiModelProperty({ example: 12, required: true, })
  public readonly id: number;

  @ApiModelProperty({
    required: true,
  })
  public readonly email: string;
}
