import { Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ExceptionI18nService } from './services/exception-i18n.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { EXCEPTIONS_MODULE_OPTIONS } from './types';
import type { ExceptionsModuleOptions } from './types';

export interface ExceptionsModuleAsyncOptions {
  imports?: Type<unknown>[];
  useFactory?: (
    ...args: unknown[]
  ) => Promise<ExceptionsModuleOptions> | ExceptionsModuleOptions;
  inject?: (string | symbol | Type<unknown>)[];
  useClass?: Type<ExceptionsModuleOptions>;
  useExisting?: Type<ExceptionsModuleOptions>;
}

@Module({})
export class ExceptionsModule {
  static forRoot(options: ExceptionsModuleOptions = {}): DynamicModule {
    const optionsProvider: Provider = {
      provide: EXCEPTIONS_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: ExceptionsModule,
      global: true,
      providers: [
        optionsProvider,
        ExceptionI18nService,
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
      exports: [ExceptionI18nService, EXCEPTIONS_MODULE_OPTIONS],
    };
  }

  static forRootAsync(options: ExceptionsModuleAsyncOptions): DynamicModule {
    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);

    return {
      module: ExceptionsModule,
      global: true,
      imports: options.imports || [],
      providers: [
        asyncOptionsProvider,
        ExceptionI18nService,
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
      exports: [ExceptionI18nService, EXCEPTIONS_MODULE_OPTIONS],
    };
  }

  private static createAsyncOptionsProvider(
    options: ExceptionsModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: EXCEPTIONS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    if (options.useClass) {
      return {
        provide: EXCEPTIONS_MODULE_OPTIONS,
        useClass: options.useClass,
      };
    }

    if (options.useExisting) {
      return {
        provide: EXCEPTIONS_MODULE_OPTIONS,
        useExisting: options.useExisting,
      };
    }

    return {
      provide: EXCEPTIONS_MODULE_OPTIONS,
      useValue: {},
    };
  }

  /**
   * Use this method when you want to use the exception filter
   * without registering it globally via APP_FILTER.
   * Useful for testing or when you need manual control.
   */
  static forFeature(): DynamicModule {
    return {
      module: ExceptionsModule,
      providers: [ExceptionI18nService, HttpExceptionFilter],
      exports: [ExceptionI18nService, HttpExceptionFilter],
    };
  }
}
