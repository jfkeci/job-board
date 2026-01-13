import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns verbose health status including database, memory, and system information',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    type: HealthResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service unhealthy',
    type: HealthResponseDto,
  })
  async getHealth(): Promise<HealthResponseDto> {
    return this.healthService.getHealth();
  }
}
