import { Module } from '@nestjs/common';
import { MathModule } from '/src/math/math.module';
import { ConfigModule } from '/libs/config/config.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [MathModule, ConfigModule, DevicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
