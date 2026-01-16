import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@job-board/config';
import {
  LoggerModule,
  LoggerMiddleware,
  ExceptionsModule,
} from '@job-board/backend-lib';
import { DatabaseModule, entities } from '@job-board/db';

import { AdminModule } from './admin';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications';
import { AuthModule } from './auth';
import { CategoriesModule } from './categories';
import { HealthModule } from './health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { LocationsModule } from './locations';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProfilesModule } from './profiles';
import { PublicJobsModule } from './public-jobs';

@Module({
  imports: [
    // Configuration - loads and validates environment variables
    ConfigModule.forRoot(),

    // Logger - structured logging with correlation IDs
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => ({
        serviceName: 'job-board-api',
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

    // Authentication module
    AuthModule,

    // Organizations module
    OrganizationsModule,

    // Jobs module
    JobsModule,

    // Applications module
    ApplicationsModule,

    // Public Jobs module (for web app)
    PublicJobsModule,

    // Categories module
    CategoriesModule,

    // Locations module
    LocationsModule,

    // Profiles module
    ProfilesModule,

    // Admin module
    AdminModule,

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
