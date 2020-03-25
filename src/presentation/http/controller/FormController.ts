import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { InjectEntityManager } from '@nestjs/typeorm';
import FormRequest from '@app/presentation/http/request/FormRequest';
import FormResponse from '@app/presentation/http/response/FormResponse';

import { Form } from '@app/domain/form/Form.entity';
import { FormStatus } from '@app/domain/form/FormStatus';

@Controller('form')
@ApiUseTags('form')
export class FormController {
  public constructor(
    @InjectEntityManager()
    private readonly saveService,
  ) {}

  @Post('save')
  @ApiOperation({ title: 'Save form result' })
  @ApiCreatedResponse({ description: 'Success', type: FormResponse })
  public async sendFeedback(
    @Body() request: FormRequest,
  ): Promise<FormResponse> {
    const form = new Form(request.type, request.fields, FormStatus.New);

    let status = true;

    try {
      await this.saveService.save(form);
    } catch (error) {
      console.log(error);
      status = false;
    }

    return {
      status: status,
    } as FormResponse;
  }
}
