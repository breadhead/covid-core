import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DbModule } from '@app/db/db.module'
import { UtilsModule } from '@app/utils/utils.module'

import { UserRepository } from './service/UserRepository'
import { User } from './model/User.entity'
import { UserCreator } from './application/UserCreator'

@Module({
  imports: [DbModule, UtilsModule, TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserCreator],
  exports: [UserRepository, UserCreator],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
