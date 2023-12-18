import { Module } from '@nestjs/common';
import { SystemsService } from './systems.service';
import { SystemsController } from './systems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Client } from '/src/systems/enum/client.enum';
import { SwitchService } from '/src/systems/controls/switch/switch.service';
import { TimerService } from '/src/systems/controls/timer/timer.service';
import { SensorService } from '/src/systems/controls/sensor/sensor.service';
import { ValveService } from '/src/systems/controls/valve/valve.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([System]),
    ClientsModule.register([
      {
        name: Client.SYSTEMS,
        transport: Transport.MQTT,
        options: {
          clientId: 'Systems-Module',
        },
      },
    ]),
  ],
  controllers: [SystemsController],
  providers: [SystemsService, SwitchService, TimerService, SensorService, ValveService],
})
export class SystemsModule {}
