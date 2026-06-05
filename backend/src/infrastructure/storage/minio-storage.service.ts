import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';

@Injectable()
export class MinioStorageService implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = config.get('MINIO_BUCKET', 'hr-ats');
    this.client = new Minio.Client({
      endPoint: config.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(config.get('MINIO_PORT', '9000'), 10),
      useSSL: config.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: config.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: config.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  async upload(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const objectName = `${folder}/${randomUUID()}.${ext}`;
    await this.client.putObject(this.bucket, objectName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    const endpoint = this.config.get('MINIO_PUBLIC_URL', `http://localhost:9000`);
    return `${endpoint}/${this.bucket}/${objectName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    const objectName = fileUrl.split(`/${this.bucket}/`)[1];
    if (objectName) {
      await this.client.removeObject(this.bucket, objectName);
    }
  }
}
