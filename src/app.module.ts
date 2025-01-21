import { Module } from '@nestjs/common';
import { ClienteModule } from './clientes/cliente.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [ClienteModule, AwsModule],
})
export class AppModule {}
