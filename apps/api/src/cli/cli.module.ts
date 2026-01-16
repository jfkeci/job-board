import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@job-board/config';
import { DatabaseModule, entities } from '@job-board/db';

import { SeederModule } from '../seeder';

import {
  DbPurgeCommand,
  DbResetCommand,
  DbSeedCommand,
  DbStatusCommand,
} from './commands';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot(),

    // TypeORM database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.getTypeOrmConfig(entities),
      inject: [ConfigService],
    }),

    // Database service facade
    DatabaseModule.forRoot(),

    // Seeder module
    SeederModule,
  ],
  providers: [DbStatusCommand, DbSeedCommand, DbPurgeCommand, DbResetCommand],
})
export class CliModule {}
