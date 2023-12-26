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
          clean: false, // We want session persistence
          will: {
            topic: 'home/device-manager/disconnected',
            // Payload irrelevant atm as it's not used
            // The device will continue to work even if the manager is down
            // Because it already has the information when to shut down
            // And internal(device-level) timer will take care of it
            payload: '{"data": {"cmd": "Reset", "who": "Systems-Module"}}', // Not used atm, just for info
            qos: 1, // At least once delivery
            retain: true, // Retain the message, to be delivered to any new subscribers (the last known state)
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
