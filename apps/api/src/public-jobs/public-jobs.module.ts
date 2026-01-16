import { Module } from '@nestjs/common';
import { PublicJobsController } from './public-jobs.controller';
import { PublicJobsService } from './public-jobs.service';

@Module({
  controllers: [PublicJobsController],
  providers: [PublicJobsService],
  exports: [PublicJobsService],
})
export class PublicJobsModule {}
