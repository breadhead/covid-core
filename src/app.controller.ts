import { Controller, Get } from '@nestjs/common'

import { AppService } from '@app/app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public root(): string {
    return this.appService.root()
  }
}
