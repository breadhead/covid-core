import { MinioUploader, S3Uploader } from '@breadhead/s3-uploader'
import { Injectable } from '@nestjs/common'

import { Configuration } from '../../config/Configuration'
import FileSaver from './FileSaver'

@Injectable()
export class S3FileSaver implements FileSaver {
  private readonly s3Url: string
  private readonly publicUrl: string
  private readonly uploader: S3Uploader

  public constructor(config: Configuration) {
    this.s3Url = config.getStringOrThrow('MINIO_HOST')
    this.publicUrl = config.getStringOrElse('MINIO_PUBLIC_URL', this.s3Url)

    this.uploader = new MinioUploader(
      config.getStringOrThrow('MINIO_ACCESS_KEY'),
      config.getStringOrThrow('MINIO_SECRET_KEY'),
      this.s3Url,
      config.getStringOrThrow('MINIO_BUCKET'),
    )
  }

  public async save(buffer: Buffer, originalName: string) {
    const fileName = await this.uploader.upload(buffer, originalName, true)

    return fileName.replace(this.s3Url, this.publicUrl)
  }
}
