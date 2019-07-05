import { Injectable } from '@nestjs/common'
import { mkdir, writeFile } from 'fs'
import { last } from 'lodash'
import * as md5 from 'md5'
import { promisify } from 'util'

import { Logger } from '@app/utils/infrastructure/Logger/Logger'
import FileSaver from './FileSaver'

const PUBLIC_DIR = 'public'

@Injectable()
export default class LocalFileSaver implements FileSaver {
  private writeFile: (path: string, buffer: Buffer) => Promise<void>
  private ensureDir: (path: string) => Promise<void>

  public constructor(logger: Logger) {
    this.writeFile = (path, buffer) =>
      promisify(writeFile)(`${PUBLIC_DIR}/${path}`, buffer).then(
        () => logger.log(`Upload "${path}" successfully`),
        e => {
          logger.error(`Upload "${path}" failed`)
          throw e
        },
      )

    this.ensureDir = path =>
      promisify(mkdir)(`${PUBLIC_DIR}/${path}`).catch(() => {
        /* pass */
      })
  }

  public async save(buffer: Buffer, originalName: string) {
    const fileName = `upload/${this.getName(buffer)}.${this.getExtension(
      originalName,
    )}`

    await this.ensureDir('upload')
    await this.writeFile(fileName, buffer)

    return fileName
  }

  private getName(buffer: Buffer): string {
    return md5(buffer)
  }

  private getExtension(name: string): string {
    return last(name.split('.'))
  }
}
