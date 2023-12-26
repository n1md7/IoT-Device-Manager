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
          clientId: 'Systems-Module',
          clean: true,
          will: {
            topic: 'home/device-manager/disconnected',
            payload: '{"data": "Systems-Module"}',
            qos: 1,
            retain: true,
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
