// src/app.controller.ts

import { Controller } from '@nestjs/common';
import { AwsService } from './aws/aws.service';

@Controller()
export class AppController {
  constructor(private readonly awsService: AwsService) {}
}
