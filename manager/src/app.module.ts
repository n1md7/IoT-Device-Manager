import { Module } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { SetupModule } from '/libs/setup';

@Module({
  imports: [SetupModule, DevicesModule],
})
export class AppModule {}
