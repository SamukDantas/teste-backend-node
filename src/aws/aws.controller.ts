import { Controller, Post, Body } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('s3')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  async uploadToS3(
    @Body() body: { bucket: string; key: string; data: string },
  ) {
    const { bucket, key, data } = body;
    const buffer = Buffer.from(data, 'utf-8');
    const result = await this.awsService.uploadObject(bucket, key, buffer);
    return result;
  }
}
