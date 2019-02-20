import { DigitalOceanUploader, S3Uploader } from '@breadhead/s3-uploader'
import { Injectable } from '@nestjs/common'

import Configuration from '../Configuration/Configuration'
import FileSaver from './FileSaver'

@Injectable()
export class DigitalOceanFileSaver implements FileSaver {
  private readonly uploader: S3Uploader

  public constructor(config: Configuration) {
    this.uploader = new DigitalOceanUploader(
      config.getStringOrElse('DO_ACCESS_KEY_ID', 'id'),
      config.getStringOrElse('DO_SECRET_ACCESS_KEY', 'Secret'),
      config.getStringOrElse('DO_REGION', 'Regon'),
      config.getStringOrElse('DO_BUCKET', 'Bucket'),
    )
  }

  public async save(buffer: Buffer, originalName: string) {
    return this.uploader.upload(buffer, originalName)
  }
}
