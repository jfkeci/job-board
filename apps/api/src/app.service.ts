import { Injectable } from '@nestjs/common';

import { successResponse } from '@job-board/backend-lib';
import type { ApiResponse } from '@job-board/types';

@Injectable()
export class AppService {
  getHello(): ApiResponse<string> {
    return successResponse('Hello from NestJS API!');
  }

  getHealth(): ApiResponse<{ status: string }> {
    return successResponse({ status: 'ok' }, 'API is healthy');
  }
}
