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
   * Load environment files from the project root
   * Searches up from cwd() to find monorepo root (contains pnpm-workspace.yaml)
   */
  private loadEnvFiles(): void {
    const rootDir = this.findMonorepoRoot() || process.cwd();

    // Load base .env file
    const baseEnvPath = path.join(rootDir, '.env');
    if (fs.existsSync(baseEnvPath)) {
      dotenvConfig({ path: baseEnvPath });
    }

    // Load environment-specific .env file (e.g., .env.development)
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envSpecificPath = path.join(rootDir, `.env.${nodeEnv}`);
    if (fs.existsSync(envSpecificPath)) {
      dotenvConfig({ path: envSpecificPath, override: true });
    }

    // Also check .env.local for local overrides (git-ignored)
    const localEnvPath = path.join(rootDir, '.env.local');
    if (fs.existsSync(localEnvPath)) {
      dotenvConfig({ path: localEnvPath, override: true });
    }
  }

  /**
   * Find the monorepo root by looking for pnpm-workspace.yaml
   */
  private findMonorepoRoot(): string | null {
    let dir = process.cwd();
    const root = path.parse(dir).root;

    while (dir !== root) {
      if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }

    return null;
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

  // JWT Configuration
  get jwtSecret(): string {
    return this.config.JWT_SECRET;
  }

  get jwtAccessTokenExpiry(): string {
    return this.config.JWT_ACCESS_TOKEN_EXPIRY;
  }

  get jwtRefreshTokenExpiry(): string {
    return this.config.JWT_REFRESH_TOKEN_EXPIRY;
  }

  get sessionExpiry(): string {
    return this.config.SESSION_EXPIRY;
  }
}
