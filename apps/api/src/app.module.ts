import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@borg/config';
import { LoggerModule, LoggerMiddleware, ExceptionsModule } from '@borg/backend-lib';
import { DatabaseModule, entities } from '@borg/db';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration - loads and validates environment variables
    ConfigModule.forRoot(),

    // Logger - structured logging with correlation IDs
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => ({
        serviceName: 'borg-api',
        environment: (config as ConfigService).nodeEnv,
        logLevel: (config as ConfigService).isProduction ? 'log' : 'debug',
      }),
      inject: [ConfigService],
    }),

    // Exception handling - global HTTP exception filter with i18n
    ExceptionsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => ({
        includeStack: !(config as ConfigService).isProduction,
      }),
      inject: [ConfigService],
    }),

    // TypeORM - database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.getTypeOrmConfig(entities),
      inject: [ConfigService],
    }),

    // Database service facade
    DatabaseModule.forRoot(),

    // Health check endpoint
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply logger middleware to all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
