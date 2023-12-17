import { Module } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { SetupModule } from '/libs/setup';
import { ComponentsModule } from './components/components.module';
import { SystemsModule } from './systems/systems.module';

@Module({
  imports: [SetupModule, DevicesModule, ComponentsModule, SystemsModule],
})
export class AppModule {}
