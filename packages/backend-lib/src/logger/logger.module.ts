import {
  DynamicModule,
  Module,
  Provider,
  Type,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';

import { LoggerService } from './logger.service';
import { LoggerMiddleware, LOGGER_MODULE_OPTIONS } from './logger.middleware';
import { LoggingInterceptor } from './logging.interceptor';
import type { LoggerModuleOptions } from './types';

export interface LoggerModuleAsyncOptions {
  imports?: Type<unknown>[];
  useFactory: (...args: unknown[]) => LoggerModuleOptions | Promise<LoggerModuleOptions>;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: LOGGER_MODULE_OPTIONS,
      useValue: options,
    };

    const loggerProvider: Provider = {
      provide: LoggerService,
      useFactory: () => {
        return new LoggerService({
          context: options.serviceName,
          isProduction: options.environment === 'production',
          logLevel: options.logLevel,
          redactorConfig: {
            sensitiveFields: options.sensitiveFields,
            piiFields: options.piiFields,
          },
        });
      },
    };

    return {
      module: LoggerModule,
      global: true,
      providers: [optionsProvider, loggerProvider, LoggerMiddleware, LoggingInterceptor],
      exports: [LoggerService, LoggerMiddleware, LoggingInterceptor, LOGGER_MODULE_OPTIONS],
    };
  }

  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: LOGGER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const loggerProvider: Provider = {
      provide: LoggerService,
      useFactory: (moduleOptions: LoggerModuleOptions) => {
        return new LoggerService({
          context: moduleOptions.serviceName,
          isProduction: moduleOptions.environment === 'production',
          logLevel: moduleOptions.logLevel,
          redactorConfig: {
            sensitiveFields: moduleOptions.sensitiveFields,
            piiFields: moduleOptions.piiFields,
          },
        });
      },
      inject: [LOGGER_MODULE_OPTIONS],
    };

    return {
      module: LoggerModule,
      global: true,
      imports: options.imports || [],
      providers: [optionsProvider, loggerProvider, LoggerMiddleware, LoggingInterceptor],
      exports: [LoggerService, LoggerMiddleware, LoggingInterceptor, LOGGER_MODULE_OPTIONS],
    };
  }
}
