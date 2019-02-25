import { MinioUploader, S3Uploader } from '@breadhead/s3-uploader'
import { Injectable } from '@nestjs/common'

import Configuration from '../Configuration/Configuration'
import FileSaver from './FileSaver'

@Injectable()
export class S3FileSaver implements FileSaver {
  private readonly s3Url: string
  private readonly bucket: string
  private readonly uploader: S3Uploader

  public constructor(config: Configuration) {
    this.s3Url = config.getStringOrElse('MINIO_HOST', '')
    this.bucket = config.getStringOrElse('MINIO_BUCKET', 'bucket')

    this.uploader = new MinioUploader(
      config.getStringOrElse('MINIO_ACCESS_KEY', 'Secret'),
      config.getStringOrElse('MINIO_SECRET_KEY', 'Regon'),
      this.s3Url,
      this.bucket,
    )
  }

  public async save(buffer: Buffer, originalName: string) {
    const fileName = await this.uploader.upload(buffer, originalName, true)

    return `${this.s3Url}/${this.bucket}/${fileName}`
  }
}
