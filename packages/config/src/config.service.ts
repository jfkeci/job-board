import { Injectable } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import type { DatabaseConfig, EnvConfig, TypeOrmConfig } from './env.interface';
import { validateEnv } from './env.schema';

/**
 * Configuration service for NestJS applications
 * Loads and validates environment variables on instantiation
 */
@Injectable()
export class ConfigService {
  private readonly config: EnvConfig;

  constructor() {
    this.loadEnvFiles();
    this.config = validateEnv(process.env) as EnvConfig;
  }

  /**
   * Load environment files from the package's env directory
   */
  private loadEnvFiles(): void {
    const envDir = path.resolve(__dirname, 'env');

    const baseEnvPath = path.join(envDir, '.env');
    if (fs.existsSync(baseEnvPath)) {
      dotenvConfig({ path: baseEnvPath });
    }

    const nodeEnv = process.env.NODE_ENV || 'development';
    const envSpecificPath = path.join(envDir, `.env.${nodeEnv}`);
    if (fs.existsSync(envSpecificPath)) {
      dotenvConfig({ path: envSpecificPath, override: true });
    }
  }

  /**
   * Get a configuration value by key
   */
  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  get nodeEnv(): EnvConfig['NODE_ENV'] {
    return this.config.NODE_ENV;
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  get port(): number {
    return this.config.PORT;
  }

  get apiPrefix(): string {
    return this.config.API_PREFIX;
  }

  /**
   * Get base database configuration (without entities)
   */
  get database(): DatabaseConfig {
    return {
      type: 'postgres',
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      username: this.config.DB_USERNAME,
      password: this.config.DB_PASSWORD,
      database: this.config.DB_DATABASE,
      synchronize: this.config.DB_SYNCHRONIZE,
      logging: this.config.DB_LOGGING,
    };
  }

  /**
   * Get TypeORM configuration with entities
   * Use with TypeOrmModule.forRootAsync()
   */
  getTypeOrmConfig(entities: Function[]): TypeOrmConfig {
    return {
      ...this.database,
      entities,
    };
  }
}
