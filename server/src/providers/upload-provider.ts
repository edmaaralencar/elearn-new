import { env } from '@/env'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export class UploadProvider {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      endpoint: `https://${env.CLOUDFARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    })
  }

  async upload({ fileName, fileType, body }: UploadParams) {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body
      })
    )

    return {
      url: uniqueFileName
    }
  }

  filterExtension(permittedExt: string[], mimetype: string): boolean {
    return permittedExt.includes(mimetype)
  }

  async deleteFile(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key
      })
    )
  }
}

export const uploadProvider = new UploadProvider()
