import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DbModule } from '@app/db/db.module'
import { UtilsModule } from '@app/utils/utils.module'
import { SenderModule } from '@app/sender/sender.module'

import { UserRepository } from './service/UserRepository'
import { User } from './model/User.entity'
import { UserCreator } from './application/UserCreator'
import { Verificator } from './application/Verificator'

@Module({
  imports: [
    DbModule,
    UtilsModule,
    SenderModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserRepository, UserCreator, Verificator],
  exports: [UserRepository, UserCreator, Verificator],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
