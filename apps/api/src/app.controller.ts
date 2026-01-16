import { Controller, Get } from '@nestjs/common';

import type { ApiResponse } from '@job-board/types';

import { AppService } from './app.service';
import { Public } from './auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): ApiResponse<string> {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth(): ApiResponse<{ status: string }> {
    return this.appService.getHealth();
  }
}
