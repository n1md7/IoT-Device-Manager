import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { SystemsModule } from '/src/systems/systems.module';
import { CronModule } from '/src/cron/cron.module';
import { System } from '/src/systems/entities/system.entity';

@Module({
  imports: [CronModule, SystemsModule, TypeOrmModule.forFeature([Schedule, System])],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
