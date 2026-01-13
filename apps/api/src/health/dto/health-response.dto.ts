import { ApiProperty } from '@nestjs/swagger';

export class DatabaseHealth {
  @ApiProperty({ enum: ['connected', 'disconnected'] })
  status!: 'connected' | 'disconnected';

  @ApiProperty({ description: 'Database ping latency in milliseconds', required: false })
  latency?: number;
}

export class MemoryHealth {
  @ApiProperty({ description: 'Heap memory used in bytes' })
  heapUsed!: number;

  @ApiProperty({ description: 'Total heap memory in bytes' })
  heapTotal!: number;

  @ApiProperty({ description: 'Resident set size in bytes' })
  rss!: number;

  @ApiProperty({ description: 'External memory in bytes' })
  external!: number;
}

export class HealthResponseDto {
  @ApiProperty({ enum: ['healthy', 'unhealthy'] })
  status!: 'healthy' | 'unhealthy';

  @ApiProperty({ description: 'ISO timestamp of health check' })
  timestamp!: string;

  @ApiProperty({ description: 'Application uptime in seconds' })
  uptime!: number;

  @ApiProperty({ description: 'Application version from package.json' })
  version!: string;

  @ApiProperty({ description: 'Current environment (development, production, test)' })
  environment!: string;

  @ApiProperty({ type: DatabaseHealth })
  database!: DatabaseHealth;

  @ApiProperty({ type: MemoryHealth })
  memory!: MemoryHealth;
}
