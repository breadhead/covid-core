import { ApiModelProperty } from '@nestjs/swagger'
import { FormType } from '@app/domain/form/FormType'

export default class FormRequest {
  @ApiModelProperty({ required: true, enum: FormType })
  public readonly type: FormType

  @ApiModelProperty({
    example: '{"target":"Для себя"}',
    type: JSON,
    required: true,
  })
  public readonly fields: string
}
