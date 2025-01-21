import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService],
  exports: [AwsService], // Exporte para ser utilizado em outros módulos, se necessário
})
export class AwsModule {}
