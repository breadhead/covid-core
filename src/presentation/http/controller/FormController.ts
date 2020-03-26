import {Body, Controller, Inject, NotFoundException, Post} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import FormRequest from '@app/presentation/http/request/FormRequest';
import FormResponse from '@app/presentation/http/response/FormResponse';

import { Form } from '@app/domain/form/Form.entity';
import { FormStatus } from '@app/domain/form/FormStatus';
import {FormUpdateRequest} from "@app/presentation/http/request/FormUpdateRequest";
import {FormRepository} from "@app/domain/form/FormRepository";

@Controller('form')
@ApiUseTags('form')
export class FormController {
  public constructor(
    @InjectEntityManager()
    private readonly saveService,
    @InjectRepository(FormRepository)
    private readonly formRepo: FormRepository,
  ) {}

  @Post('save')
  @ApiOperation({ title: 'Save form result' })
  @ApiCreatedResponse({ description: 'Success', type: FormResponse })
  public async createForm(
    @Body() request: FormRequest,
  ): Promise<FormResponse> {
    let form = new Form(request.type, request.fields, FormStatus.New);

    try {
      await this.saveService.save(form);

    } catch (error) {
      console.log(error);
    }

    return {
      id: form.id || 0,
    } as FormResponse;
  }

  @Post('update')
  @ApiOperation({ title: 'Update form email' })
  @ApiCreatedResponse({ description: 'Success', type: FormResponse })
  public async updateForm(
    @Body() request: FormUpdateRequest,
  ): Promise<FormResponse> {
    const form = await this.formRepo.getOne(request.id);

    if (!form) {
      throw new NotFoundException('form not found');
    }

    form.fields['email'] = request.email;

    try {
      await this.saveService.save(form);

    } catch (error) {
      console.log(error);
    }

    return {
      id: form ? form.id : 0,
    } as FormResponse;
  }
}
