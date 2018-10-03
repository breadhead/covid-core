import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { Connection } from 'typeorm'

import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    const connection = app.get<Connection>(Connection)

    const databaseName = connection.options.database

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName};`)
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404)
  })

  afterAll(async () => {
    app.close()
  })
})
