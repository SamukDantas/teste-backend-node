import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadObject(bucket: string, key: string, body: Buffer): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    });

    try {
      const data = await this.s3Client.send(command);
      return data;
    } catch (error) {
      console.error('Erro ao fazer upload no S3:', error);
      throw error;
    }
  }

  async getObject(bucket: string, key: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const data = await this.s3Client.send(command);
      return data;
    } catch (error) {
      console.error('Erro ao obter objeto do S3:', error);
      throw error;
    }
  }
}
