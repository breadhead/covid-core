import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

@Module({})
export class UtilsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
