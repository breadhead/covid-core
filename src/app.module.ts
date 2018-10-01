import { Module } from '@nestjs/common'

import * as httpControllers from '@app/presentation/http/controller'

@Module({
  imports: [],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [],
})
export class AppModule {}
