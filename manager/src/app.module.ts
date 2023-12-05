import { Module } from '@nestjs/common';
import { ConfigModule } from '/libs/config/config.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [ConfigModule, DevicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
