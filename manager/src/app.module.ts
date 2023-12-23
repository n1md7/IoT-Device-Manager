import { Module } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { SetupModule } from '/libs/setup';
import { ComponentsModule } from './components/components.module';
import { SystemsModule } from './systems/systems.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { FeedModule } from './feed/feed.module';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [SetupModule, DevicesModule, ComponentsModule, SystemsModule, SchedulerModule, FeedModule, CronModule],
  providers: [CronService],
})
export class AppModule {}
