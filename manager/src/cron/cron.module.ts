import { Module } from '@nestjs/common';
import { CronService } from '/src/cron/cron.service';
import { SchedulerModule } from '/src/scheduler/scheduler.module';
import { SystemsModule } from '/src/systems/systems.module';

@Module({
  imports: [SchedulerModule, SystemsModule],
  providers: [CronService],
})
export class CronModule {}
