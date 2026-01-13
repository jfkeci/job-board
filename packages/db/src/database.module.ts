import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from './database.service';
import { entities } from './entities';

/**
 * Database module providing DatabaseService and TypeORM repositories
 *
 * @example
 * ```typescript
 * // app.module.ts
 * import { TypeOrmModule } from '@nestjs/typeorm';
 * import { ConfigModule, ConfigService } from '@borg/config';
 * import { DatabaseModule, entities } from '@borg/db';
 *
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot(),
 *     TypeOrmModule.forRootAsync({
 *       imports: [ConfigModule],
 *       useFactory: (config: ConfigService) => config.getTypeOrmConfig(entities),
 *       inject: [ConfigService],
 *     }),
 *     DatabaseModule.forRoot(),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      providers: [DatabaseService],
      exports: [DatabaseService, TypeOrmModule],
    };
  }
}
