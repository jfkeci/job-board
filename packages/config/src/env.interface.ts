/**
 * Environment configuration interface
 * Defines all environment variables used by backend applications
 */
export interface EnvConfig {
  // App Configuration
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  API_PREFIX: string;

  // Database Configuration (TypeORM PostgreSQL)
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SYNCHRONIZE: boolean;
  DB_LOGGING: boolean;
}

/**
 * TypeORM PostgreSQL connection options
 */
export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

/**
 * Full TypeORM module options with entities
 */
export interface TypeOrmConfig extends DatabaseConfig {
  entities: Function[];
}
