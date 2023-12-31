import { Module } from '@nestjs/common';
import { CronService } from '/src/cron/cron.service';
import { SchedulerModule } from '/src/scheduler/scheduler.module';
import { SystemsModule } from '/src/systems/systems.module';
import { ComponentsModule } from '/src/components/components.module';

@Module({
  imports: [SystemsModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
