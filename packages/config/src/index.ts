// Types and interfaces
export type { EnvConfig, DatabaseConfig, TypeOrmConfig } from './env.interface';

// Zod schema and validation
export { envSchema, validateEnv } from './env.schema';
export type { EnvSchemaType } from './env.schema';

// NestJS service and module
export { ConfigService } from './config.service';
export { ConfigModule } from './config.module';
export type { ConfigModuleOptions } from './config.module';
