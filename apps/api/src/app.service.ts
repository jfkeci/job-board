import { Injectable } from '@nestjs/common';

import { successResponse } from '@borg/backend-lib';
import type { ApiResponse } from '@borg/types';

@Injectable()
export class AppService {
  getHello(): ApiResponse<string> {
    return successResponse('Hello from NestJS API!');
  }

  getHealth(): ApiResponse<{ status: string }> {
    return successResponse({ status: 'ok' }, 'API is healthy');
  }
}
