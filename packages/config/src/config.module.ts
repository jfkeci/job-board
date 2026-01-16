import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';

/**
 * Options for ConfigModule.forRoot()
 */
export interface ConfigModuleOptions {
  /**
   * If true, the module will be global (no need to import in other modules)
   * @default true
   */
  isGlobal?: boolean;
}

/**
 * NestJS module for configuration management
 * Provides ConfigService for dependency injection
 *
 * @example
 * // app.module.ts
 * import { ConfigModule } from '@job-board/config';
 *
 * @Module({
 *   imports: [ConfigModule.forRoot()],
 * })
 * export class AppModule {}
 */
@Global()
@Module({})
export class ConfigModule {
  /**
   * Register the ConfigModule
   * @param options - Module options
   * @returns Dynamic module configuration
   */
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { isGlobal = true } = options;

    return {
      module: ConfigModule,
      global: isGlobal,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
