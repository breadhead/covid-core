import {
  Controller,
  FileInterceptor,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiImplicitFile,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'

import { Role } from '@app/user/model/Role'
import FileSaver, {
  FileSaver as FileSaverSymbol,
} from '@app/infrastructure/FileSaver/FileSaver'

import FileResponse from '../response/FileResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'

@Controller('file')
@UseGuards(JwtAuthGuard)
@ApiUseTags('file')
@ApiBearerAuth()
export default class FileController {
  public constructor(
    @Inject(FileSaverSymbol) private readonly fileSaver: FileSaver,
  ) {}

  @Post('upload')
  @Roles(Role.Admin, Role.Client)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ title: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true, description: 'Any file' })
  @ApiOkResponse({ description: 'Uploaded', type: FileResponse })
  @ApiForbiddenResponse({
    description: 'Admin`s or client`s API token doesn`t provided ',
  })
  public async upload(@UploadedFile() file): Promise<FileResponse> {
    const { originalname, buffer } = file

    const path = await this.fileSaver.save(buffer, originalname)

    return { path } as FileResponse
  }
}
