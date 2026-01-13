import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ConfigService } from '@borg/config';

import type { HealthResponseDto, DatabaseHealth, MemoryHealth } from './dto/health-response.dto';

// Version from package.json - imported at build time
const packageJson = require('../../package.json');

@Injectable()
export class HealthService {
  private readonly startTime: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.startTime = Date.now();
  }

  async getHealth(): Promise<HealthResponseDto> {
    const database = await this.checkDatabase();
    const memory = this.getMemoryUsage();

    const isHealthy = database.status === 'connected';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: packageJson.version || '0.0.0',
      environment: this.configService.nodeEnv,
      database,
      memory,
    };
  }

  private async checkDatabase(): Promise<DatabaseHealth> {
    try {
      const startTime = Date.now();
      await this.dataSource.query('SELECT 1');
      const latency = Date.now() - startTime;

      return {
        status: 'connected',
        latency,
      };
    } catch {
      return {
        status: 'disconnected',
      };
    }
  }

  private getMemoryUsage(): MemoryHealth {
    const memoryUsage = process.memoryUsage();

    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      rss: memoryUsage.rss,
      external: memoryUsage.external,
    };
  }
}
