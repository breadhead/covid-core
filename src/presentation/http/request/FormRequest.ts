import { ApiModelProperty } from '@nestjs/swagger';

export default class FormRequest {
  @ApiModelProperty({ example: 'Corona' })
  public readonly type: string;

  @ApiModelProperty({
    example: '{"target":"Для себя"}',
    type: JSON,
    required: true,
  })
  public readonly fields: string;
}
