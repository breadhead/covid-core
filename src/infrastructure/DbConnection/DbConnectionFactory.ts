import { Inject } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import Configuration from '../Configuration/Configuration'

export default class DbConnectionFactory implements TypeOrmOptionsFactory {
  public constructor(
    @Inject(Configuration)
    private readonly config: Configuration,
  ) { }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get('DB_HOST').getOrElse('localhost'),
      port: this.config.get('DB_HOST').map(parseInt).getOrElse(3306),
      username: this.config.get('DB_USER').getOrElse('admin'),
      password: this.config.get('DB_PASSWORD').getOrElse('admin'),
      database: this.config.get('DB_NAME').getOrElse('oncohelp'),
      entities: [__dirname + '/**/*.entity.ts'],
      synchronize: true,
    }
  }
}
