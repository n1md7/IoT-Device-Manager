import { Module } from '@nestjs/common';
import { SystemsService } from './systems.service';
import { SystemsController } from './systems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Client } from '/src/systems/enum/client.enum';
import { SwitchService } from '/src/systems/controls/switch/switch.service';
import { SensorService } from '/src/systems/controls/sensor/sensor.service';
import { ControlService } from './control.service';
import { ComponentsModule } from '/src/components/components.module';

@Module({
  imports: [
    ComponentsModule,
    TypeOrmModule.forFeature([System]),
    ClientsModule.register([
      {
        name: Client.SYSTEMS,
        transport: Transport.MQTT,
        options: {
          clientId: Client.SYSTEMS,
          clean: false, // We want session persistence
          will: {
            topic: `home/managers/${Client.SYSTEMS}/status`,
            payload: JSON.stringify({
              data: {
                who: Client.SYSTEMS,
                status: 'Disconnected',
              },
            }),
            qos: 1, // At least once delivery
            retain: false, // Don't retain the message
          },
        },
      },
    ]),
  ],
  controllers: [SystemsController],
  providers: [SystemsService, SwitchService, SensorService, ControlService],
  exports: [SystemsService, ControlService],
})
export class SystemsModule {}
