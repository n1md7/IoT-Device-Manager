import { Module } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { SetupModule } from '/libs/setup';
import { ComponentsModule } from './components/components.module';
import { SystemsModule } from './systems/systems.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [SetupModule, DevicesModule, ComponentsModule, SystemsModule, SchedulerModule],
})
export class AppModule {}
