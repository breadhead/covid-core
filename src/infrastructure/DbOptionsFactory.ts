
import { Inject } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import Configuration from './Configuration/Configuration'

export default class DbOptionsFactory implements TypeOrmOptionsFactory {
  public constructor(
    @Inject(Configuration) private readonly config: Configuration,
  ) { }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get('DB_HOST').getOrElse('127.0.0.1'),
      port: this.config.get('DB_PORT').map(parseInt).getOrElse(3306),
      username: this.config.get('DB_USER').getOrElse('admin'),
      password: this.config.get('DB_PASSWORD').getOrElse('admin'),
      database: this.config.get('DB_NAME').getOrElse('oncohelp'),
      entities: [__dirname + '/../../**/*.{entity,vo}.ts'],
      synchronize: !this.config
        .get('PRODUCTION_READY')
        .map(parseInt)
        .map(Boolean)
        .getOrElse(true),
    } as TypeOrmModuleOptions
  }
}
